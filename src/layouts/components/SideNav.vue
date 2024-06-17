<template>
  <div :class="sideNavCls">
    <t-menu
      width="232px"
      :class="menuCls"
      :theme="theme"
      :value="active"
      :collapsed="collapsed"
      :defaultExpanded="defaultExpanded"
    >
      <template #logo>
        <span
          v-if="showLogo"
          :class="`${prefix}-side-nav-logo-wrapper`"
          style="font-size: 18px; font-weight: bold"
          @click="() => handleNav('/timer-detect-sniffer')"
        >
          <span v-if="!collapsed">DNS隐秘隧道检测系统 </span>

          <!-- <svg-icon
            :name="getLogo"
            :class="`${prefix}-side-nav-logo-${
              collapsed ? 't' : 'tdesign'
            }-logo`"
          /> -->
        </span>
      </template>
      <menu-content :nav-data="menu" />
      <!-- <template #operations>
        <span class="version-container">
          {{ !collapsed ? `TDesign Starter ${pgk.version}` : pgk.version }}
        </span>
      </template> -->
    </t-menu>
    <div
      :class="`${prefix}-side-nav-placeholder${collapsed ? '-hidden' : ''}`"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/store'
import { prefix as PREFIX } from '@/config/global'
// import SvgIcon from '@/components/svg-icon.vue'
import MenuContent from './MenuContent.vue'
import * as PGK from '../../../package.json'

export type ClassName = { [className: string]: any } | ClassName[] | string

const MIN_POINT = 992 - 1

const props = defineProps({
  menu: Array,
  showLogo: {
    type: Boolean,
    default: true,
  },
  isFixed: {
    type: Boolean,
    default: true,
  },
  layout: String,
  headerHeight: {
    type: String,
    default: '56px',
  },
  theme: {
    type: String,
    default: 'light',
  },
  isCompact: {
    type: Boolean,
    default: false,
  },
  maxLevel: {
    type: Number,
    default: 3,
  },
})

const prefix = ref(PREFIX)
const pgk = ref(PGK)
const router = useRouter()
const route = useRoute()
const settingStore = useSettingStore()

const active = computed(() => {
  if (!route.path) {
    return ''
  }
  return route.path
    .split('/')
    .filter(
      (_item: string, index: number) => index <= props.maxLevel && index > 0
    )
    .map((item: string) => `/${item}`)
    .join('')
})

const defaultExpanded = computed(() => {
  const path = active.value
  const parentPath = path.substring(0, path.lastIndexOf('/'))
  if (parentPath.lastIndexOf('/')) {
    const threeLevel = parentPath.substring(0, parentPath.lastIndexOf('/'))
    return threeLevel === '' ? [] : [threeLevel, parentPath]
  }
  return parentPath === '' ? [] : [parentPath]
})
const iconName = computed(() => {
  return settingStore.styleConfig.isSidebarCompact ? 'menu-fold' : 'menu-unfold'
})
const collapsed = computed(() => {
  return settingStore.styleConfig.isSidebarCompact
})
const sideNavCls = computed(() => {
  return [
    `${prefix.value}-sidebar-layout`,
    {
      [`${prefix.value}-sidebar-compact`]: props.isCompact,
    },
  ]
})

const menuCls = computed(() => {
  return [
    `${prefix.value}-side-nav`,
    {
      [`${prefix.value}-side-nav-no-logo`]: !props.showLogo,
      [`${prefix.value}-side-nav-no-fixed`]: !props.isFixed,
      [`${prefix.value}-side-nav-mix-fixed`]:
        props.layout === 'mix' && props.isFixed,
    },
  ]
})

const layoutCls = computed(() => {
  return [
    `${prefix.value}-side-nav-${props.layout}`,
    `${prefix.value}-sidebar-layout`,
  ]
})

// const getLogo = computed(() => {
//   if (collapsed.value) {
//     return 'assets-t-logo'
//   }
//   return 'assets-logo-full'
// })

function changeCollapsed(): void {
  settingStore.toggleSidebarCompact()
}

function autoCollapsed(): void {
  const isCompact = window.innerWidth <= MIN_POINT
  settingStore.showSidebarCompact(isCompact)
}
function handleNav(url: string) {
  router.push(url)
}

onMounted(() => {
  autoCollapsed()

  window.onresize = () => {
    autoCollapsed()
  }
})
</script>
