import type { AppSelectItem } from '@/types/select-item';

interface GetLabelParam {
  options: AppSelectItem[],
  value: number
}

export function getLabel({ options, value }: GetLabelParam) {
  const option = options.find((option) => option.value === value)
  if (option && option.label) {
    return option.label;
  }

  return ''
}