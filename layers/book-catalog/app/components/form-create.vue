<template>
  <UForm
    ref="book-form-create"
    v-slot="{ loading }"
    :schema="createBookSchema"
    :state="state"
    :validate-on="['change', 'blur', 'input']"
    class="border-default mx-auto w-xl space-y-5 rounded-2xl border bg-white p-5 shadow-xl"
    @submit="handleSubmit"
  >
    <UFormField
      label="Book Title"
      name="name"
    >
      <UInput
        v-model="state.name"
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
      name="category"
    >
      <UInput
        v-model="state.category"
        placeholder="Enter the genre of the book"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Description"
      name="description"
    >
      <UTextarea
        v-model="state.description"
        placeholder="Write a brief description of the book"
        class="w-full"
        :rows="4"
        :ui="{
          base: 'field-sizing-content resize-none',
        }"
      />
    </UFormField>

    <div class="flex gap-4">
      <UFormField
        class="flex-1/2"
        label="Rating"
        name="rating"
      >
        <UInputNumber
          v-model="state.rating"
          placeholder="Enter the rating of the book"
          class="w-full"
          orientation="vertical"
          :max="5"
          :min="1"
        />
      </UFormField>

      <UFormField
        class="flex-1/2"
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
    </div>

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
          :disabled="loading"
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
        :ui="{
          base: 'field-sizing-content resize-none',
        }"
      />
    </UFormField>

    <UButton
      label="Create Book"
      type="submit"
      :loading="loading"
      class="w-full justify-center"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  onCreate: (payload: CreateBookSchema) => Promise<void>
}>()

const state: CreateBookSchema = reactive({
  author: '',
  bookImage: null as unknown as File,
  bookVideo: null as unknown as File,
  description: '',
  rating: 3,
  category: '',
  coverColor: '#ffffff',
  summary: '',
  totalBooks: 1,
  name: '',
})

const resetForm = () => {
  state.author = ''
  state.bookImage = null as unknown as File
  state.bookVideo = null as unknown as File
  state.description = ''
  state.rating = 3
  state.category = ''
  state.coverColor = '#ffffff'
  state.summary = ''
  state.totalBooks = 1
  state.name = ''
}

const handleSubmit = async (e: FormSubmitEvent<CreateBookSchema>) => {
  await props.onCreate(e.data)
  resetForm()
}
</script>

<style scoped></style>
