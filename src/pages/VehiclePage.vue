<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue';
import { useTableMaxSize } from '@/composables/useTablemaxSize';
import { VehicleDto } from '@/dtos/VehicleDto';
import { useVehicleStore } from '@/stores/vehicleStore';
import {
  DataTableColumn,
  NButton,
  NDataTable,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NSpace,
  useLoadingBar,
} from 'naive-ui';
import { HTMLAttributes, computed, onMounted, ref } from 'vue';

const loadingBar = useLoadingBar();
const vehicleStore = useVehicleStore();
const { height } = useTableMaxSize();

const columns: Array<DataTableColumn<VehicleDto>> = [
  {
    title: 'ID',
    key: 'id',
    defaultSortOrder: 'ascend',
    sorter: 'default',
    width: 64,
  },
  {
    title: 'Nama',
    key: 'name',
    defaultSortOrder: false,
    sorter: 'default',
  },
  {
    title: 'Pelat Nomor',
    key: 'licenseNumber',
  },
]
const rowProps = (row: VehicleDto): HTMLAttributes => {
  return {
    style: {
      cursor: 'pointer',
    },
    onClick: () => {
      console.log(row.id)
    }
  }
}
const rowKey = (employee: VehicleDto) => employee.id;

const vehicleTable = ref();
const loading = ref(false);

const vehicles = computed(() => vehicleStore.vehicles)

onMounted(async () => {
  await getEmployees();
})

async function getEmployees() {
  try {
    loadingBar.start();
    loading.value = true;
    await vehicleStore.getVehicles();
    loadingBar.finish();
  } catch (error) {
    loadingBar.error();
  } finally {
    loading.value = false;
  }
}

function refresh() {
  getEmployees()
}
</script>

<template>
  <AppLayout @refresh="refresh">
    <NLayout has-sider content-style="padding: 1rem;" :native-scrollbar="false" sider-placement="right">
      <NLayoutContent :native-scrollbar="false">
        <NDataTable ref="vehicleTable" :row-key="rowKey" :row-props="rowProps" :columns="columns" :data="vehicles"
          :max-height="height" :loading="loading">
        </NDataTable>
      </NLayoutContent>

      <NLayoutSider style="background: transparent" content-style="padding: 1rem; padding-top: 0">
        <NSpace vertical style="padding-top: 8px">
          <NButton type="primary" block>Tambah kendaraan</NButton>
        </NSpace>
      </NLayoutSider>
    </NLayout>
  </AppLayout>
</template>