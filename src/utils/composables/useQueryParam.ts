import { computed } from 'vue'
import { useRoute } from 'vue-router';

export function useQueryParam<T extends Record<string, string | string[] | undefined>>(basePath: string) {
  const route = useRoute()
  const path = computed(() => {
    const query = new URLSearchParams()

    const routeQuery = route.query as T
    Object.entries(routeQuery).forEach(([_key, value]) => {
      const key = (_key as keyof T).toString();
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v))
      }
      if (value) {
        query.append(key, value.toString())
      }
    })
    return `${basePath}?${query.toString()}`
  });

  return { path }
}