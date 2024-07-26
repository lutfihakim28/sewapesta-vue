import { renderIcon } from '@/utils/renderIcon';
import { Delete24Filled, Edit24Filled } from '@vicons/fluent';
import { DropdownOption, NText, useThemeVars } from 'naive-ui';
import { ref } from 'vue';
import { h } from 'vue';

export function useContextMenu() {
  const themeVars = useThemeVars();

  const options: DropdownOption[] = [
    {
      label: () => h(NText, { type: 'warning' }, { default: () => 'Ubah' }),
      key: 'edit',
      icon: renderIcon(Edit24Filled, { color: themeVars.value.warningColor })
    },
    {
      label: () => h(NText, { type: 'error' }, { default: () => 'Hapus' }),
      key: 'delete',
      icon: renderIcon(Delete24Filled, { color: themeVars.value.errorColor })
    }
  ]

  const x = ref(0)
  const y = ref(0)
  const showDropdown = ref(false);

  return {
    options,
    x,
    y,
    showDropdown,
  }
}