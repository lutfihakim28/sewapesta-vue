<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { useTemplateRef, watch } from 'vue';

const dropZone = useTemplateRef<HTMLElement>('drop-zone')

const { files } = useDropZone(dropZone, {
  onDrop: selectFile,
  dataTypes: ['text/csv'],
  preventDefaultForUnhandled: false,
})

function selectFile(files: File[] | null) {
    console.log(files)
}

function onChange(event: Event) {
  console.log(event)
}

watch(files, (value) => {
  console.log('watch', value)
})
</script>

<template>
  <label ref="drop-zone" for="file">
    <div class="w-full border border-dashed border-default rounded h-36 bg-muted/20 flex items-center justify-center">
      <div class="opacity-50 flex items-center justify-center gap-x-2">
        <UIcon name="i-lucide-import" class="text-2xl " />
        <p class="italic">Click or drop file here...</p>
      </div>
    </div>
    <UInput id="file" accept="text/csv" type="file" class="hidden" @change="onChange" />
  </label>
</template>