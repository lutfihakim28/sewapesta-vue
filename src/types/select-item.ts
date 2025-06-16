import type { SelectItem } from '@nuxt/ui';

export type AppSelectItem = Exclude<SelectItem, boolean | string | number | null>