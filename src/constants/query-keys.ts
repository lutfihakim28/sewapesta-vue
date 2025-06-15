import { useAuthStore } from '@/stores/useAuthStore'

export const PRIVATE_QUERY_KEYS = {
  root: () => {
    const authStore = useAuthStore();
    return [authStore.token] as const
  },
  categories: {
    root: () => {
      return [...PRIVATE_QUERY_KEYS.root(), 'categories']
    },
    list: (url: string) => {
      return [...PRIVATE_QUERY_KEYS.categories.root(), url] as const
    },
    options: () => {
      return [...PRIVATE_QUERY_KEYS.categories.root(), 'options'] as const
    }
  },
  items: {
    root: () => {
      return [...PRIVATE_QUERY_KEYS.root(), 'items']
    },
    list: (url: string) => {
      return [...PRIVATE_QUERY_KEYS.items.root(), url] as const
    }
  },
  packages: {
    root: () => {
      return [...PRIVATE_QUERY_KEYS.root(), 'packages']
    },
    list: (url: string) => {
      return [...PRIVATE_QUERY_KEYS.packages.root(), url] as const
    }
  },
  products: {
    root: () => {
      return [...PRIVATE_QUERY_KEYS.root(), 'products']
    },
    list: (url: string) => {
      return [...PRIVATE_QUERY_KEYS.products.root(), url] as const
    }
  },
  units: {
    root: () => {
      return [...PRIVATE_QUERY_KEYS.root(), 'units']
    },
    list: (url: string) => {
      return [...PRIVATE_QUERY_KEYS.units.root(), url] as const
    },
    options: () => {
      return [...PRIVATE_QUERY_KEYS.units.root(), 'options'] as const
    }
  },
  users: {
    root: () => {
      return [...PRIVATE_QUERY_KEYS.root(), 'users']
    },
    list: (url: string) => {
      return [...PRIVATE_QUERY_KEYS.users.root(), url] as const
    }
  },
}


export type AvailablePrivateKey = keyof Omit<typeof PRIVATE_QUERY_KEYS, 'root'>
