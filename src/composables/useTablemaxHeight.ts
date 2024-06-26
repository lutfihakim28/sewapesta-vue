import { onMounted, ref } from 'vue'

export function useTableMaxHeight() {
  const height = ref(400);

  onMounted(() => {
    const screenHeight = document.body.getBoundingClientRect().height;
    const rem = 16;
    height.value = screenHeight - (1 * rem) - (2 * rem) - (4.5 * rem) - 120;
  })

  return {
    height
  }
}