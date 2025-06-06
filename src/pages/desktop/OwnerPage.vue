<script setup lang="ts">
import { RoleEnum } from '@/utils/enums/role';

</script>

<template>
  <UserPage :role="RoleEnum.Owner" />
</template>
