import { useAuthStore } from '@/stores/useAuthStore'

export const PRIVATE_QUERY_KEYS = {
  categories: {
    root: ['categories'] as const,
    list: (url: string) => {
      const authStore = useAuthStore()
      return [...PRIVATE_QUERY_KEYS.categories.root, url, authStore.token] as const
    },
    options: () => {
      const authStore = useAuthStore()
      return [...PRIVATE_QUERY_KEYS.categories.root, 'options', authStore.token] as const
    }
  },
  items: {
    root: ['items'] as const,
    list: (url: string) => {
      const authStore = useAuthStore()
      return [...PRIVATE_QUERY_KEYS.items.root, url, authStore.token] as const
    }
  },
  packages: {
    root: ['packages'] as const,
    list: (url: string) => {
      const authStore = useAuthStore()
      return [...PRIVATE_QUERY_KEYS.packages.root, url, authStore.token] as const
    }
  },
  products: {
    root: ['products'] as const,
    list: (url: string) => {
      const authStore = useAuthStore()
      return [...PRIVATE_QUERY_KEYS.products.root, url, authStore.token] as const
    }
  },
  units: {
    root: ['units'] as const,
    list: (url: string) => {
      const authStore = useAuthStore()
      return [...PRIVATE_QUERY_KEYS.units.root, url, authStore.token] as const
    }
  },
  users: {
    root: ['users'] as const,
    list: (url: string) => {
      const authStore = useAuthStore()
      return [...PRIVATE_QUERY_KEYS.users.root, url, authStore.token] as const
    }
  },
}


export type AvailablePrivateKey = keyof typeof PRIVATE_QUERY_KEYS