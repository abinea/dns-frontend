import type { RouteRecordName } from 'vue-router'

export type TRouterInfo = {
  path: string
  routeIdx?: number
  title?: string
  name?: RouteRecordName
  isAlive?: boolean
  isHome?: boolean
}

export type TTabRouterType = {
  tabRouterList: TRouterInfo[]
}

const homeRoute: TRouterInfo[] = [
  {
    path: '/',
    routeIdx: 0,
    title: '仪表盘',
    name: 'DashboardBase',
    isHome: true,
  },
]

export const useTabRouterStore = defineStore('tab-router', () => {
  const tabRouterList = ref<TRouterInfo[]>(homeRoute)
  const isRefreshing = ref(false)

  const toggleTabRouterAlive = (routeIdx: number) => {
    isRefreshing.value = !isRefreshing.value
    tabRouterList.value[routeIdx].isAlive =
      !tabRouterList.value[routeIdx].isAlive
  }

  const appendTabRouterList = (newRoute: TRouterInfo) => {
    if (
      !tabRouterList.value.find(
        (route: TRouterInfo) => route.path === newRoute.path
      )
    ) {
      tabRouterList.value = tabRouterList.value.concat({
        ...newRoute,
        isAlive: true,
      })
    }
  }

  const subtractCurrentTabRouter = (newRoute: TRouterInfo) => {
    const { routeIdx } = newRoute
    tabRouterList.value = [
      ...tabRouterList.value.slice(0, routeIdx),
      ...tabRouterList.value.slice(routeIdx + 1),
    ]
  }

  const subtractTabRouterBehind = (newRoute: TRouterInfo) => {
    const { routeIdx } = newRoute
    tabRouterList.value = tabRouterList.value.slice(0, routeIdx + 1)
  }

  const subtractTabRouterAhead = (newRoute: TRouterInfo) => {
    const { routeIdx } = newRoute
    tabRouterList.value = [...homeRoute, ...tabRouterList.value.slice(routeIdx)]
  }

  const subtractTabRouterOther = (newRoute: TRouterInfo) => {
    const { routeIdx } = newRoute
    tabRouterList.value = [...homeRoute, tabRouterList.value[routeIdx]]
  }

  const removeTabRouterList = () => {
    tabRouterList.value = []
  }

  const initTabRouterList = (newRoute: TRouterInfo[]) => {
    tabRouterList.value = newRoute
  }

  return {
    tabRouterList,
    isRefreshing,
    toggleTabRouterAlive,
    appendTabRouterList,
    subtractCurrentTabRouter,
    subtractTabRouterBehind,
    subtractTabRouterAhead,
    subtractTabRouterOther,
    removeTabRouterList,
    initTabRouterList,
  }
})
