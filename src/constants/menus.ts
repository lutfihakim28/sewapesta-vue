import { NIcon, MenuGroupOption, MenuOption } from 'naive-ui';
import { Component, h } from 'vue';
import { RouterLink } from 'vue-router';
import { BoxMultiple24Filled, CalendarLtr48Filled, Cart24Filled, CreditCardPerson24Filled, DocumentPercent24Filled, Group24Filled, Home48Filled, MailInboxArrowDown20Filled, MailInboxArrowUp20Filled, PeopleCommunity28Filled, Person48Filled, VehicleTruckProfile24Filled } from '@vicons/fluent';

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function renderLabel(path: string, label: string) {
  return () => h(
    RouterLink,
    {
      to: {
        name: path,
      }
    },
    { default: () => label }
  )
}

export const menus: Array<MenuOption | MenuGroupOption> = [
  {
    key: 'Home',
    label: renderLabel('HomePage', 'Beranda'),
    icon: renderIcon(Home48Filled)
  },
  {
    key: 'OrderGroup',
    label: 'Pesanan',
    type: 'group',
    children: [
      {
        key: 'Order',
        label: renderLabel('OrderPage', 'Daftar Pesanan'),
        icon: renderIcon(Cart24Filled)
      },
      {
        key: 'Schedule',
        label: renderLabel('SchedulePage', 'Jadwal'),
        icon: renderIcon(CalendarLtr48Filled)
      },
    ],
  },
  {
    key: 'MasterData',
    label: 'Data Master',
    type: 'group',
    children: [
      {
        key: 'Employee',
        label: renderLabel('EmployeePage', 'Karyawan'),
        icon: renderIcon(PeopleCommunity28Filled)
      },
      {
        key: 'Asset',
        label: renderLabel('AssetPage', 'Aset'),
        icon: renderIcon(BoxMultiple24Filled)
      },
      {
        key: 'AssetOwner',
        label: renderLabel('AssetOwnerPage', 'Pemilik Aset'),
        icon: renderIcon(PeopleCommunity28Filled)
      },
      {
        key: 'Category',
        label: renderLabel('CategoryPage', 'Kategori'),
        icon: renderIcon(Group24Filled)
      },
      {
        key: 'Vehicle',
        label: renderLabel('VehiclePage', 'Kendaraan'),
        icon: renderIcon(VehicleTruckProfile24Filled)
      },
    ],
  },
  {
    key: 'Finance',
    label: 'Keuangan',
    type: 'group',
    children: [
      {
        key: 'Account',
        label: renderLabel('AccountPage', 'Akun'),
        icon: renderIcon(CreditCardPerson24Filled)
      },
      {
        key: 'Income',
        label: renderLabel('IncomePage', 'Pemasukan'),
        icon: renderIcon(MailInboxArrowDown20Filled)
      },
      {
        key: 'Expense',
        label: renderLabel('ExpensePage', 'Pengeluaran'),
        icon: renderIcon(MailInboxArrowUp20Filled)
      },
    ],
  },
  {
    key: 'Setting',
    label: 'Pengaturan',
    type: 'group',
    children: [
      {
        key: 'SettingUserAdmin',
        label: renderLabel('SettingUserAdminPage', 'Pengguna'),
        icon: renderIcon(Person48Filled)
      },
      {
        key: 'SettingIncomeRatio',
        label: renderLabel('SettingIncomeRatioPage', 'Pembagian Hasil'),
        icon: renderIcon(DocumentPercent24Filled)
      },
    ],
  }
]

// const menus: Menu[] = [
//   {
//     key: 'Dashboard',
//     label: 'Beranda',
//     path: '/',
//     icon: 'radix-icons:dashboard',
//   },
//   {
//     key: 'Rental',
//     label: 'Sewa',
//     children: [
//       {
//         key: 'Rentals',
//         label: 'Daftar Sewa',
//         path: '/rentals',
//         icon: 'radix-icons:list-bullet',
//       },
//       {
//         key: 'Schedule',
//         label: 'Jadwal',
//         path: '/schedules',
//         icon: 'radix-icons:calendar',
//       },
//     ],
//   },
//   {
//     key: 'MasterData',
//     label: 'Data Master',
//     children: [
//       {
//         key: 'Employee',
//         label: 'Karyawan',
//         path: '/employees',
//         icon: 'radix-icons:person',
//       },
//       {
//         key: 'Asset',
//         label: 'Aset',
//         path: '/assets',
//         icon: 'radix-icons:cube',
//       },
//       {
//         key: 'Vehicle',
//         label: 'Kendaraan',
//         path: '/vehicles',
//         icon: 'radix-icons:rocket',
//       },
//       {
//         key: 'AssetOwner',
//         label: 'Pemilik Aset',
//         path: '/asset-owners',
//         icon: 'radix-icons:person',
//       },
//       {
//         key: 'Partner',
//         label: 'Partner',
//         path: '/partners',
//         icon: 'radix-icons:person',
//       },
//     ]
//   },
//   {
//     key: 'Finance',
//     label: 'Keuangan',
//     children: [
//       {
//         key: 'Account',
//         label: 'Akun',
//         path: '/accounts',
//         icon: 'radix-icons:id-card',
//       },
//       {
//         key: 'Income',
//         label: 'Pemasukan',
//         path: '/incomes',
//         icon: 'radix-icons:download',
//       },
//       {
//         key: 'Expense',
//         label: 'Pengeluaran',
//         path: '/expenses',
//         icon: 'radix-icons:upload',
//       },
//     ]
//   },
//   {
//     key: 'Setting',
//     label: 'Pengaturan',
//     children: [
//       {
//         key: 'SettingUserAdmin',
//         label: 'Admin Pengguna',
//         path: '/settings/user-admins',
//         icon: 'radix-icons:gear',
//       },
//       {
//         key: 'SettingIncomeRatio',
//         label: 'Pembagian Hasil',
//         path: '/settings/income-ratios',
//         icon: 'radix-icons:mixer-horizontal',
//       },
//     ]
//   },
// ]