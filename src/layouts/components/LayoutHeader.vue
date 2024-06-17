<template>
  <common-header v-if="showHeader" :showLogo="showHeaderLogo" :theme="mode" :layout="setting.layout"
    :isFixed="setting.isHeaderFixed" :menu="headerMenu" :isCompact="setting.isSidebarCompact"
    :maxLevel="setting.splitMenu ? 1 : 3" />
</template>

<script lang="ts" setup>
import CommonHeader from './Header.vue'
import { useSettingStore, usePermissionStore } from '@/store'

const settingStore = useSettingStore()
const {
  showHeader,
  showHeaderLogo,
  mode,
  styleConfig: setting,
} = storeToRefs(settingStore)
const permissionStore = usePermissionStore()

const headerMenu = computed(() => {
  let { routers: menuRouter } = permissionStore
  if (setting.value.layout === 'mix') {
    if (setting.value.splitMenu) {
      return menuRouter.map(menu => ({
        ...menu,
        children: [],
      }))
    }
    return []
  }
  return menuRouter
})
</script>
