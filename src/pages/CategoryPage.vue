<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue';
import { useTableMaxSize } from '@/composables/useTablemaxSize';
import { CategoryDto } from '@/dtos/CategoryDto';
import { SubcategoryDto } from '@/dtos/SubcategoryDto';
import { useCategoryStore } from '@/stores/categoryStore';
import { renderIcon } from '@/utils/renderIcon';
import { Delete24Filled, Edit24Filled } from '@vicons/fluent';
import { DataTableColumn, DropdownOption, NButton, NDataTable, NDropdown, NGrid, NGridItem, NLayout, NLayoutContent, NSpace, NText, useLoadingBar, useThemeVars } from 'naive-ui';
import { reactive } from 'vue';
import { h, nextTick } from 'vue';
import { computed, HTMLAttributes, onMounted, ref } from 'vue';

const loadingBar = useLoadingBar();
const categoryStore = useCategoryStore();
const { height } = useTableMaxSize();
const themeVars = useThemeVars();

const categoryColumns = computed<Array<DataTableColumn<CategoryDto>>>(() => [
  {
    title: 'ID',
    key: 'id',
    width: 64,
  },
  {
    title: 'Kategori',
    key: 'name',
    colSpan: () => 2,
  },
  {
    key: 'action',
    title: () => {
      return h(NSpace, {
        justify: 'end'
      }, {
        default: () => h(NButton, {
          type: 'primary',
          disabled: loading.value,
        }, {
          default: () => 'Tambah kategori',
        })
      })
    }
  },
])
const subcategoryColumns = computed<Array<DataTableColumn<SubcategoryDto>>>(() => [
  {
    title: 'ID',
    key: 'id',
    width: 64,
  },
  {
    title: 'Kategori',
    key: 'name',
    colSpan: () => 2,
  },
  {
    key: 'action',
    title: () => {
      return h(NSpace, {
        justify: 'end'
      }, {
        default: () => h(NButton, {
          type: 'primary',
          disabled: loading.value || !selectedCategoryId.value,
        }, {
          default: () => 'Tambah subkategori',
        })
      })
    }
  },
])

const categoryRowProps = (row: CategoryDto): HTMLAttributes => {
  return {
    style: {
      cursor: 'pointer',
    },
    class: [
      'n-data-table-tr',
      selectedCategoryId.value === row.id ? 'selected' : '',
    ],
    onClick: () => {
      selectedCategoryId.value = row.id;
    },
    onContextmenu: async (event: MouseEvent) => {
      event.preventDefault();
      showDropdown.value = false;
      await nextTick();
      contexted.type = 'category';
      contexted.id = row.id;
      contexted.name = row.name;
      x.value = event.clientX;
      y.value = event.clientY;
      showDropdown.value = true;
    },
  }
}
const subcategoryRowProps = (row: SubcategoryDto): HTMLAttributes => {
  return {
    style: {
      cursor: 'pointer',
    },
    onClick: () => {
      console.log(row.id)
    },
    onContextmenu: async (event: MouseEvent) => {
      event.preventDefault();
      showDropdown.value = false;
      await nextTick();
      contexted.type = 'subcategory';
      contexted.id = row.id;
      contexted.name = row.name;
      x.value = event.clientX;
      y.value = event.clientY;
      showDropdown.value = true;
    },
  }
}

const categoryRowKey = (category: CategoryDto) => category.id;
const subcategoryRowKey = (subcategory: SubcategoryDto) => subcategory.id;

const options: DropdownOption[] = [
  {
    label: () => h(NText, { type: 'warning' }, { default: () => 'Edit' }),
    key: 'edit',
    icon: renderIcon(Edit24Filled, { color: themeVars.value.warningColor })
  },
  {
    label: () => h(NText, { type: 'error' }, { default: () => 'Delete' }),
    key: 'delete',
    icon: renderIcon(Delete24Filled, { color: themeVars.value.errorColor })
  }
]

const selectedCategoryId = ref<number>();
const loading = ref(false);
const x = ref(0)
const y = ref(0)
const showDropdown = ref(false);
const contexted = reactive<{
  type?: 'category' | 'subcategory';
  id?: number;
  name?: string;
}>({
  type: undefined,
  id: undefined,
  name: undefined,
});

const categories = computed(() => categoryStore.categories);
const subcategories = computed(() => {
  if (!selectedCategoryId.value) return [];
  const selectedCategory = categories.value.find((category) => category.id === selectedCategoryId.value);
  if (!selectedCategory) return [];
  return selectedCategory.subcategories;
})

onMounted(() => {
  getCategories();
})

async function getCategories() {
  try {
    loadingBar.start();
    loading.value = true;
    await categoryStore.getCategories()
    loadingBar.finish();
  } catch (error) {
    loadingBar.error();
  } finally {
    loading.value = false;
  }
}

function handleSelect() {
  showDropdown.value = false
};

function onClickoutside() {
  showDropdown.value = false
};

function refresh() {
  selectedCategoryId.value = undefined;
  getCategories();
}
</script>

<template>
  <AppLayout @refresh="refresh">
    <NLayout content-style="padding: 1rem;" :native-scrollbar="false">
      <NLayoutContent :native-scrollbar="false">
        <NGrid x-gap="16">
          <NGridItem :span="12">
            <NDataTable :row-key="categoryRowKey" :row-props="categoryRowProps" :columns="categoryColumns"
              :data="categories" :max-height="height" :loading="loading" />
          </NGridItem>
          <NGridItem :span="12">
            <NDataTable :row-key="subcategoryRowKey" :row-props="subcategoryRowProps" :columns="subcategoryColumns"
              :data="subcategories" :max-height="height" :loading="loading" />
          </NGridItem>
        </NGrid>
      </NLayoutContent>
    </NLayout>
  </AppLayout>

  <NDropdown placement="bottom-start" trigger="manual" :x="x" :y="y" :options="options" :show="showDropdown"
    :on-clickoutside="onClickoutside" @select="handleSelect" />
</template>

<style scoped>
:deep(tr.selected td) {
  background-color: v-bind('themeVars.tableColorHover') !important;
}
</style>