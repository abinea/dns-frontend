import { Color } from 'tvision-color'
import STYLE_CONFIG from '@/config/style'
import {
  TColorSeries,
  TColorToken,
  LIGHT_CHART_COLORS,
  DARK_CHART_COLORS,
} from '@/config/color'
import { insertThemeStylesheet, generateColorMap } from '@/utils/color'

type IStateType = typeof STYLE_CONFIG

export const useSettingStore = defineStore('store', () => {
  const showSettingPanel = ref(false)
  const colorList = ref({})
  const chartColors = ref<TColorToken>(LIGHT_CHART_COLORS)
  const styleConfig = ref(STYLE_CONFIG)

  function updateStyleConfig(payload: IStateType) {
    styleConfig.value = payload
  }

  function toggleSidebarCompact() {
    styleConfig.value.isSidebarCompact = !styleConfig.value.isSidebarCompact
  }
  function toggleUseTabsRouter() {
    styleConfig.value.isUseTabsRouter = !styleConfig.value.isUseTabsRouter
  }
  function showSidebarCompact(flag: boolean) {
    styleConfig.value.isSidebarCompact = flag
  }
  function toggleSettingPanel(flag: boolean) {
    showSettingPanel.value = flag
  }
  function addColor(payload: TColorSeries) {
    colorList.value = { ...colorList.value, ...payload }
  }
  function changeChartColor(payload: TColorToken) {
    chartColors.value = { ...payload }
  }

  const showHeader = computed(() => styleConfig.value.showHeader)
  const showSidebar = computed(() => styleConfig.value.layout !== 'top')
  const showSidebarLogo = computed(() => styleConfig.value.layout === 'side')
  const showHeaderLogo = computed(() => styleConfig.value.layout !== 'side')
  const showFooter = computed(() => styleConfig.value.showFooter)
  const isUseTabsRouter = computed(() => styleConfig.value.isUseTabsRouter)
  const mode = computed(() => {
    if (styleConfig.value.mode === 'auto') {
      const media = window.matchMedia('(prefers-color-scheme:dark)')
      if (media.matches) {
        return 'dark'
      }
      return 'light'
    }
    return styleConfig.value.mode as 'light' | 'dark'
  })

  function changeTheme(payload: IStateType) {
    changeMode(payload)
    changeBrandTheme(payload)
    updateStyleConfig(payload)
  }
  function changeMode(payload: IStateType) {
    let theme = payload.mode
    if (payload.mode === 'auto') {
      const media = window.matchMedia('(prefers-color-scheme:dark)')
      if (media.matches) {
        theme = 'dark'
      } else {
        theme = 'light'
      }
    }
    const isDarkMode = theme === 'dark'

    document.documentElement.setAttribute(
      'theme-mode',
      isDarkMode ? 'dark' : ''
    )
    changeChartColor(isDarkMode ? DARK_CHART_COLORS : LIGHT_CHART_COLORS)
  }

  function changeBrandTheme(payload: IStateType) {
    const { brandTheme, mode } = payload
    const { colors: newPalette, primary: brandColorIndex } =
      Color.getColorGradations({
        colors: [brandTheme],
        step: 10,
        remainInput: false, // 是否保留输入 不保留会矫正不合适的主题色
      })[0]
    const colorMap = generateColorMap(
      brandTheme,
      newPalette,
      mode as 'light' | 'dark',
      brandColorIndex
    )
    insertThemeStylesheet(brandTheme, colorMap, mode as 'light' | 'dark')
    document.documentElement.setAttribute('theme-color', brandTheme)
  }

  return {
    styleConfig,
    showHeader,
    showSidebar,
    showFooter,
    showHeaderLogo,
    showSidebarLogo,
    isUseTabsRouter,
    showSettingPanel,
    mode,
    showSidebarCompact,
    updateStyleConfig,
    toggleSidebarCompact,
    toggleUseTabsRouter,
    addColor,
    changeChartColor,
    toggleSettingPanel,
    changeBrandTheme,
    changeTheme,
    changeMode,
  }
})
