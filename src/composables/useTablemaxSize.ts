import { onMounted, ref } from 'vue'

export function useTableMaxSize() {
  const height = ref(400);
  const width = ref(800);

  onMounted(() => {
    const screenHeight = document.body.getBoundingClientRect().height;
    const screenWidth = document.body.getBoundingClientRect().width;
    const rem = 16;
    height.value = screenHeight - (1 * rem) - (2 * rem) - (4.5 * rem) - 120;
    width.value = screenWidth - (2 * 272) - (4 * rem);
  })

  return {
    height,
    width,
  }
}