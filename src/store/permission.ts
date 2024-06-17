import { resetRouter, asyncRouterList } from '@/router'

function filterPermissionsRouters(routes, roles) {
  const res = []
  routes.forEach(route => {
    const children = []
    route.children?.forEach(childRouter => {
      const roleCode = childRouter.meta?.roleCode || childRouter.name
      if (roles.indexOf(roleCode) !== -1) {
        children.push(childRouter)
      }
    })
    if (children.length > 0) {
      route.children = children
      res.push(route)
    }
  })
  return res
}

export const usePermissionStore = defineStore('permission', () => {
  const whiteListRouters = ref(['/login'])
  const routers = ref<any[]>([])

  function setRouters(payload) {
    routers.value = payload
  }

  function initRoutes(roles) {
    let accessedRouters

    // // special token
    if (roles.includes('ALL_ROUTERS')) {
      accessedRouters = asyncRouterList
    } else {
      accessedRouters = filterPermissionsRouters(asyncRouterList, roles)
    }
    setRouters(accessedRouters)
    // register routers
    // router.addRoutes(state.routers);
    console.log('usePermission', routers.value)
  }

  async function restore() {
    // remove routers
    resetRouter()
    setRouters([])
  }

  return {
    whiteListRouters,
    routers,
    setRouters,
    initRoutes,
    restore,
  }
})
