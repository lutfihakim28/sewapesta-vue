<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue';
import { useContextMenu } from '@/composables/useContextMenu';
import { useTableMaxSize } from '@/composables/useTablemaxSize';
import { CategoryDto } from '@/dtos/CategoryDto';
import { CategoryRequestDto } from '@/dtos/CategoryRequestDto';
import { SubcategoryDto } from '@/dtos/SubcategoryDto';
import { SubcategoryRequestDto } from '@/dtos/SubcategoryRequestDto';
import { categoryRequestRule } from '@/rules/categoryRequestRule';
import { useCategoryStore } from '@/stores/categoryStore';
import { DataTableColumn, FormInst, InputInst, NButton, NDataTable, NDropdown, NForm, NFormItem, NGrid, NGridItem, NInput, NLayout, NLayoutContent, NModal, NSpace, useDialog, useLoadingBar, useMessage, useThemeVars } from 'naive-ui';
import { reactive, watch } from 'vue';
import { h, nextTick } from 'vue';
import { computed, HTMLAttributes, onMounted, ref } from 'vue';

type ModalAction = 'create' | 'update';
type DataType = 'category' | 'subcategory';

const DataTypeLookup: Record<DataType, string> = {
  category: 'kategori',
  subcategory: 'subkategori',
}

const loadingBar = useLoadingBar();
const categoryStore = useCategoryStore();
const { height } = useTableMaxSize();
const themeVars = useThemeVars();
const message = useMessage();

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

function refresh() {
  selectedCategoryId.value = undefined;
  getCategories();
}

// ----- TABLE ---- //
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
          onClick: () => {
            const data = new CategoryRequestDto();
            openModal('create', 'category', data)
          }
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
          onClick: () => {
            const data = new SubcategoryRequestDto({ categoryId: selectedCategoryId.value });
            openModal('create', 'subcategory', data)
          }
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
    onContextmenu: (event: MouseEvent) => {
      openContextMenu(event, 'category', row)
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
    onContextmenu: (event: MouseEvent) => {
      openContextMenu(event, 'subcategory', row)
    },
  }
}

const categoryRowKey = (category: CategoryDto) => category.id;
const subcategoryRowKey = (subcategory: SubcategoryDto) => subcategory.id;

const selectedCategoryId = ref<number>();
const loading = ref(false);

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

// ----- CONTEXT ---- //
const { options, x, y, showDropdown } = useContextMenu();
const contexted = reactive<{
  type?: DataType;
  id?: number;
  name?: string;
}>({
  type: undefined,
  id: undefined,
  name: undefined,
});

async function openContextMenu(event: MouseEvent, type: DataType, data: CategoryDto | SubcategoryDto) {
  event.preventDefault();
  showDropdown.value = false;
  await nextTick();
  contexted.type = type;
  contexted.id = data.id;
  contexted.name = data.name;
  x.value = event.clientX;
  y.value = event.clientY;
  showDropdown.value = true;
}

function handleSelect(key: string | number) {
  if (key === 'edit') {
    const data = contexted.type === 'category'
      ? new CategoryRequestDto({ name: contexted.name })
      : new SubcategoryRequestDto({ name: contexted.name, categoryId: selectedCategoryId.value });
    openModal('update', contexted.type!, data)
  }
  if (key === 'delete') {
    openDeleteDialog(contexted.id!, contexted.name!, contexted.type!)
  }
  showDropdown.value = false
};

function onClickoutside() {
  showDropdown.value = false
};

// ----- MODAL ---- //
const loadingAction = ref(false);
const modal = ref(false);
const form = ref<FormInst>()
const nameInput = ref<InputInst>()
const modalState = reactive<{
  type?: DataType;
  action?: ModalAction;
  request: CategoryRequestDto | SubcategoryRequestDto;
}>({
  request: new CategoryRequestDto(),
})

async function sendData() {
  try {
    loadingAction.value = true;
    loadingBar.start();
    const result = await form.value?.validate();
    if (!result || !result?.warnings) {
      if (modalState.action === 'create' && modalState.type === 'category') {
        await categoryStore.createCategory(new CategoryRequestDto(modalState.request))
      }
      if (modalState.action === 'create' && modalState.type === 'subcategory') {
        await categoryStore.createSubcategory(new SubcategoryRequestDto(modalState.request))
      }
      if (modalState.action === 'update' && modalState.type === 'category') {
        await categoryStore.updateCategory(contexted.id!, new CategoryRequestDto(modalState.request))
      }
      if (modalState.action === 'update' && modalState.type === 'subcategory') {
        await categoryStore.updateSubcategory(contexted.id!, new SubcategoryRequestDto(modalState.request))
      }
      modalClose()
      await getCategories();
      loadingBar.finish();
    } else {
      message.error('Data tidak valid.')
    }
  } catch (error) {
    loadingBar.error();
  } finally {
    loadingAction.value = false;
  }
}

async function openModal(action: ModalAction, type: DataType, request: CategoryRequestDto | SubcategoryRequestDto) {
  modalState.action = action;
  modalState.type = type;
  modalState.request = request;
  modal.value = true;
  await nextTick();
  nameInput.value?.focus();
}

function modalClose() {
  modal.value = false;
}

watch(modal, async (value) => {
  if (!value) {
    await nextTick();
    modalState.request = new CategoryRequestDto();
  }
})

// ----- DIALOG ---- //
const dialog = useDialog();

function openDeleteDialog(id: number, name: string, type: DataType) {
  const content = [`Apakah anda yakin ingin menghapus ${DataTypeLookup[type]} "${name}"?`];
  if (type === 'category') {
    content.push(`Subkategori dalam kategori ini juga akan dihapus.`)
  }
  dialog.error({
    title: 'Konfirmasi hapus',
    content: content.join(' '),
    positiveText: 'Ya, hapus',
    negativeText: 'Batal',
    onPositiveClick: () => {
      deleteData(id, type)
    },
  })
}

async function deleteData(id: number, type: DataType) {
  try {
    loadingBar.start();
    if (type === 'category') {
      await categoryStore.deleteCategory(id);
    }
    if (type === 'subcategory') {
      await categoryStore.deleteSubcategory(id);
    }
    await getCategories();
    loadingBar.finish();
  } catch (error) {
    loadingBar.error();
  }
}
</script>

<template>
  <AppLayout @refresh="refresh">
    <NLayout
      content-style="padding: 1rem;"
      :native-scrollbar="false"
    >
      <NLayoutContent :native-scrollbar="false">
        <NGrid x-gap="16">
          <NGridItem :span="12">
            <!-- TABLE -->
            <NDataTable 
              :row-key="categoryRowKey"
              :row-props="categoryRowProps"
              :columns="categoryColumns"
              :data="categories"
              :max-height="height"
              :loading="loading"
            />
          </NGridItem>
          <NGridItem :span="12">
            <NDataTable
              :row-key="subcategoryRowKey"
              :row-props="subcategoryRowProps"
              :columns="subcategoryColumns"
              :data="subcategories"
              :max-height="height"
              :loading="loading"
            />
          </NGridItem>
        </NGrid>
      </NLayoutContent>
    </NLayout>
  </AppLayout>

  <!-- CONTEXT -->
  <NDropdown
    placement="bottom-start"
    trigger="manual"
    :x="x"
    :y="y"
    :options="options"
    :show="showDropdown"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  />

  <!-- MODAL -->
  <NModal
    v-model:show="modal"
    :title="`${modalState.action === 'create' ? 'Tambah' : 'Ubah'} ${modalState.type === 'category' ? 'kategori' : 'subkategori'}`"
    :closable="false"
    class="custom-card"
    preset="card"
    :bordered="false"
    style="width: 24rem;"
    size="small"
  >
    <NForm
      ref="form"
      :model="modalState.request"
      :rules="categoryRequestRule"
      @submit.prevent="sendData"
    >
      <NFormItem
        :label="`Nama ${DataTypeLookup[modalState.type!]}`"
        path="name"
      >
        <NInput
          ref="nameInput"
          v-model:value="modalState.request.name"
          :placeholder="`Ketik nama ${DataTypeLookup[modalState.type!]}...`"
        />
      </NFormItem>
    </NForm>
    <template #action>
      <NSpace justify="end">
        <NButton
          type="tertiary"
          :disabled="loadingAction"
          @click="modalClose"
        >
          Batal
        </NButton>
        <NButton
          type="primary"
          :loading="loadingAction"
          :disabled="loadingAction"
          @click="sendData"
        >
          Simpan
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped>
:deep(tr.selected td) {
  background-color: v-bind('themeVars.tableColorHover') !important;
}
</style>