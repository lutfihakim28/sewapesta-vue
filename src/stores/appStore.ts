import { useToast } from '@/components/ui/toast';
import { CustomException } from '@/exceptions/CustomException';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
  const { toast } = useToast();

  function handleError(error: unknown) {
    if (error instanceof CustomException) {
      if (error.messages instanceof Array) {
        error.messages.forEach((message) => {
          toast({
            description: message,
            variant: 'destructive'
          })
        })
      }

      if (typeof error.messages === 'string') {
        toast({
          description: error.messages,
          variant: 'destructive'
        })
      }
    }
  }

  return { handleError }
})