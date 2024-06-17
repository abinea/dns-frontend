<template>
  <router-view class="light" />
</template>

<script lang="ts" setup>
// import config from '@/config/style'

const mode = computed(() => 'setting/mode')
onMounted(() => {
  // this.$store.dispatch('setting/changeTheme', { ...config })
})
</script>
