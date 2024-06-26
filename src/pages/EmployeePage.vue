<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue';
import { useTableMaxHeight } from '@/composables/useTablemaxHeight';
import { EmployeeDto } from '@/dtos/EmployeeDto';
import { EmployeeQueryDto } from '@/dtos/EmployeeQueryDto';
import { debounce } from '@/lib/debounce';
import { useEmployeeStore } from '@/stores/employeeStore';
import { Search24Filled, SportBasketball24Regular } from '@vicons/fluent';
import {
  DataTableColumn,
  DataTableSortState,
  NCard,
  NDataTable,
  NDivider,
  NH4,
  NH6,
  NIcon,
  NInput,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NSpace,
  NText,
  PaginationProps,
  useLoadingBar,
} from 'naive-ui';
import { HTMLAttributes, computed, onMounted, reactive, ref } from 'vue';

const loadingBar = useLoadingBar();
const employeeStore = useEmployeeStore();
const { height } = useTableMaxHeight();

const columns: Array<DataTableColumn<EmployeeDto>> = [
  {
    title: '#',
    key: 'id',
    defaultSortOrder: false,
    sorter: 'default',
    width: 64,
  },
  {
    title: 'Nama',
    key: 'name',
    defaultSortOrder: false,
    sorter: 'default',
    resizable: true,
  },
  {
    title: 'Nomor HP',
    key: 'phone',
  },
]
const rowProps = (row: EmployeeDto): HTMLAttributes => {
  return {
    style: {
      cursor: 'pointer',
    },
    onClick: () => {
      console.log(row.id)
    }
  }
}
const rowKey = (employee: EmployeeDto) => employee.id;
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

const employeeTable = ref();
const searchInput = ref<HTMLInputElement>();
const loading = ref(false);

const employees = computed(() => employeeStore.employees)

onMounted(async () => {
  await getEmployees();
})

async function getEmployees() {
  try {
    loadingBar.start();
    loading.value = true;
    const query = new EmployeeQueryDto({
      page: pagination.page || 1,
      pageSize: pagination.pageSize || 10,
      sort: sorter.sort,
      sortBy: sorter.sortBy,
      keyword: keyword.value,
    });
    const response = await employeeStore.getEmployees(query);
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
  getEmployees()
}
function handlePageSizeChange(pageSize: number) {
  pagination.page = 1;
  pagination.pageSize = pageSize;
  getEmployees();
}
function handleSorterChange(options: DataTableSortState) {
  if (options.order === 'ascend') {
    sorter.sort = 'asc';
  } else if (options.order === 'descend') {
    sorter.sort = 'desc';
  }
  sorter.sortBy = options.columnKey.toString();
  getEmployees()
}

const handleSearch = debounce(async () => {
  if (!keyword.value || keyword.value.length >= 3) {
    await getEmployees()

    searchInput.value?.focus();
  }
})

function refresh() {
  keyword.value = undefined;
  sorter.sort = undefined;
  sorter.sortBy = undefined;
  pagination.page = 1;
  pagination.pageSize = 10;
  getEmployees()
}
</script>

<template>
  <AppLayout @refresh="refresh">
    <NLayout has-sider content-style="padding: 1rem;" :native-scrollbar="false" sider-placement="right">
      <NLayoutContent :native-scrollbar="false">
        <NDataTable ref="employeeTable" remote :row-key="rowKey" :row-props="rowProps" :columns="columns"
          :data="employees" :max-height="height" :loading="loading" :pagination="(pagination as PaginationProps)"
          @update:sorter="handleSorterChange" @update:page="handlePageChange" @update:page-size="handlePageSizeChange">
        </NDataTable>
      </NLayoutContent>

      <NLayoutSider style="background: transparent" content-style="padding: 1rem; padding-top: 0">
        <NSpace vertical>
          <NInput ref="searchInput" v-model:value="keyword" placeholder="Nama atau nomor HP..." clearable
            :disabled="loading" @input="handleSearch">
            <template #prefix>
              <NIcon :component="Search24Filled"></NIcon>
            </template>
          </NInput>

          <!-- TODO: Berisi data yang berkaitan dengan karyawan terkait -->
          <!-- <section>
            <NDivider title-placement="center">Pratinjau</NDivider>
            <NCard>
              <NSpace vertical align="center">
                <section>
                  <NH6 style="margin: 0; opacity: 0.3; font-size: 14px; text-align: center">Nama</NH6>
                  <NText as="p" style="text-align: center">Hendra Saefullah Muhammad Muhammad Adriansyah </NText>
                </section>
                <section>
                  <NH6 style="margin: 0; opacity: 0.3; font-size: 14px; text-align: center">Nomor HP</NH6>
                  <NText as="p" style="text-align: center">Hendra Saefullah Muhammad Muhammad Adriansyah</NText>
                </section>
              </NSpace>
            </NCard>
          </section> -->
        </NSpace>
      </NLayoutSider>
    </NLayout>
  </AppLayout>
</template>