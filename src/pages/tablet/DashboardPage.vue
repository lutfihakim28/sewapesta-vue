<script setup lang="ts">

</script>

<template>
  <section>
    <p
      v-for="i in 100"
      :key="i"
    >
      {{ i }}
    </p>
  </section>
</template>
