import TableSorter from '@/components/table-controlls/TableSorter.vue';
import { UserProfile } from '@/dto/UserProfile';
import type { RoleEnum } from '@/enums/role';
import type { TableColumn } from '@nuxt/ui';
import { computed, h } from 'vue';
import { useListCore } from './parts/useListCore';
import UButton from '@nuxt/ui/runtime/components/Button.vue'

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
    },
    {
      accessorKey: 'action',
      header: () => h('div', { class: 'text-center' }, t('Action')),
      cell: ({ row }) => {
        const id = row.getValue('id') as number;
        return h('section', { class: 'flex gap-x-1 justify-center' }, [
          h(UButton, {
            icon: 'i-lucide-pencil',
            variant: 'ghost',
            color: 'info',
            onClick() {
              console.log('edit', id);
            }
          }),
          h(UButton, {
            icon: 'i-lucide-trash',
            variant: 'ghost',
            color: 'error',
            onClick() {
              console.log('delete', id);
            }
          })
        ])
      }
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
