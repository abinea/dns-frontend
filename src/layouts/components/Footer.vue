<template>
  <!-- <div :class="prefix + '-footer'">
    Copyright © {{ new Date().getFullYear() }} . All Rights Reserved
  </div> -->
</template>

<script lang="ts" setup>
import { prefix as PREFIX } from '@/config/global'

const prefix = ref(PREFIX)
</script>

<style lang="less" scoped>
@import '@/style/variables';

.@{starter-prefix}-footer {
  color: var(--td-text-color-placeholder);
  line-height: 20px;
  text-align: center;
}
</style>
