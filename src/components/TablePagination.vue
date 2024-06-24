<script setup lang="ts">
import {
  Pagination,
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Meta } from '@/schemas/MetaSchema';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  totalPage: number,
}>()
const emit = defineEmits<{
  change: [pagination: Omit<Meta, 'totalPage'>]
}>()

const activePage = ref(1);
const limit = ref('10');

const limits = ['5', '10', '25', '50', '100'];

const totalData = computed(() => {
  return Number(limit.value) * props.totalPage;
})

function emitData() {
  emit('change', {
    limit: limit.value,
    page: activePage.value,
  })
}

function updatePage(_page: number) {
  activePage.value = _page;
  paginationChange(true)
}

function paginationChange(isPage?: boolean) {
  if (!isPage) {
    activePage.value = 1;
  }
  emitData();
}
</script>

<template>
  <section class="flex items-center justify-between w-full">
    <section class="flex items-center gap-x-2">
      <p class="text-sm">Data per halaman:</p>
      <Select v-model="limit" @update:model-value="() => paginationChange()">
        <SelectTrigger class="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="limit in limits" :value="limit.toString()" :key="limit">
              {{ limit }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
    <Pagination :page="activePage" v-slot="{ page }" show-edges :items-per-page="Number(limit)" :total="totalData"
      :sibling-count="1" @update:page="updatePage">
      <PaginationList v-slot="{ items }" class="flex items-center gap-x-2">
        <PaginationPrev />
        <template v-for="(item, index) in items">
          <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
            <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>
        <PaginationNext />
      </PaginationList>
    </Pagination>
  </section>
</template>