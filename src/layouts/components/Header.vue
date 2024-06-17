<template>
  <div :class="layoutCls">
    <t-head-menu
      :class="menuCls"
      :theme="theme"
      expandType="popup"
      :value="active"
    >
      <template #logo>
        <span
          v-if="showLogo"
          class="header-logo-container"
          @click="navigateTo('/timer-detect-sniffer')"
        >
          <!-- <svg-icon name="assets-logo-full" class="t-logo" /> -->
        </span>
        <div v-else class="header-operate-left">
          <t-button
            theme="default"
            shape="square"
            variant="text"
            @click="changeCollapsed"
          >
            <view-list-icon class="collapsed-icon" />
          </t-button>
          <search :layout="layout" />
        </div>
      </template>
      <menu-content
        v-show="layout !== 'side'"
        class="header-menu"
        :nav-data="props.menu"
      />
      <template #operations>
        <div class="operations-container">
          <!-- 搜索框 -->
          <search v-if="layout !== 'side'" :layout="layout" />

          <!-- 全局通知 -->
          <!-- <notice /> -->

          <!-- <t-tooltip placement="bottom" content="代码仓库">
            <t-button theme="default" shape="square" variant="text" @click="navToGitHub">
              <logo-github-icon />
            </t-button>
          </t-tooltip> -->
          <t-tooltip placement="bottom" content="帮助文档">
            <t-button
              theme="default"
              shape="square"
              variant="text"
              @click="navToHelper"
            >
              <help-circle-icon />
            </t-button>
          </t-tooltip>
          <t-dropdown :min-column-width="125" trigger="click">
            <template #dropdown>
              <t-dropdown-menu>
                <t-dropdown-item
                  class="operations-dropdown-container-item"
                  @click="navigateTo('/user-profile')"
                >
                  <user-password-icon />修改密码
                </t-dropdown-item>
                <t-dropdown-item
                  class="operations-dropdown-container-item"
                  @click="handleLogout"
                >
                  <poweroff-icon />退出登录
                </t-dropdown-item>
              </t-dropdown-menu>
            </template>
            <t-button class="header-user-btn" theme="default" variant="text">
              <template #icon>
                <user-circle-icon class="header-user-avatar" />
              </template>
              <div class="header-user-account">
                {{ userStore.userInfo.username }}
              </div>
              <template #suffix>
                <chevron-down-icon />
              </template>
            </t-button>
          </t-dropdown>
          <t-tooltip placement="bottom" content="系统设置">
            <t-button
              theme="default"
              shape="square"
              variant="text"
              @click="toggleSettingPanel"
            >
              <setting-icon />
            </t-button>
          </t-tooltip>
        </div>
      </template>
    </t-head-menu>
  </div>
</template>

<script lang="ts" setup>
import {
  ViewListIcon,
  // LogoGithubIcon,
  HelpCircleIcon,
  UserCircleIcon,
  UserPasswordIcon,
  PoweroffIcon,
  SettingIcon,
  ChevronDownIcon,
} from 'tdesign-icons-vue-next'
import { prefix as PREFIX } from '@/config/global'
import SvgIcon from '@/components/svg-icon.vue'

// import Notice from './Notice.vue'
import Search from './Search.vue'
import MenuContent from './MenuContent.vue'
import { navigateTo } from '@/router'
import { useUserStore, useSettingStore } from '@/store'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const settingStore = useSettingStore()

const props = defineProps({
  theme: String,
  layout: {
    type: String,
    default: 'top',
  },
  showLogo: {
    type: Boolean,
    default: true,
  },
  menu: {
    type: Array,
  },
  isFixed: {
    type: Boolean,
    default: false,
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
// const visibleNotice = ref(false)
// const isSearchFocus = ref(false)

const active = computed(() => {
  if (!route.path) {
    return ''
  }
  return route.path
    .split('/')
    .filter((_, index) => index <= props.maxLevel && index > 0)
    .map(item => `/${item}`)
    .join('')
})
// const showMenu = computed(() => {
//   return !(props.layout === 'mix'
//     // && props.showLogo === 'side'
//   );
// })
const layoutCls = computed(() => {
  return [`${prefix.value}-header-layout`]
})
const menuCls = computed(() => {
  return [
    {
      [`${prefix.value}-header-menu`]: !props.isFixed,
      [`${prefix.value}-header-menu-fixed`]: props.isFixed,
      [`${prefix.value}-header-menu-fixed-side`]:
        props.layout === 'side' && props.isFixed,
      [`${prefix.value}-header-menu-fixed-side-compact`]:
        props.layout === 'side' && props.isFixed && props.isCompact,
    },
  ]
})

function toggleSettingPanel() {
  settingStore.toggleSettingPanel(true)
}
function handleLogout() {
  router.push(`/login?redirect=${route.fullPath}`)
}
function changeCollapsed() {
  settingStore.toggleSidebarCompact()
}
// function navToGitHub() {
//   window.open('https://github.com/Tencent/tdesign-vue-starter')
// }
function navToHelper() {
  window.open('http://tdesign.tencent.com/starter/docs/get-started')
}
</script>

<style lang="less">
@import '@/style/variables.less';

.header-menu {
  flex: 1 1 1;
  display: inline-flex;
}

.operations-container {
  display: flex;
  align-items: center;
  margin-right: 12px;

  .t-popup__reference {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .t-button {
    margin: 0 8px;

    &.header-user-btn {
      margin: 0;
    }
  }

  .t-icon {
    font-size: 20px;

    &.general {
      margin-right: 16px;
    }
  }
}

.header-operate-left {
  display: flex;
  margin-left: 20px;
  align-items: normal;
  line-height: 0;

  .collapsed-icon {
    font-size: 20px;
  }
}

.header-logo-container {
  width: 184px;
  height: 26px;
  display: flex;
  margin-left: 24px;
  color: var(--td-text-color-primary);

  .t-logo {
    width: 100%;
    height: 100%;

    &:hover {
      cursor: pointer;
    }
  }

  &:hover {
    cursor: pointer;
  }
}

.header-user-account {
  display: inline-flex;
  align-items: center;
  color: var(--td-text-color-primary);

  .t-icon {
    margin-left: 4px;
    font-size: 16px;
  }
}

.t-head-menu__inner {
  border-bottom: 1px solid var(--td-border-level-1-color);
}

.t-menu--light {
  .header-user-account {
    color: var(--td-text-color-primary);
  }
}

.t-menu--dark {
  .t-head-menu__inner {
    border-bottom: 1px solid var(--td-gray-color-10);
  }

  .header-user-account {
    color: rgba(255, 255, 255, 0.55);
  }

  .t-button {
    --ripple-color: var(--td-gray-color-10) !important;

    &:hover {
      background: var(--td-gray-color-12) !important;
    }
  }
}

.operations-dropdown-container-item {
  width: 100%;
  display: flex;
  align-items: center;

  .t-icon {
    margin-right: 8px;
  }

  .t-dropdown__item {
    .t-dropdown__item__content {
      display: flex;
      justify-content: center;
    }

    .t-dropdown__item__content__text {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
  }

  .t-dropdown__item {
    width: 100%;
    margin-bottom: 0px;
  }

  &:last-child {
    .t-dropdown__item {
      margin-bottom: 8px;
    }
  }
}
</style>
