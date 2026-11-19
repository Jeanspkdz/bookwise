import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import postgres from 'postgres'
import sharp from 'sharp'
import { UTApi, UTFile } from 'uploadthing/server'

const MAX_WIDTH = 600
const MAX_HEIGHT = 960
const WEBP_QUALITY = 82
const PAGE_SIZE = 500
const RETRIES = 4
const REPORT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'reports')
const IMAGE_EXTENSION = /\.(?:avif|bmp|gif|heic|heif|jpe?g|png|svg|tiff?|webp)$/i
const startedAt = new Date()
const reportRows = []
let cleanupStatus = 'no ejecutada'

const safeError = (error) => {
  if (error?.cause?.code) return `${error.name ?? 'Error'} (${error.cause.code})`
  if (error?.status) return `HTTP ${error.status}`
  return error?.name ?? 'Unknown error'
}

const retry = async (label, operation) => {
  let lastError

  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      console.error(`${label}: ${safeError(error)} (intento ${attempt}/${RETRIES})`)
      if (attempt < RETRIES)
        await new Promise((resolve) => setTimeout(resolve, 800 * 2 ** (attempt - 1)))
    }
  }

  throw lastError
}

const slug = (value) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'book'

const keyFromUrl = (value) => {
  const url = new URL(value)
  if (!/(^|\.)ufs\.sh$|(^|\.)uploadthing\.com$/i.test(url.hostname)) return null
  const parts = url.pathname.split('/').filter(Boolean)
  return decodeURIComponent(parts.at(-1) ?? '') || null
}

const fetchImage = async (url) =>
  retry('Descarga de portada', async () => {
    const response = await fetch(url, { signal: AbortSignal.timeout(45_000) })
    if (!response.ok)
      throw Object.assign(new Error('Image request failed'), { status: response.status })
    const contentType = response.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase()
    if (contentType && !contentType.startsWith('image/')) {
      throw new Error('Source did not return an image')
    }
    return Buffer.from(await response.arrayBuffer())
  })

const verifyWebp = async (url) => {
  const response = await retry('Solicitud HTTP de verificación', async () => {
    const response = await fetch(url, { signal: AbortSignal.timeout(45_000) })
    if (!response.ok)
      throw Object.assign(new Error('WebP request failed'), { status: response.status })
    return response
  })

  const contentType = response.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase()
  if (contentType !== 'image/webp') throw new Error('URL did not respond as image/webp')

  const buffer = Buffer.from(await response.arrayBuffer())
  const metadata = await sharp(buffer).metadata()
  if (
    metadata.format !== 'webp' ||
    !metadata.width ||
    !metadata.height ||
    metadata.width > MAX_WIDTH ||
    metadata.height > MAX_HEIGHT
  ) {
    throw new Error('WebP dimensions or format are invalid')
  }

  return { width: metadata.width, height: metadata.height }
}

const listAllFiles = async (utapi) => {
  const files = []
  let offset = 0

  while (true) {
    const page = await retry('Inventario de UploadThing', () =>
      utapi.listFiles({ limit: PAGE_SIZE, offset }),
    )
    files.push(...page.files)
    if (page.files.length < PAGE_SIZE) return files
    offset += page.files.length
  }
}

const uploadOptimized = async (utapi, book, buffer) => {
  const customId = `book-cover-${book.id}-webp`
  const files = await listAllFiles(utapi)
  const existing = files
    .filter((file) => file.customId === customId && file.status === 'Uploaded')
    .sort((a, b) => b.uploadedAt - a.uploadedAt)

  for (const file of existing) {
    const candidateUrl = `https://${new URL(book.imageUrl).hostname}/f/${encodeURIComponent(file.key)}`
    try {
      await verifyWebp(candidateUrl)
      return { key: file.key, url: candidateUrl }
    } catch {
      // A previous interrupted attempt may have left an incomplete or invalid upload.
    }
  }

  const file = new UTFile([buffer], `${slug(book.name)}-${book.id}.webp`, {
    type: 'image/webp',
    customId,
  })
  const [result] = await retry('Subida a UploadThing', () => utapi.uploadFiles([file]))
  if (!result || result.error || !result.data?.ufsUrl || !result.data?.key) {
    throw new Error('UploadThing did not confirm the uploaded file')
  }

  return { key: result.data.key, url: result.data.ufsUrl }
}

const markdownCell = (value) =>
  String(value ?? '')
    .replaceAll('|', '\\|')
    .replaceAll('\n', ' ')

const writeReport = async (rows, cleanup, startedAt) => {
  await mkdir(REPORT_DIR, { recursive: true })
  const finishedAt = new Date()
  const reportPath = join(
    REPORT_DIR,
    `book-cover-migration-${finishedAt.toISOString().replaceAll(':', '-')}.md`,
  )
  const content = [
    '# Informe de migración de portadas',
    '',
    `- Inicio: ${startedAt.toISOString()}`,
    `- Fin: ${finishedAt.toISOString()}`,
    `- Registros: ${rows.length}`,
    `- Limpieza de UploadThing: ${cleanup}`,
    '',
    '| Libro | Estado | URL | Detalle |',
    '| --- | --- | --- | --- |',
    ...rows.map(
      (row) =>
        `| ${markdownCell(row.name)} | ${markdownCell(row.status)} | ${markdownCell(row.url)} | ${markdownCell(row.detail)} |`,
    ),
    '',
  ].join('\n')
  await writeFile(reportPath, content, 'utf8')
  return reportPath
}

const main = async () => {
  if (!process.env.NUXT_DATABASE_URL) throw new Error('NUXT_DATABASE_URL is not configured')
  if (!process.env.UPLOADTHING_TOKEN) throw new Error('UPLOADTHING_TOKEN is not configured')

  const db = postgres(process.env.NUXT_DATABASE_URL, { prepare: false, max: 1 })
  const utapi = new UTApi({ logLevel: 'Fatal' })

  try {
    const books = await db`select id, name, "imageUrl", "imageKey" from public.book order by id`
    console.log(`Portadas encontradas: ${books.length}`)

    for (const book of books) {
      const row = {
        id: book.id,
        name: book.name,
        status: 'fallida',
        url: book.imageUrl,
        detail: '',
      }
      reportRows.push(row)

      try {
        try {
          const dimensions = await verifyWebp(book.imageUrl)
          const key = keyFromUrl(book.imageUrl) || book.imageKey
          if (!key) throw new Error('Optimized image has no identifiable UploadThing key')
          if (book.imageKey !== key) {
            await db`
              update public.book
              set "imageKey" = ${key}, "updatedAt" = now()
              where id = ${book.id} and "imageUrl" = ${book.imageUrl}
            `
          }
          row.status = 'omitida'
          row.detail = `Ya era WebP válida (${dimensions.width} × ${dimensions.height})`
          row.key = key
          console.log(`Omitida: ${book.name}`)
          continue
        } catch {
          // Existing image needs conversion or is not reachable as a verified WebP.
        }

        const source = await fetchImage(book.imageUrl)
        const optimized = await sharp(source)
          .rotate()
          .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer()
        const metadata = await sharp(optimized).metadata()

        if (
          metadata.format !== 'webp' ||
          !metadata.width ||
          !metadata.height ||
          metadata.width > MAX_WIDTH ||
          metadata.height > MAX_HEIGHT
        ) {
          throw new Error('Optimized image failed local validation')
        }

        const uploaded = await retry('Proceso de portada', () =>
          uploadOptimized(utapi, book, optimized),
        )
        const dimensions = await verifyWebp(uploaded.url)
        const [updated] = await db`
          update public.book
          set "imageUrl" = ${uploaded.url}, "imageKey" = ${uploaded.key}, "updatedAt" = now()
          where id = ${book.id} and "imageUrl" = ${book.imageUrl}
          returning id
        `
        if (!updated) throw new Error('Database row changed before its URL could be updated')

        row.status = 'migrada'
        row.url = uploaded.url
        row.key = uploaded.key
        row.detail = `Verificada (${dimensions.width} × ${dimensions.height})`
        console.log(`Migrada: ${book.name}`)
      } catch (error) {
        row.status = 'fallida'
        row.detail = safeError(error)
        console.error(`Falló ${book.name}: ${row.detail}`)
      }
    }

    if (reportRows.some((row) => row.status === 'fallida')) {
      cleanupStatus =
        'detenida: hay portadas que no se migraron o verificaron; se conservaron las imágenes existentes'
      const reportPath = await writeReport(reportRows, cleanupStatus, startedAt)
      console.error(`Migración incompleta; informe: ${reportPath}`)
      process.exitCode = 1
      return
    }

    const currentBooks =
      await db`select id, name, "imageUrl", "imageKey" from public.book order by id`
    if (currentBooks.length !== books.length) throw new Error('Book count changed during migration')

    const keepKeys = new Set()
    for (const book of currentBooks) {
      const key = keyFromUrl(book.imageUrl) || book.imageKey
      if (!key) throw new Error(`Book ${book.id} has no identifiable UploadThing key`)
      await verifyWebp(book.imageUrl)
      keepKeys.add(key)
    }

    const allFiles = await listAllFiles(utapi)
    const imageFiles = allFiles.filter((file) => IMAGE_EXTENSION.test(file.name))
    const obsoleteImages = imageFiles.filter((file) => !keepKeys.has(file.key))
    cleanupStatus = `en proceso: ${obsoleteImages.length} imágenes antiguas/huérfanas`
    console.log(`Imágenes antiguas/huérfanas a limpiar: ${obsoleteImages.length}`)

    for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
      const currentFiles = await listAllFiles(utapi)
      const remaining = currentFiles.filter(
        (file) => IMAGE_EXTENSION.test(file.name) && !keepKeys.has(file.key),
      )
      if (remaining.length === 0) break

      const result = await retry('Borrado de imágenes antiguas', () =>
        utapi.deleteFiles(remaining.map((file) => file.key)),
      )
      console.log(`Limpieza ${attempt}/${RETRIES}: ${result.deletedCount}/${remaining.length}`)
      if (attempt === RETRIES) {
        const after = await listAllFiles(utapi)
        if (after.some((file) => IMAGE_EXTENSION.test(file.name) && !keepKeys.has(file.key))) {
          throw new Error('UploadThing still contains unreferenced images after cleanup retries')
        }
      }
    }

    const remainingFiles = await listAllFiles(utapi)
    const remainingImages = remainingFiles.filter(
      (file) => IMAGE_EXTENSION.test(file.name) && !keepKeys.has(file.key),
    )
    if (remainingImages.length > 0)
      throw new Error(`${remainingImages.length} old UploadThing image(s) remain`)
    cleanupStatus = `completada: ${obsoleteImages.length} imágenes antiguas/huérfanas eliminadas; ${remainingFiles.filter((file) => !IMAGE_EXTENSION.test(file.name)).length} archivos no-imagen conservados`

    for (const book of currentBooks) {
      await verifyWebp(book.imageUrl)
    }

    const reportPath = await writeReport(reportRows, cleanupStatus, startedAt)
    console.log(`Migración completada para ${books.length} portadas; informe: ${reportPath}`)
  } finally {
    await db.end()
  }
}

main().catch(async (error) => {
  console.error(`Migración detenida: ${safeError(error)}`)
  if (reportRows.length) {
    try {
      const reportPath = await writeReport(reportRows, cleanupStatus, startedAt)
      console.error(`Informe: ${reportPath}`)
    } catch {
      console.error('No se pudo escribir el informe Markdown')
    }
  }
  process.exitCode = 1
})
