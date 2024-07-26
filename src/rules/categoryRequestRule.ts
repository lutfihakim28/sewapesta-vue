import { validationMessages } from '@/constants/validationMessages';
import { CategoryRequestDto } from '@/dtos/CategoryRequestDto';
import { FormItemRule } from 'naive-ui';
import { ValidationTrigger } from 'naive-ui/es/form/src/interface';

export const categoryRequestRule: Record<keyof CategoryRequestDto, FormItemRule[]> = {
  name: [
    {
      required: true,
      trigger: ['input'] as ValidationTrigger[],
      validator: (_, value: string) => {
        if (!value) {
          return new Error(validationMessages.required('Nama kategori'))
        }
        return true;
      }
    }
  ],
}