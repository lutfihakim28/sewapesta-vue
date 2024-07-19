import { CustomException } from '@/exceptions/CustomException';
import { useMessage } from 'naive-ui';
import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const message = useMessage();

  const authModalShown = ref(true);

  onMounted(() => {
    // modal.create({
    //   style: {
    //     width: '24rem',
    //   },
    //   preset: 'card',
    //   content: () => h(LoginForm)
    // })
  })

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

  return { handleError, authModalShown }
})