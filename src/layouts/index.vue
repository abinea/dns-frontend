<template>
  <div>
    <template v-if="settingStore.styleConfig.layout === 'side'">
      <t-layout key="side">
        <t-aside><layout-sidebar /></t-aside>
        <t-layout>
          <t-header><layout-header /></t-header>
          <t-content><layout-content /></t-content>
        </t-layout>
      </t-layout>
    </template>
    <template v-else-if="settingStore.styleConfig.layout === 'top'">
      <t-layout key="top">
        <t-header> <layout-header /></t-header>
        <t-content><layout-content /></t-content>
      </t-layout>
    </template>
    <template v-else>
      <t-layout key="mix">
        <t-header><layout-header /></t-header>
        <t-layout>
          <t-aside><layout-sidebar /></t-aside>
          <t-content><layout-content /></t-content>
        </t-layout>
      </t-layout>
    </template>
    <setting />
  </div>
</template>

<script lang="ts" setup>
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutContent from './components/LayoutContent.vue'
import LayoutSidebar from './components/LayoutSidebar.vue'
import Setting from './setting.vue'
import { prefix } from '@/config/global'
import '@/style/layout.less'
import { useSettingStore, useTabRouterStore } from '@/store'

const name = `${prefix}-base-layout`
const settingStore = useSettingStore()
const tabRouterStore = useTabRouterStore()
const route = useRoute()

const tabRouterList = tabRouterStore.tabRouterList

// export default ({
//   watch: {
//     $route(newRoute) {
//       // 监听路由变化往多标签新增
//       const {
//         path,
//         meta: { title },
//         name,
//       } = newRoute;
//       this.$store.commit('tabRouter/appendTabRouterList', { path, title, name, isAlive: true });
//     },
//   },
// });

function getTabRouterListCache() {
  tabRouterStore.initTabRouterList(
    JSON.parse(String(localStorage.getItem('tabRouterList')))
  )
}
function setTabRouterListCache() {
  localStorage.setItem('tabRouterList', JSON.stringify(tabRouterList))
}
// 如果不需要持久化标签页可以注释掉created和destroyed的内容
window.addEventListener('beforeunload', setTabRouterListCache)
onUnmounted(() => {
  window.removeEventListener('beforeunload', setTabRouterListCache)
})
onMounted(() => {
  const {
    path,
    meta: { title },
    name,
  } = route

  if (localStorage.getItem('tabRouterList')) getTabRouterListCache()
  tabRouterStore.appendTabRouterList({
    path,
    title: String(title),
    name: name || undefined,
    isAlive: true,
  })
})
</script>
