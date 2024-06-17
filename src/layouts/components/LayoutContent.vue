<template>
  <t-layout :class="[`${prefix}-layout`]">
    <t-tabs v-if="setting.isUseTabsRouter" theme="card" :class="`${prefix}-layout-tabs-nav`" :value="$route.path"
      @change="handleChangeCurrentTab" :style="{ position: 'sticky', top: 0, width: '100%' }">
      <t-tab-panel v-for="(route, idx) in tabRouterList" :value="route.path" :key="`${route.path}_${idx}`"
        :removable="!route.isHome" @remove="() => handleRemove(route.path, idx)">
        <template #label>
          <t-dropdown trigger="context-menu" :minColumnWidth="128" :popupProps="{
            overlayClassName: 'route-tabs-dropdown',
            onVisibleChange: (visible, ctx) =>
              handleTabMenuClick(visible, ctx, route.path),
            visible: activeTabPath === route.path,
          }">
            <template v-if="!route.isHome">
              {{ route.title }}
            </template>
            <home-icon v-else />
            <template #dropdown>
              <t-dropdown-menu>
                <t-dropdown-item @click="() => handleRefresh(route.path, idx)">
                  <refresh-icon />
                  刷新
                </t-dropdown-item>
                <t-dropdown-item v-if="idx > 0" @click="() => handleCloseAhead(route.path, idx)">
                  <arrow-left-icon />
                  关闭左侧
                </t-dropdown-item>
                <t-dropdown-item v-if="idx < tabRouterList.length - 1"
                  @click="() => handleCloseBehind(route.path, idx)">
                  <arrow-right-icon />
                  关闭右侧
                </t-dropdown-item>
                <t-dropdown-item @click="() => handleCloseOther(route.path, idx)">
                  <close-circle-icon />
                  关闭其它
                </t-dropdown-item>
              </t-dropdown-menu>
            </template>
          </t-dropdown>
        </template>
      </t-tab-panel>
    </t-tabs>
    <t-content :class="`${prefix}-content-layout`">
      <layout-breadcrumb v-if="setting.showBreadcrumb" />
      <common-content />
    </t-content>
    <t-footer v-if="settingStore.showFooter" :class="`${prefix}-footer-layout`">
      <layout-footer />
    </t-footer>
  </t-layout>
</template>

<script lang="ts" setup>
import {
  RefreshIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  CloseCircleIcon,
} from 'tdesign-icons-vue-next'

import CommonContent from './Content.vue'
import LayoutBreadcrumb from './Breadcrumb.vue'
import LayoutFooter from './Footer.vue'

import { prefix as PREFIX } from '@/config/global'
import { useSettingStore, useTabRouterStore } from '@/store'

const router = useRouter()
const tabRouterStore = useTabRouterStore()
const settingStore = useSettingStore()
const { styleConfig: setting } = storeToRefs(settingStore)

const prefix = ref(PREFIX)
const activeTabPath = ref<string | null>('')
const tabRouterList = computed(() => tabRouterStore.tabRouterList)

function handleRemove(path: string, routeIdx: number) {
  const nextRouter =
    tabRouterList.value[routeIdx + 1] || tabRouterList.value[routeIdx - 1]

  tabRouterStore.subtractCurrentTabRouter({ path, routeIdx })
  if (path === router.currentRoute.value.path) {
    router.push(nextRouter.path)
  }
}
function handleChangeCurrentTab(path: string) {
  router.push(path)
}
function handleRefresh(currentPath: string, routeIdx: number) {
  tabRouterStore.toggleTabRouterAlive(routeIdx)
  nextTick(() => {
    tabRouterStore.toggleTabRouterAlive(routeIdx)
    router.replace({ path: currentPath })
  })
  activeTabPath.value = null
}
function handleCloseAhead(path: string, routeIdx: number) {
  tabRouterStore.subtractTabRouterAhead({ path, routeIdx })
  handleOperationEffect('ahead', routeIdx)
}
function handleCloseBehind(path: string, routeIdx: number) {
  tabRouterStore.subtractTabRouterBehind({ path, routeIdx })
  handleOperationEffect('behind', routeIdx)
}
function handleCloseOther(path: string, routeIdx: number) {
  tabRouterStore.subtractTabRouterOther({ path, routeIdx })
  handleOperationEffect('other', routeIdx)
}
function handleOperationEffect(
  type: 'other' | 'ahead' | 'behind',
  routeIndex: number
) {
  const currentPath = router.currentRoute.value.path
  const currentIdx = tabRouterList.value.findIndex(
    (i: { path: string }) => i.path === currentPath
  )
  // 存在三种情况需要刷新当前路由
  // 点击非当前路由的关闭其他、点击非当前路由的关闭左侧且当前路由小于触发路由、点击非当前路由的关闭右侧且当前路由大于触发路由
  const needRefreshRouter =
    (type === 'other' && currentIdx !== routeIndex) ||
    (type === 'ahead' && currentIdx < routeIndex) ||
    (type === 'behind' && currentIdx === -1)
  if (needRefreshRouter) {
    const nextRouteIdx = type === 'behind' ? tabRouterList.value.length - 1 : 1
    const nextRouter = tabRouterList.value[nextRouteIdx]

    router.push(nextRouter.path)
  }

  activeTabPath.value = null
}
function handleTabMenuClick(visible: boolean, ctx, path: string) {
  if (ctx?.trigger === 'document') activeTabPath.value = null
  if (visible) activeTabPath.value = path
}
</script>
