import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRefreshSubsriberStore = defineStore('refresh-subsriber', () => {
  const requests = ref<Array<() => Promise<unknown>>>([]);
  const isRefreshing = ref<boolean>(false);

  function add(request: () => Promise<unknown>) {
    console.log('Adding Subscriber', request)
    requests.value.push(request);
  }

  function clear() {
    requests.value = []
  }

  async function execute() {
    console.log('Execute subsriber', requests.value)
    await Promise.all(requests.value)
  }

  return {
    requests,
    isRefreshing,
    add,
    clear,
    execute,
  }
})
