<script setup lang="ts">
import { useLocationStore } from '@/stores/location';
import { watch } from 'vue';

const locationStore = useLocationStore();

watch(() => locationStore.subdistricts, () => {
  console.log(locationStore.subdistricts)
})

watch(() => locationStore.districts, () => {
  console.log(locationStore.districts)
})
watch(() => locationStore.cities, () => {
  console.log(locationStore.cities)
})
watch(() => locationStore.provinces, () => {
  console.log(locationStore.provinces)
})
</script>

<template>
  <span>tes</span>
</template>