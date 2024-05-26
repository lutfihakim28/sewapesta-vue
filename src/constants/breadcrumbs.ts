export type RouteName =
  'DashboardPage'
  | 'RentalPage'
  | 'SchedulePage'
  | 'EmployeePage'
  | 'AssetPage'
  | 'VehiclePage'
  | 'AssetOwnerPage'
  | 'PartnerPage'
  | 'AccountPage'
  | 'IncomePage'
  | 'ExpensePage'
  | 'SettingIncomeRatioPage'
  | 'SettingUserAdminPage';
export type Breadcrumb = {
  label: string;
  path?: string;
}

const breadcrumb: Record<RouteName, Breadcrumb[]> = {
  DashboardPage: [
    {
      label: 'Beranda',
    },
  ],
  AccountPage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Keuangan'
    },
    {
      label: 'Akun',
    },
  ],
  AssetOwnerPage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Data Master',
    },
    {
      label: 'Pemilik Aset',
    },
  ],
  AssetPage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Data Master',
    },
    {
      label: 'Aset',
    },
  ],
  EmployeePage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Data Master',
    },
    {
      label: 'Karyawan',
    },
  ],
  ExpensePage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Keuangan',
    },
    {
      label: 'Pengeluaran',
    },
  ],
  IncomePage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Keuangan',
    },
    {
      label: 'Pemasukan',
    },
  ],
  PartnerPage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Data Master',
    },
    {
      label: 'Partner',
    },
  ],
  RentalPage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Sewa',
    },
    {
      label: 'Daftar Sewa',
    },
  ],
  SchedulePage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Sewa',
    },
    {
      label: 'Jadwal',
    },
  ],
  SettingUserAdminPage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Pengaturan',
    },
    {
      label: 'Admin Pengguna',
    },
  ],
  SettingIncomeRatioPage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Pengaturan',
    },
    {
      label: 'Pembagian Hasil',
    },
  ],
  VehiclePage: [
    {
      label: 'Beranda',
      path: '/'
    },
    {
      label: 'Data Master',
    },
    {
      label: 'Kendaraan',
    },
  ],
}

export default breadcrumb;