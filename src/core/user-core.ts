import TableSorter from '@/components/table-controlls/TableSorter.vue';
import { useAuthStore } from '@/stores/auth';
import { useApiFetch } from '@/utils/composables/useApiFetch';
import { useQueryParam } from '@/utils/composables/useQueryParam';
import { ApiResponseList } from '@/utils/dtos/ApiResponse';
import { UserProfile } from '@/utils/dtos/UserProfile';
import type { Meta } from '@/utils/dtos/Meta';
import type { RoleEnum } from '@/utils/enums/role';
import type { TableColumn } from '@nuxt/ui';
import { useQuery } from '@pinia/colada';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';

export function useUserCore(role: RoleEnum) {
  const basePath = 'private/users'
  const authStore = useAuthStore()
  const toast = useToast()
  const { t } = useI18n()

  const { path } = useQueryParam(basePath)

  const columns = computed<TableColumn<UserProfile>[]>(() => [
    {
      accessorKey: 'id',
      header: () => h(TableSorter, {
        label: 'ID',
        columnKey: 'id'
      }),
    },
    {
      accessorKey: 'username',
      header: () => h(TableSorter, {
        label: t('field.Username'),
        columnKey: 'username'
      }),
    },
    {
      accessorKey: 'name',
      header: () => h(TableSorter, {
        label: t('Name'),
        columnKey: 'name'
      }),
    },
    {
      accessorKey: 'phone',
      header: () => h(TableSorter, {
        label: t('field.Phone'),
        columnKey: 'phone'
      }),
    },
    {
      accessorKey: 'roles',
      header: () => h('span', `${t('field.Role')}(s)`),
      cell: ({ row }) => {
        const roles = row.getValue('roles') as RoleEnum[];
        return roles.join(', ')
      }
    },
    {
      accessorKey: 'address',
      header: () => h('span', t('field.Address')),
    },
    {
      accessorKey: 'location.subdistrict',
      header: () => h('span', t('field.Subdistrict')),
    },
    {
      accessorKey: 'location.district',
      header: () => h('span', t('field.District')),
    },
    {
      accessorKey: 'location.city',
      header: () => h('span', t('field.City')),
    },
    {
      accessorKey: 'location.province',
      header: () => h('span', t('field.Province')),
    }
  ]);

  const { data, isPending, refresh } = useQuery({
    key: () => [basePath, path.value, authStore.token],
    query: () => fetcher(path.value),
  })

  const items = computed<UserProfile[]>((previous) => {
    if (data.value) {
      const response = new ApiResponseList(data.value, UserProfile)

      return response.data
    }

    if (previous) return previous;
    return []
  })

  const meta = computed<Meta | undefined>(() => {
    if (!data.value) return;
    const response = new ApiResponseList(data.value, UserProfile)

    return response.meta
  })

  async function fetcher(path: string) {
    if (!path.includes('page=')) return
    const { data, get } = useApiFetch<ApiResponseList<UserProfile>>(path + `&role=${role}`);
    await get();
    return data.value;
  }

  async function refreshData() {
    await refresh()
    toast.add({
      color: 'success',
      title: t('refreshed'),
      duration: 1500,
    })
  }

  return {
    columns,
    items,
    meta,
    refreshData,
    isPending,
    t,
  }
}
