<template>
  <img :class="className" :src="url" />
</template>

<script lang="ts" setup>
const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'layout',
  },
})

const className = computed(() => {
  return [
    'thumbnail-container',
    {
      'thumbnail-circle': props.type === 'circle',
      'thumbnail-layout': props.type === 'layout',
    },
  ]
})
</script>

<style lang="less" scoped>
@import url('@/style/index.less');

.thumbnail {
  &-container {
    display: inline-block;
  }

  &-circle {
    border-radius: var(--td-radius-circle);
  }

  &-layout {
    width: 88px;
    height: 48px;
  }
}
</style>
