import { SortDirectionEnum } from '@/enums/sort-by';

export function sort<T>(array: T[], key: keyof T, direction: SortDirectionEnum = SortDirectionEnum.Asc): T[] {
  const _array = [...array];
  return _array.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const result = aValue.localeCompare(bValue);
      return direction === SortDirectionEnum.Asc ? result : -result;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === SortDirectionEnum.Asc ? aValue - bValue : bValue - aValue;
    }

    const result = String(aValue).localeCompare(String(bValue));
    return direction === SortDirectionEnum.Asc ? result : -result;
  });
}