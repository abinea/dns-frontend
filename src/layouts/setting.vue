<template>
  <div>
    <t-drawer size="408px" :footer="false" :visible.sync="showSettingPanel" header="页面配置" :closeBtn="true"
      :onCloseBtnClick="handleCloseDrawer" class="setting-drawer-container">
      <div class="setting-container">
        <t-form :data="formData" size="large" ref="form" labelAlign="left" @reset="onReset" @submit="onSubmit">
          <div class="setting-group-title">主题模式</div>
          <t-radio-group v-model="formData.mode">
            <div v-for="(item, index) in MODE_OPTIONS" :key="index" class="setting-layout-drawer">
              <div>
                <t-radio-button :key="index" :value="item.type">
                  <svg-icon :name="getModeIcon(item.type)" />
                </t-radio-button>
                <p :style="{ textAlign: 'center', marginTop: '8px' }">
                  {{ item.text }}
                </p>
              </div>
            </div>
          </t-radio-group>
          <div class="setting-group-title">主题色</div>
          <t-radio-group v-model="formData.brandTheme">
            <div v-for="(item, index) in DEFAULT_COLOR_OPTIONS" :key="index" class="setting-layout-drawer">
              <t-radio-button :key="index" :value="item" class="setting-layout-color-group">
                <color-container :value="item" />
              </t-radio-button>
            </div>
            <div class="setting-layout-drawer">
              <t-popup destroy-on-close expand-animation placement="bottom-right" trigger="click"
                :visible="isColoPickerDisplay" @visible-change="onPopupVisibleChange" :overlayStyle="{ padding: 0 }">
                <template #content>
                  <t-color-picker-panel :on-change="changeColor" :color-modes="['monochrome']" format="HEX"
                    :swatch-colors="[]" /></template>
                <t-radio-button :value="dynamicColor" :class="['setting-layout-color-group', 'dynamic-color-btn']">
                  <color-container :value="dynamicColor" />
                </t-radio-button>
              </t-popup>
            </div>
          </t-radio-group>
          <div class="setting-group-title">导航布局</div>

          <t-radio-group v-model="formData.layout">
            <div v-for="(item, index) in LAYOUT_OPTION" :key="index" class="setting-layout-drawer">
              <t-radio-button :key="index" :value="item">
                <thumbnail :src="getThumbnailUrl(item)" />
              </t-radio-button>
            </div>
          </t-radio-group>

          <t-form-item v-show="formData.layout === 'mix'" label="分割菜单（混合模式下有效）" name="splitMenu">
            <t-switch v-model="formData.splitMenu"></t-switch>
          </t-form-item>

          <t-form-item v-show="formData.layout !== 'side'" label="固定 Header" name="isHeaderFixed">
            <t-switch v-model="formData.isHeaderFixed"></t-switch>
          </t-form-item>
          <t-form-item v-show="formData.layout !== 'top'" label="固定 Sidebar" name="isSidebarFixed">
            <t-switch v-model="formData.isSidebarFixed"></t-switch>
          </t-form-item>

          <div class="setting-group-title">元素开关</div>
          <t-form-item label="显示 Header" name="showHeader" v-show="formData.layout === 'side'">
            <t-switch v-model="formData.showHeader"></t-switch>
          </t-form-item>
          <t-form-item label="显示 Breadcrumbs" name="showBreadcrumb">
            <t-switch v-model="formData.showBreadcrumb"></t-switch>
          </t-form-item>
          <t-form-item label="显示 Footer" name="showFooter">
            <t-switch v-model="formData.showFooter"></t-switch>
          </t-form-item>
          <t-form-item label="使用 多标签Tab页" name="isUseTabsRouter">
            <t-switch v-model="formData.isUseTabsRouter"></t-switch>
          </t-form-item>
          <t-form-item label="footer 内收" name="footerPosition" v-show="formData.showFooter && !formData.isSidebarFixed">
            <t-switch v-model="formData.isFooterAside"></t-switch>
          </t-form-item>
        </t-form>
        <div class="setting-info">
          <p>请复制后手动修改配置文件: /src/config/style.ts</p>
          <t-button theme="primary" variant="text" @click="handleCopy">
            复制配置项
          </t-button>
        </div>
      </div>
    </t-drawer>
  </div>
</template>
<script lang="ts" setup>
import { Color } from 'tvision-color'
import {
  MessagePlugin,
  PopupVisibleChangeContext,
  TdFormProps,
} from 'tdesign-vue-next'

import STYLE_CONFIG from '@/config/style'
import { insertThemeStylesheet, generateColorMap } from '@/utils/color'
import { DEFAULT_COLOR_OPTIONS } from '@/config/color'

import Thumbnail from '@/components/thumbnail.vue'
import ColorContainer from '@/components/color.vue'
import SvgIcon from '@/components/svg-icon.vue'
import { useSettingStore } from '@/store/setting'

const LAYOUT_OPTION = ['side', 'top', 'mix']
const MODE_OPTIONS = [
  { type: 'light', text: '明亮' },
  { type: 'dark', text: '暗黑' },
  { type: 'auto', text: '跟随系统' },
]

const settingStore = useSettingStore()
const colors = {
  hex: null,
}
const visible = ref(false)
const formData = ref(STYLE_CONFIG)
const isColoPickerDisplay = ref(false)

const iconName = computed(() => (visible.value ? 'close' : 'setting'))
const showSettingPanel = computed({
  get() {
    return settingStore.showSettingPanel
  },
  set(newVal) {
    settingStore.toggleSettingPanel(newVal)
  },
})
const showOthers = computed(() => {
  return (
    (formData.value.showFooter && !formData.value.isSidebarFixed) ||
    !formData.value.splitMenu
  )
})
const dynamicColor = computed(() => {
  const isDynamic =
    DEFAULT_COLOR_OPTIONS.indexOf(formData.value.brandTheme) === -1
  return isDynamic ? formData.value.brandTheme : ''
})

onMounted(() => {
  document
    .querySelector('.dynamic-color-btn')
    ?.addEventListener('click', () => {
      isColoPickerDisplay.value = true
    })
})

watch(
  formData,
  newVal => {
    if (!newVal.brandTheme) return
    // 没有在formData中 需要从store中同步过来
    settingStore.changeTheme({
      ...newVal,
      isSidebarCompact: settingStore.styleConfig.isSidebarCompact,
    })
  },
  { deep: true }
)

const onPopupVisibleChange = (
  visible: boolean,
  context: PopupVisibleChangeContext
) => {
  if (!visible && context.trigger === 'document')
    isColoPickerDisplay.value = visible
}
const onReset = () => {
  this.formData = {
    ...STYLE_CONFIG,
  }
  this.$message.success('已恢复初始设置')
}
const onSubmit: TdFormProps['onSubmit'] = ({
  validateResult,
  firstError,
  e,
}) => {
  e!.preventDefault()
  if (validateResult === true) {
    visible.value = false
  } else {
    MessagePlugin.warning(firstError!)
  }
}
const getModeIcon = (mode: string) => {
  if (mode === 'light') {
    return 'assets-setting-light'
  }
  if (mode === 'dark') {
    return 'assets-setting-dark'
  }
  return 'assets-setting-auto'
}
const getThumbnailUrl = (name: string) => {
  return `https://tdesign.gtimg.com/starter/setting/${name}.png`
}
const handleClick = () => {
  settingStore.toggleSettingPanel(true)
}
const handleCloseDrawer = (): void => {
  settingStore.toggleSettingPanel(false)
}
const handleCopy = () => {
  const text = JSON.stringify(formData.value, null, 4)
  this.$copyText(text).then(() => {
    MessagePlugin.closeAll()
    MessagePlugin.success('复制成功')
  })
}
const changeColor = (hex: string) => {
  const { colors: newPalette, primary: brandColorIndex } =
    Color.getColorGradations({
      colors: [hex],
      step: 10,
      remainInput: false, // 是否保留输入 不保留会矫正不合适的主题色
    })[0]

  const colorMap = generateColorMap(
    hex,
    newPalette,
    settingStore.mode,
    brandColorIndex
  )
  formData.value.brandTheme = hex

  settingStore.addColor({ [hex]: colorMap })
  settingStore.changeTheme({
    ...settingStore.styleConfig,
    brandTheme: hex,
  })

  insertThemeStylesheet(hex, colorMap, settingStore.mode)
}
</script>

<style lang="less">
.tdesign-setting {
  z-index: 100;
  position: fixed;
  bottom: 200px;
  right: 0;
  transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
    visibility 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  height: 40px;
  width: 40px;
  border-radius: 20px 0 0 20px;
  transition: all 0.3s;

  .t-icon {
    margin-left: 8px;
  }

  .tdesign-setting-text {
    font-size: 12px;
    display: none;
  }

  &:hover {
    width: 96px;

    .tdesign-setting-text {
      display: inline-block;
    }
  }
}

.setting-layout-color-group {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50% !important;
  padding: 6px !important;
  border: 2px solid transparent !important;

  >.t-radio-button__label {
    display: inline-flex;
  }
}

.tdesign-setting-close {
  position: fixed;
  bottom: 200px;
  right: 300px;
}

.setting-group-title {
  font-size: 14px;
  line-height: 22px;
  margin: 32px 0 24px 0;
  text-align: left;
  font-family: PingFang SC;
  font-style: normal;
  font-weight: 500;
  color: var(--td-text-color-primary);
}

.setting-group-color {
  position: relative;

  >div {
    position: absolute;
    z-index: 2;
    right: 0;
  }
}

.setting-link {
  cursor: pointer;
  color: var(--td-brand-color);
  margin-bottom: 8px;
}

.setting-info {
  position: absolute;
  padding: 24px;
  bottom: 0;
  left: 0;
  line-height: 20px;
  font-size: 12px;
  text-align: center;
  color: var(--td-text-color-placeholder);
  width: 100%;
  background: var(--td-bg-color-container);
}

.setting-drawer-container {
  .setting-container {
    padding-bottom: 100px;
  }

  .t-radio-group.t-size-m {
    min-height: 32px;

    width: 100%;
    height: auto;
    justify-content: space-between;
    align-items: center;
  }

  .setting-layout-drawer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;

    .t-radio-button {
      display: inline-flex;
      height: 100%;
      max-height: 78px;
      padding: 8px;
      border-radius: var(--td-radius-default);
      border: 2px solid var(--td-component-border);
      height: auto;

      >.t-radio-button__label {
        display: inline-flex;
      }
    }

    .t-is-checked {
      border: 2px solid var(--td-brand-color) !important;
    }

    .t-form__controls-content {
      justify-content: end;
    }
  }

  .t-form__controls-content {
    justify-content: end;
  }
}

.setting-route-theme {
  .t-form__label {
    min-width: 310px !important;
    color: var(--td-text-color-secondary);
  }
}

.setting-color-theme {
  .setting-layout-drawer {
    .t-radio-button {
      height: 32px;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

.setting-drawer-container .t-radio-group.t-radio-group__outline.t-size-m .t-radio-button {
  height: auto;
}
</style>
