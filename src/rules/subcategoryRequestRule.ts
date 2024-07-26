import { validationMessages } from '@/constants/validationMessages';
import { SubcategoryRequestDto } from '@/dtos/SubcategoryRequestDto';
import { FormItemRule } from 'naive-ui';
import { ValidationTrigger } from 'naive-ui/es/form/src/interface';

export const subcategoryRequestRule: Record<keyof SubcategoryRequestDto, FormItemRule[]> = {
  name: [
    {
      required: true,
      trigger: ['input'] as ValidationTrigger[],
      validator: (_, value: string) => {
        if (!value) {
          return new Error(validationMessages.required('Nama subkategori'))
        }
        return true;
      }
    }
  ],
}