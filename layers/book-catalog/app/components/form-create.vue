<template>
  <UForm
    :schema="createBookSchema"
    :state="state"
    :validate-on="['change', 'blur', 'input']"
    class="border-default mx-auto w-xl space-y-5 rounded-2xl border bg-white p-5 shadow-xl"
    @submit="handleSubmit"
  >
    <UFormField
      label="Book Title"
      name="title"
    >
      <UInput
        v-model="state.title"
        placeholder="Enter the book title"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Author"
      name="author"
    >
      <UInput
        v-model="state.author"
        placeholder="Enter the author name"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Genre"
      name="genre"
    >
      <UInput
        v-model="state.genre"
        placeholder="Enter the genre of the book"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Total number of books"
      name="totalBooks"
    >
      <UInputNumber
        v-model="state.totalBooks"
        orientation="vertical"
        placeholder="Enter the total number of books"
        class="w-full"
        :min="1"
      />
    </UFormField>

    <UFormField
      label="Book Image"
      name="bookImage"
    >
      <UFileUpload
        v-model="state.bookImage"
        variant="area"
        accept="image/*"
        label="Upload an image"
        color="primary"
        highlight
        description="Choose a book cover image. Accepted formats: JPG, PNG, WEBP. Max size: 10MB"
        class="w-full"
        :ui="{
          base: 'w-full justify-center',
        }"
        size="lg"
      />
    </UFormField>

    <UFormField
      label="Book Primary Color"
      name="coverColor"
    >
      <UPopover>
        <UButton
          color="primary"
          variant="soft"
          class="justify-start"
        >
          <span
            class="ring-accented size-3 rounded-full ring ring-inset"
            :style="{ backgroundColor: state.coverColor }"
          />
          <span>{{ state.coverColor }}</span>
        </UButton>

        <template #content>
          <UColorPicker v-model="state.coverColor" />
        </template>
      </UPopover>
    </UFormField>

    <UFormField
      label="Book Video"
      name="bookVideo"
    >
      <UFileUpload
        v-model="state.bookVideo"
        variant="area"
        accept="video/*"
        color="primary"
        highlight
        label="Upload a video"
        description="Choose a short video for the book presentation (MP4, WEBM). Max size: 20MB"
        class="w-full"
        :ui="{ base: 'w-full justify-center' }"
        size="lg"
      />
    </UFormField>

    <UFormField
      label="Book Summary"
      name="summary"
    >
      <UTextarea
        v-model="state.summary"
        placeholder="Write a brief summary of the book"
        class="w-full"
        :rows="7"
      />
    </UFormField>

    <UButton
      label="Update Book"
      type="submit"
      class="w-full justify-center"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'

const MB = 1024 * 1024

const createBookSchema = z.object({
  title: z.string().min(1, { error: 'Enter a valid book title' }),
  author: z.string().min(1, { error: 'Enter a valid author name' }),
  genre: z.string().min(1, { error: 'Enter a valid genre' }),
  totalBooks: z.coerce.number().min(1, { error: 'Enter a number greater than 0' }),
  bookImage: z
    .file({ error: 'Please upload a book image' }) // required
    .max(10 * MB, 'Image must be smaller than 10MB') // size
    .mime(['image/jpeg', 'image/png', 'image/webp'], 'Only JPG, PNG, or WEBP images are allowed'),
  coverColor: z.stringFormat('hex-color', /^#([0-9a-fA-F]{6})$/, {
    error: 'Enter a valid hex color',
  }),
  bookVideo: z.file().max(20 * MB),
  summary: z.string().min(10, { error: 'Summary must be at least 10 characters' }),
})

type CreateBookSchema = z.infer<typeof createBookSchema>

const state: CreateBookSchema = reactive({
  author: '',
  bookImage: null,
  bookVideo: null,
  genre: '',
  coverColor: '#ffffff',
  summary: '',
  totalBooks: 0,
  title: '',
})

const handleSubmit = (e: FormSubmitEvent<CreateBookSchema>) => {
  console.log(e.data)
}
</script>

<style scoped></style>
