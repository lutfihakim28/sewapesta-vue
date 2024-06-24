<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue';
import TablePagination from '@/components/TablePagination.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import {
  Table,
  TableBody,
  TableEmpty,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Meta } from '@/schemas/MetaSchema';
import { useEmployeeStore } from '@/stores/employeeStore';
import { computed, onMounted, reactive, ref } from 'vue';
import { Icon } from '@iconify/vue'
import { Skeleton } from '@/components/ui/skeleton';
import DeleteDialog from '@/components/DeleteDialog.vue';

const employeeStore = useEmployeeStore()

const loading = ref(false);
const pagination = reactive<Meta>({
  page: 1,
  limit: '10',
  totalPage: 0,
})

const employees = computed(() => employeeStore.employees);

onMounted(() => {
  getEmployees();
})

async function getEmployees() {
  try {
    loading.value = true;
    const meta = await employeeStore.getEmployees({
      page: pagination.page.toString(),
      limit: pagination.limit,
    })

    pagination.totalPage = meta.totalPage;
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false;
  }
}

function changePagination(_pagination: Omit<Meta, 'totalPage'>) {
  pagination.page = _pagination.page;
  pagination.limit = _pagination.limit;

  getEmployees();
}
</script>

<template>
  <AppLayout>
    <Card>
      <CardHeader class="pb-0 w-full">
        <section class="flex items-center justify-between">
          <p>Daftar Karyawan</p>
          <Button class="flex gap-x-2 items-center">
            <Icon icon="radix-icons:plus" class="h-4 w-4" />
            Tambah Karyawan
          </Button>
        </section>
      </CardHeader>
      <CardContent class="pt-6">
        <Table>
          <TableEmpty v-if="employees.length === 0 && !loading" :colspan="4">
            <p class="text-center italic opacity-70">Belum ada data karyawan.</p>
          </TableEmpty>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[100px]">
                #
              </TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Nomor HP</TableHead>
              <TableHead class="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="loading" v-for="i in 5" :key="i">
              <TableCell v-for="j in 4" :key="`${i}${j}`">
                <Skeleton class="h-4 w-full" />
              </TableCell>
            </TableRow>
            <TableRow v-else v-for="employee in employees" :key="employee.id">
              <TableCell class="font-medium">
                {{ employee.id }}
              </TableCell>
              <TableCell>{{ employee.name }}</TableCell>
              <TableCell>{{ employee.phone }}</TableCell>
              <TableCell>
                <section class="flex items-center justify-center gap-x-2">
                  <DeleteDialog>
                    <template #description>
                      Karyawan <span class="font-bold text-white">{{ employee.name }}</span> akan dihapus dan tidak akan
                      bisa diakses di dalam
                      aplikasi.
                    </template>
                  </DeleteDialog>
                </section>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter v-if="employees.length > 0 && !loading" class="w-full">
        <TablePagination :total-page="pagination.totalPage" @change="changePagination" />
      </CardFooter>
    </Card>
  </AppLayout>
</template>