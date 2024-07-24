<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue';
import { useTableMaxSize } from '@/composables/useTablemaxSize';
import { OwnerDto } from '@/dtos/OwnerDto';
import { OwnerQueryDto } from '@/dtos/OwnerQueryDto';
import { OwnerTypeEnum, OwnerTypeOptions } from '@/enums/OwnerTypeEnum';
import { debounce } from '@/utils/debounce';
import { useOwnerStore } from '@/stores/ownerStore';
import { Search24Filled } from '@vicons/fluent';
import {
  DataTableColumn,
  DataTableSortState,
  NButton,
  NDataTable,
  NDivider,
  NIcon,
  NInput,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NRadio,
  NRadioGroup,
  NSpace,
  NText,
  PaginationProps,
  useLoadingBar,
} from 'naive-ui';
import { HTMLAttributes, computed, onMounted, reactive, ref, withModifiers } from 'vue';

const loadingBar = useLoadingBar();
const { height } = useTableMaxSize();
const ownerStore = useOwnerStore();

const columns: Array<DataTableColumn<OwnerDto>> = [
  {
    title: 'ID',
    key: 'id',
    defaultSortOrder: 'ascend',
    sorter: 'default',
    width: 64,
    fixed: 'left',
  },
  {
    title: 'Nama',
    key: 'name'
  },
  {
    title: 'Nomor HP',
    key: 'phone'
  },
  {
    title: 'Jenis Pemilik',
    key: '_type'
  },
]
const rowProps = (row: OwnerDto): HTMLAttributes => {
  return {
    style: {
      cursor: 'pointer',
    },
    onClick: withModifiers(() => {
      console.log(row.id)
    }, ['self'])
  }
}
const rowKey = (owner: OwnerDto) => owner.id;
const pagination = reactive<PaginationProps>({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 25, 50],
  showQuickJumper: true,
})
const sorter = reactive<{ sort: 'asc' | 'desc' | undefined, sortBy: string | undefined }>({
  sort: undefined,
  sortBy: undefined
})
const keyword = ref<string>()

const assetOwnerTable = ref();
const searchInput = ref<HTMLInputElement>();
const loading = ref(false);
const selectedType = ref<OwnerTypeEnum | 'all'>('all');

const owners = computed(() => ownerStore.owners)

onMounted(async () => {
  await getOwners();
})

async function getOwners() {
  try {
    loadingBar.start();
    loading.value = true;
    const query = new OwnerQueryDto({
      page: pagination.page || 1,
      pageSize: pagination.pageSize || 10,
      sort: sorter.sort,
      sortBy: sorter.sortBy,
      keyword: keyword.value,
      type: selectedType.value === 'all' ? undefined : selectedType.value,
    });
    const response = await ownerStore.getOwners(query);
    pagination.pageCount = response.pageCount;
    loadingBar.finish();
  } catch (error) {
    loadingBar.error();
  } finally {
    loading.value = false;
  }
}

function handlePageChange(page: number) {
  pagination.page = page;
  getOwners()
}
function handlePageSizeChange(pageSize: number) {
  pagination.page = 1;
  pagination.pageSize = pageSize;
  getOwners();
}
function handleSorterChange(options: DataTableSortState) {
  if (options.order === 'ascend') {
    sorter.sort = 'asc';
  } else if (options.order === 'descend') {
    sorter.sort = 'desc';
  }
  sorter.sortBy = options.columnKey.toString().replace('_', '');
  getOwners()
}

const handleSearch = debounce(async () => {
  if (!keyword.value || keyword.value.length >= 3) {
    await getOwners()

    searchInput.value?.focus();
  }
})

function refresh() {
  keyword.value = '';
  sorter.sort = undefined;
  sorter.sortBy = undefined;
  pagination.page = 1;
  pagination.pageSize = 10;
  selectedType.value = 'all';
  getOwners()
}
</script>

<template>
  <AppLayout @refresh="refresh">
    <NLayout has-sider content-style="padding: 1rem;" :native-scrollbar="false" sider-placement="right">
      <NLayoutContent :native-scrollbar="false">
        <NDataTable ref="assetOwnerTable" remote :row-key="rowKey" :row-props="rowProps" :columns="columns"
          :data="owners" :max-height="height - 64" :loading="loading" :pagination="(pagination as PaginationProps)"
          @update:sorter="handleSorterChange" @update:page="handlePageChange" @update:page-size="handlePageSizeChange">
        </NDataTable>
      </NLayoutContent>

      <NLayoutSider style="background: transparent" content-style="padding: 1rem; padding-top: 0">
        <NSpace vertical style="padding-top: 8px">
          <NButton type="primary" block>Tambah pemilik</NButton>
          <NDivider title-placement="center">Filter</NDivider>
          <NSpace vertical>
            <NText style="opacity: 0.6">Pencarian</NText>
            <NInput ref="searchInput" v-model:value="keyword" placeholder="Nama atau nomor HP..." clearable
              :disabled="loading" @input="handleSearch">
              <template #prefix>
                <NIcon :component="Search24Filled"></NIcon>
              </template>
            </NInput>
          </NSpace>
          <NSpace vertical>
            <NText style="opacity: 0.6">Jenis Pemilik</NText>
            <NRadioGroup v-model:value="selectedType" @update:value="getOwners">
              <NSpace vertical>
                <NRadio value="all" label="Semua" />
                <NRadio v-for="option in OwnerTypeOptions" :key="option.value" :value="option.value"
                  :label="option.label" />
              </NSpace>
            </NRadioGroup>
          </NSpace>
        </NSpace>
      </NLayoutSider>
    </NLayout>
  </AppLayout>
</template>