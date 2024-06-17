<template>
  <side-nav
    v-if="showSidebar"
    :showLogo="showSidebarLogo"
    :layout="setting.layout"
    :isFixed="setting.isSidebarFixed"
    :menu="sideMenu"
    :theme="mode"
    :isCompact="setting.isSidebarCompact"
    :maxLevel="setting.splitMenu ? 2 : 3"
  />
</template>

<script lang="ts" setup>
import { usePermissionStore, useSettingStore } from '@/store'
import SideNav from './SideNav.vue'

const route = useRoute()
const settingStore = useSettingStore()
const permissionStore = usePermissionStore()
const {
  showSidebar,
  showSidebarLogo,
  mode,
  styleConfig: setting,
} = storeToRefs(settingStore)

const sideMenu = computed(() => {
  // 失去响应式作为一个初始值，避免作为getter更新
  let menuRouters = permissionStore.routers
  if (setting.value.layout === 'mix' && setting.value.splitMenu) {
    menuRouters.forEach(menu => {
      if (route.path.indexOf(menu.path) === 0) {
        menuRouters = menu.children.map((subMenu: any) => ({
          ...subMenu,
          path: `${menu.path}/${subMenu.path}`,
        }))
      }
    })
  }
  return menuRouters
})
</script>

<style lang="less" scoped></style>
