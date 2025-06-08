import type { RouteRecordRaw } from 'vue-router';

export async function importRoutes(layout: LayoutType): Promise<RouteRecordRaw[]> {
  const route = import.meta.glob('/src/router/routes/*.ts')

  const path = `/src/router/routes/${layout}.ts`;
  const loader = route[path];
  if (!loader) {
    throw new Error(`Routes for ${layout} not found.`);
  }

  const module = await loader() as { default: RouteRecordRaw[] };

  const routes = module.default;

  return routes as RouteRecordRaw[];
}

type LayoutType = 'desktop' | 'tablet' | 'mobile';
