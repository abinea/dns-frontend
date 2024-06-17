import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/index.vue'

// const ipRoutes = [
//   {
//     path: '',
//     name: 'IpVisualize',
//     meta: { title: 'IP信息展示', icon: LocationIcon },
//     children: [
//       {
//         // 大屏地图
//         path: 'visual-map',
//         name: 'VisualMap',
//         meta: { title: '大屏地图' },
//         component: () => import('@/views/menus/visual-map.vue'),
//       },
//       // {
//       //   // IP关联图谱
//       //   path: '/visualIpInfo',
//       //   name: 'VisualIpInfo',
//       //   component: VisualIpInfo,
//       // },
//     ],
//   },
// ]

export const asyncRouterList = [
  // {
  //   // 实时检测
  //   path: 'detect-sniffer',
  //   name: 'DetectSniffer',
  //   meta: { title: '实时检测', icon: StarIcon },
  //   component: () => import('@/views/menus/detect-sniffer.vue'),
  // },
  {
    // 定时检测
    path: '/timer-detect-sniffer',
    name: 'TimerDetectSniffer',
    meta: { title: '定时检测', icon: 'alarm' },
    component: () => import('@/views/menus/timer-detect-sniffer.vue'),
  },
  {
    // 当天可视化
    path: '/visual-day',
    name: 'VisualDay',
    meta: { title: '可视化', icon: 'chart-bar' },
    component: () => import('@/views/menus/visualize.vue'),
  },

  {
    path: '/visual-map',
    name: 'IpVisualize',
    meta: { title: 'IP信息展示', icon: 'location' },
    component: () => import('@/views/menus/visual-map.vue'),
  },
  {
    path: '/visual-week',
    name: 'VisualWeek',
    meta: { title: '过去一周数据', icon: 'layers' },
    component: () => import('@/views/menus/visual-sniffer.vue'),
  },
  {
    // 修改密码
    path: '/user-profile',
    name: 'ChangePwd',
    meta: { title: '修改密码', icon: 'user-password' },
    component: () => import('@/views/menus/user-profile.vue'),
  },
  //   {
  //     //用户管理
  //     path: '/userManagement',
  //     name: 'UserManagement',
  //     component: UserManagement
  //   },

  // {
  //   // 查找历史数据
  //   path: '/searchHistory',
  //   name: 'SearchHistory',
  //   component: SearchHistory,
  // },
]

const routes: RouteRecordRaw[] = [
  {
    // 登录页
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login-page/index.vue'),
  },
  // {
  //   path: '/:catchAll(.*)',
  //   redirect: '/dashboard/base',
  // },
  {
    // 主页
    path: '/',
    // path: '/main/:name',
    name: 'Main',
    component: Layout,
    redirect: '/timer-detect-sniffer',
    children: asyncRouterList,
  },
  // {
  //   // 重定向
  //   path: '/goMain',
  //   // path: '/goMain/:name',
  //   redirect: '/main'
  //   // redirect: '/main/:name'
  // },
  // {
  //   // 404
  //   path: '*',
  //   component: NotFound,
  // },
]

const initRouter = () =>
  createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
      return { left: 0, top: 0 }
    },
  })
export const router = initRouter()

export function resetRouter() {
  const newRouter = initRouter()
  // router.matcher = newRouter.matcher // reset router
}

export const navigateTo = (path: string) => router.push(path)
