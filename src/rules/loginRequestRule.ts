import { validationMessages } from '@/constants/validationMessages';
import { LoginRequestDto } from '@/dtos/LoginRequestDto';
import { FormItemRule } from 'naive-ui';
import { ValidationTrigger } from 'naive-ui/es/form/src/interface';

export const loginRequestRule: Record<keyof LoginRequestDto, FormItemRule[]> = {
  username: [
    {
      required: true,
      trigger: ['input'] as ValidationTrigger[],
      validator: (_, value: string) => {
        if (!value) {
          return new Error(validationMessages.required('Nama Pengguna'))
        }
        return true;
      }
    }
  ],
  password: [
    {
      required: true,
      trigger: ['input'] as ValidationTrigger[],
      validator: (_, value: string) => {
        if (!value) {
          return new Error(validationMessages.required('Kata Sandi'))
        }
        if (value.length < 8) {
          return new Error(validationMessages.minLength('Kata Sandi', 8))
        }
        return true;
      }
    }
  ]
}