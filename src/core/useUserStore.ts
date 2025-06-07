import TableSorter from '@/components/table-controlls/TableSorter.vue';
import { UserProfile } from '@/dtos/UserProfile';
import type { RoleEnum } from '@/enums/role';
import type { TableColumn } from '@nuxt/ui';
import { computed, h } from 'vue';
import { useListCore } from './parts/useListCore';

export function useUserCore(role: RoleEnum) {
  const basePath = 'private/users'

  const { isPending, list, meta, refreshData, t } = useListCore<UserProfile>({
    basePath,
    dto: UserProfile,
    additionalQueryParam: `role=${role}`,
  })

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
      header: () => h('span', `${t('field.Role(s)')}`),
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

  return {
    columns,
    users: list,
    meta,
    refreshData,
    isPending,
    t,
  }
}
