<script setup lang="ts">
import type { Meta } from '@/dto/Meta';
import type { SelectItem } from '@nuxt/ui'
import { useRouteQuery } from '@vueuse/router'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { meta = undefined, disabled, recordName = 'rows', defaultSize = 10 } = defineProps<{
  meta?: Meta,
  disabled?: boolean,
  recordName?: string,
  defaultSize?: number
}>()

defineShortcuts({
  'meta_arrowLeft': () => {
    changePage(-1)
  },
  'meta_arrowRight': () => {
    changePage(1)
  }
})

const route = useRoute();

const { t } = useI18n()
const page = useRouteQuery('page', undefined, { transform: Number })
const pageSize = useRouteQuery('pageSize', undefined, { transform: Number })

const availableSize = ref<SelectItem[]>([
  5,
  10,
  20,
  25,
  50,
  100,
])
const totalData = ref<number>()

const dataRange = computed<number[]>(() => {
  if (!meta) return [0, 0]
  const start = meta.totalData ? ((meta.page - 1) * meta.pageSize) + 1 : 0;
  const end = meta.page * meta.pageSize > meta.totalData ? meta.totalData : meta.page * meta.pageSize;
  return [start, end]
})

const totalPage = computed(() => {
  if (!totalData.value) return 1
  return Math.ceil(totalData.value / pageSize.value)
})

onBeforeMount(() => {
  if (!page.value) {
    page.value = 1
  }
  if (!pageSize.value) {
    pageSize.value = defaultSize
  }
})

function changePage(direction: number) {
  if (page.value === 1 && direction < 0) return;
  if (page.value === totalPage.value && direction > 0) return;
  page.value += direction
}

watch(() => route.query, (value, oldValue) => {
  const restValue = { ...value };
  delete restValue.page;

  const restOldValue = { ...oldValue };
  delete restOldValue.page;

  let changedQuery: string = '';

  const otherChanged = Object.keys(restValue).some(
    key => {
      if (Array.isArray(restValue[key])) {
        const oldArray = (restOldValue[key] || []) as string[];
        const currentArray = (restValue[key] || []) as string[];

        const isChange = JSON.stringify(oldArray.sort()) !== JSON.stringify(currentArray.sort());

        if (isChange) {
          changedQuery = key;
        }

        return isChange;
      }

      const isChange = restValue[key] !== restOldValue[key];

      if (isChange) {
        changedQuery = key;
      }

      return isChange
    }
  )

  if (otherChanged && changedQuery && !['asc', 'desc'].includes(changedQuery)) {
    page.value = 1
  }

}, { deep: true })

watch(() => meta, () => {
  if (meta) {
    totalData.value = meta.totalData
  }
})
</script>

<template>
  <section class="p-4 flex justify-between items-center border-t border-default pt-4">
    <p>
      <span
        v-if="dataRange.length"
        class="text-muted"
      >
        {{ t('pagination-info', {
          lowerLimit: dataRange[0], upperLimit: dataRange[1], totalData: meta?.totalData,
          dataLabel: t(recordName, 2)
        }) }}
      </span>
    </p>
    <section class="flex items-center gap-x-4">
      <USelect
        v-model="pageSize"
        :items="availableSize"
        :ui="{ content: 'z-10' }"
      />
      <UPagination
        v-model:page="page"
        :total="totalData"
        :items-per-page="pageSize"
        :disabled="disabled"
        show-edges
      />
    </section>
  </section>
</template>
