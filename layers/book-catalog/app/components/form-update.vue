<template>
  <UForm
    ref="book-form-update"
    v-slot="{ loading }"
    :schema="updateBookSchema"
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
      <div
        v-if="initialImageUrl"
        class="mb-2 flex justify-center"
      >
        <UButton
          size="xs"
          class="mx-auto justify-center"
          color="neutral"
          variant="subtle"
          label="Current Image"
          icon="i-lucide-image"
          @click="openMediaUrl(initialImageUrl)"
        />
      </div>

      <UFileUpload
        v-model="state.bookImage"
        variant="area"
        accept="image/*"
        label="Upload a new image"
        color="primary"
        highlight
        description="Keep empty to preserve current image. Accepted formats: JPG, PNG, WEBP. Max size: 10MB"
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
      <div
        v-if="initialVideoUrl"
        class="mb-2 flex justify-center"
      >
        <UButton
          size="xs"
          color="neutral"
          variant="subtle"
          label="Current Video"
          icon="i-lucide-video"
          @click="openMediaUrl(initialVideoUrl)"
        />
      </div>

      <UFileUpload
        v-model="state.bookVideo"
        variant="area"
        accept="video/*"
        color="primary"
        highlight
        label="Upload a new video"
        description="Keep empty to preserve current video. Accepted formats: MP4, WEBM. Max size: 20MB"
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
      label="Update Book"
      type="submit"
      class="w-full justify-center"
      :disabled="!formRef?.dirty"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const formRef = useTemplateRef('book-form-update')

const props = defineProps<{
  initialValues: {
    name: string
    author: string
    category: string
    description: string
    rating: number
    totalBooks: number
    coverColor: string
    summary: string
    imageUrl?: string
    videoUrl?: string
  }
  onUpdate: (payload: UpdateBookSchema) => Promise<void>
}>()

const state: UpdateBookSchema = reactive({
  author: props.initialValues.author,
  bookImage: undefined,
  bookVideo: undefined,
  description: props.initialValues.description,
  rating: props.initialValues.rating,
  category: props.initialValues.category,
  coverColor: props.initialValues.coverColor,
  summary: props.initialValues.summary,
  totalBooks: props.initialValues.totalBooks,
  name: props.initialValues.name,
})

const initialImageUrl = computed(() => props.initialValues.imageUrl)
const initialVideoUrl = computed(() => props.initialValues.videoUrl)

const openMediaUrl = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const handleSubmit = async (e: FormSubmitEvent<UpdateBookSchema>) => {
  await props.onUpdate(e.data)
}
</script>

<style scoped></style>
