import type { AppSelectItem } from '@/types/select-item';

export function getLabel(options: AppSelectItem[], value: number) {
  const option = options.find((option) => option.value === value)
  if (option && option.label) {
    return option.label;
  }

  return ''
}