export type Menu = {
  label: string,
  key: string,
  path?: string,
  children?: Menu[],
  icon?: string,
}

const menus: Menu[] = [
  {
    key: 'Dashboard',
    label: 'Beranda',
    path: '/',
    icon: 'radix-icons:dashboard',
  },
  {
    key: 'Rental',
    label: 'Sewa',
    children: [
      {
        key: 'Rentals',
        label: 'Daftar Sewa',
        path: '/rentals',
        icon: 'radix-icons:list-bullet',
      },
      {
        key: 'Schedule',
        label: 'Jadwal',
        path: '/schedules',
        icon: 'radix-icons:calendar',
      },
    ],
  },
  {
    key: 'MasterData',
    label: 'Data Master',
    children: [
      {
        key: 'Employee',
        label: 'Karyawan',
        path: '/employees',
        icon: 'radix-icons:person',
      },
      {
        key: 'Asset',
        label: 'Aset',
        path: '/assets',
        icon: 'radix-icons:cube',
      },
      {
        key: 'Vehicle',
        label: 'Kendaraan',
        path: '/vehicles',
        icon: 'radix-icons:rocket',
      },
      {
        key: 'AssetOwner',
        label: 'Pemilik Aset',
        path: '/asset-owners',
        icon: 'radix-icons:person',
      },
      {
        key: 'Partner',
        label: 'Partner',
        path: '/partners',
        icon: 'radix-icons:person',
      },
    ]
  },
  {
    key: 'Finance',
    label: 'Keuangan',
    children: [
      {
        key: 'Account',
        label: 'Akun',
        path: '/accounts',
        icon: 'radix-icons:id-card',
      },
      {
        key: 'Income',
        label: 'Pemasukan',
        path: '/incomes',
        icon: 'radix-icons:download',
      },
      {
        key: 'Expense',
        label: 'Pengeluaran',
        path: '/expenses',
        icon: 'radix-icons:upload',
      },
    ]
  },
  {
    key: 'Setting',
    label: 'Pengaturan',
    children: [
      {
        key: 'SettingUserAdmin',
        label: 'Admin Pengguna',
        path: '/settings/user-admins',
        icon: 'radix-icons:gear',
      },
      {
        key: 'SettingIncomeRatio',
        label: 'Pembagian Hasil',
        path: '/settings/income-ratios',
        icon: 'radix-icons:mixer-horizontal',
      },
    ]
  },
]

export default menus;