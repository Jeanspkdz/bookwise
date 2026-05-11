import type { FileRouter } from 'uploadthing/h3'
import { createUploadthing } from 'uploadthing/h3'
import { UTApi } from 'uploadthing/server'

export const utpAPI = new UTApi()
const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  bookImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('file url', file.ufsUrl)
    }),
  bookVideo: f({
    video: {
      maxFileSize: '16MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('file url', file.ufsUrl)
    }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
