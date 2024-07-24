import { CustomException } from '@/exceptions/CustomException';
import { useMessage } from 'naive-ui';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
  const message = useMessage();

  function handleError(error: unknown) {
    if (error instanceof CustomException) {
      if (error.messages instanceof Array) {
        error.messages.forEach((m) => {
          message.error(m);
        })
      }

      if (typeof error.messages === 'string') {
        message.error(error.messages)
      }
    }
  }

  return { handleError }
})