<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue';
import { useTableMaxSize } from '@/composables/useTablemaxSize';
import { AssetDto } from '@/dtos/AssetDto';
import { AssetQueryDto } from '@/dtos/AssetQueryDto';
import { debounce } from '@/lib/debounce';
import { useAssetStore } from '@/stores/assetStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { Search24Filled } from '@vicons/fluent';
import {
  DataTableColumn,
  DataTableSortState,
  NButton,
  NCheckbox,
  NDataTable,
  NDivider,
  NIcon,
  NInput,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NSelect,
  NSpace,
  NText,
  NTooltip,
  PaginationProps,
  useLoadingBar,
} from 'naive-ui';
import { HTMLAttributes, computed, h, onMounted, reactive, ref, withModifiers } from 'vue';
import { RouterLink } from 'vue-router';

const loadingBar = useLoadingBar();
const { height } = useTableMaxSize();
const assetStore = useAssetStore();
const categoryStore = useCategoryStore();

const columns: Array<DataTableColumn<AssetDto>> = [
  {
    title: 'ID',
    key: 'id',
    defaultSortOrder: 'ascend',
    sorter: 'default',
    width: 64,
    fixed: 'left',
  },
  {
    title: 'Nama Aset',
    key: 'name',
    defaultSortOrder: false,
    sorter: 'default',
    fixed: 'left',
    width: 128,
    render: (asset) => {
      const props: InstanceType<typeof NTooltip>['$props'] = {
        trigger: 'hover',
      }
      return h(NTooltip, props, {
        default: () => asset.name,
        trigger: () => asset.name,
      })
    }
  },
  {
    title: 'Pemilik',
    key: 'owner.name',
    ellipsis: true,
    width: 256,
    render: (asset) => {
      const linkProps: InstanceType<typeof RouterLink>['$props'] = {
        to: '/asset-owners',
      }
      const tooltipProps: InstanceType<typeof NTooltip>['$props'] = {
        trigger: 'hover',
      }
      return h(NTooltip, tooltipProps, {
        default: () => asset.owner.name,
        trigger: () => h(RouterLink, linkProps, {
          default: () => h('span', asset.owner.name),
        })
      })
    }
  },
  {
    title: 'Subkategori',
    key: 'subcategory.name',
    align: 'center',
  },
  {
    title: 'Harga sewa',
    key: '_price',
    align: 'center',
    defaultSortOrder: false,
    sorter: 'default',
    render: (asset) => {
      return h(NSpace, {
        justify: 'space-between'
      }, {
        default: () => ['Rp', asset._price],
      })
    }
  },
  {
    title: 'Kuantitas',
    key: 'quantity',
    align: 'center',
    children: [
      {
        title: 'Tersedia',
        key: 'available',
        align: 'center',
        render: (asset) => {
          return h(NText, {
            type: 'success',
          }, {
            default: () => asset.quantity.available,
          })
        }
      },
      {
        title: 'Digunakan',
        key: 'used',
        align: 'center',
        render: (asset) => {
          return h(NText, {
            type: 'warning',
          }, {
            default: () => asset.quantity.used,
          })
        }
      },
      {
        title: 'Rusak',
        key: 'damaged',
        align: 'center',
        render: (asset) => {
          return h(NText, {
            type: 'error',
          }, {
            default: () => asset.quantity.damaged,
          })
        }
      },
      {
        title: 'Keseluruhan',
        key: 'total',
        align: 'center',
        render: (asset) => {
          return h(NText, {
            type: 'info',
          }, {
            default: () => asset.quantity.total,
          })
        }
      },
    ]
  },
  {
    title: 'Satuan',
    key: 'unit.name',
    align: 'center',
  },
  {
    title: 'Bisa Lembur',
    key: 'hasOvertime',
    align: 'center',
    render: (asset) => {
      return h(NCheckbox, {
        defaultChecked: asset.hasOvertime,
        disabled: loadingPatchOvertime.value,
        onUpdateChecked: async (value: boolean) => {
          try {
            loadingBar.start();
            loadingPatchOvertime.value = true;
            await assetStore.patchOvertime(asset.id, { hasOvertime: value });
            loadingBar.finish();
          } catch (error) {
            loadingBar.error();
          } finally {
            loadingPatchOvertime.value = false;
          }
        },
      });
    }
  }
]
const rowProps = (row: AssetDto): HTMLAttributes => {
  return {
    style: {
      cursor: 'pointer',
    },
    onClick: withModifiers(() => {
      console.log(row.id)
    }, ['self'])
  }
}
const rowKey = (employee: AssetDto) => employee.id;
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

const assetTable = ref();
const searchInput = ref<HTMLInputElement>();
const loading = ref(false);
const loadingPatchOvertime = ref(false);
const selectedSubcategories = ref<Array<number>>([])

const assets = computed(() => assetStore.assets)
const subcategoryOptions = computed(() => categoryStore.subcategoryOptions)

onMounted(async () => {
  await getAssets();
})

async function getAssets() {
  try {
    loadingBar.start();
    loading.value = true;
    const query = new AssetQueryDto({
      page: pagination.page || 1,
      pageSize: pagination.pageSize || 10,
      sort: sorter.sort,
      sortBy: sorter.sortBy,
      keyword: keyword.value,
      subcategories: selectedSubcategories.value.join('-'),
    });
    if (categoryStore.categories.length === 0) {
      await categoryStore.getCategories();
    }
    const response = await assetStore.getAssets(query);
    pagination.pageCount = response.pageCount;
  } catch (error) {
    loadingBar.error();
  } finally {
    loadingBar.finish();
    loading.value = false;
  }
}

function handlePageChange(page: number) {
  pagination.page = page;
  getAssets()
}
function handlePageSizeChange(pageSize: number) {
  pagination.page = 1;
  pagination.pageSize = pageSize;
  getAssets();
}
function handleSorterChange(options: DataTableSortState) {
  if (options.order === 'ascend') {
    sorter.sort = 'asc';
  } else if (options.order === 'descend') {
    sorter.sort = 'desc';
  }
  sorter.sortBy = options.columnKey.toString().replace('_', '');
  getAssets()
}

const handleSearch = debounce(async () => {
  if (!keyword.value || keyword.value.length >= 3) {
    await getAssets()

    searchInput.value?.focus();
  }
})

function refresh() {
  keyword.value = '';
  sorter.sort = undefined;
  sorter.sortBy = undefined;
  pagination.page = 1;
  pagination.pageSize = 10;
  selectedSubcategories.value = [];
  getAssets()
}
</script>

<template>
  <AppLayout @refresh="refresh">
    <NLayout has-sider content-style="padding: 1rem;" :native-scrollbar="false" sider-placement="right">
      <NLayoutContent :native-scrollbar="false">
        <NDataTable ref="assetTable" remote :row-key="rowKey" :row-props="rowProps" :columns="columns" :data="assets"
          :max-height="height - 64" :scroll-x="1600" :loading="loading" :pagination="(pagination as PaginationProps)"
          @update:sorter="handleSorterChange" @update:page="handlePageChange" @update:page-size="handlePageSizeChange">
        </NDataTable>
      </NLayoutContent>

      <NLayoutSider style="background: transparent" content-style="padding: 1rem; padding-top: 0">
        <NSpace vertical style="padding-top: 8px">
          <NButton type="primary" block>Tambah aset</NButton>
          <NDivider title-placement="center">Filter</NDivider>
          <NSpace vertical>
            <NText style="opacity: 0.6">Pencarian</NText>
            <NInput ref="searchInput" v-model:value="keyword" placeholder="Nama aset atau nama pemilik..." clearable
              :disabled="loading" @input="handleSearch">
              <template #prefix>
                <NIcon :component="Search24Filled"></NIcon>
              </template>
            </NInput>
          </NSpace>
          <NSpace vertical>
            <NText style="opacity: 0.6">Subkategori</NText>
            <NSelect v-model:value="selectedSubcategories" placeholder="Filter subkategori" multiple clearable
              :options="subcategoryOptions" @update:value="getAssets" />
          </NSpace>
        </NSpace>
      </NLayoutSider>
    </NLayout>
  </AppLayout>
</template>