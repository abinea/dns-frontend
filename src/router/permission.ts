import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import { router } from '@/router'
import { useUserStore, usePermissionStore } from '@/store'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  NProgress.start()

  console.log(userStore.userInfo)

  if (userStore.token) {
    if (to.path === '/login') {
      setTimeout(() => {
        userStore.logout()
        permissionStore.restore()
      })
      next()
      return
    }

    const roles = userStore.userInfo.roles
    if (roles && roles.length > 0) {
      next()
    } else {
      try {
        await userStore.getUserInfo()
        permissionStore.initRoutes(userStore.userInfo.roles)
        next({ ...to })
      } catch (error) {
        userStore.removeToken()
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    /* white list router */
    const whiteList = permissionStore.whiteListRouters
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})
