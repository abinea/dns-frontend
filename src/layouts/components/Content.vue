<template>
  <transition name="fade" mode="out-in">
    <keep-alive :include="aliveViews">
      <router-view v-if="!tabRouterStore.isRefreshing" />
    </keep-alive>
  </transition>
</template>
<script lang="ts" setup>
import { isBoolean, isUndefined } from 'lodash-es'
import { useTabRouterStore } from '@/store'

const tabRouterStore = useTabRouterStore()
const aliveViews = computed(() => {
  return tabRouterStore.tabRouterList
    .filter(route => {
      const keepAliveConfig = route.meta?.keepAlive
      const isRouteKeepAlive =
        isUndefined(keepAliveConfig) ||
        (isBoolean(keepAliveConfig) && keepAliveConfig) // 默认开启keepalive
      return route.isAlive && isRouteKeepAlive
    })
    .map(route => route.name!)
})
</script>
<style lang="less" scoped>
.fade-leave-active,
.fade-enter-active {
  transition: opacity @anim-duration-slow @anim-time-fn-easing;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
