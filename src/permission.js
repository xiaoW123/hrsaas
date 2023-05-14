// permission.js专门用来处理路由权限
// 权限拦截在路由跳转中做  导航守卫
import router from '@/router'
import store from '@/store'
// import nprogress from 'nprogress' // 进度条插件
// import 'nprogress/nprogress.css'
const whiteList = ['/login', '/404']
// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  // nprogress.start() // 开启进度条
  // 如果token存在
  if (store.getters.token) {
    // 如果to的路径为登录页面，就直接跳转到首页
    if (to.path === '/login') {
      next('/')
    } else {
      // 直接放行
      // 有token但不为登录页时获取用户资料
      if (!store.getters.userId) {
        // 为什么写await？因为我们想获取完资料再放行,
        // 结构出拥有的权限
        const { roles } = await store.dispatch('user/getUserInfoAction')
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // addRoutes  必须 用 next(地址) 不能用next()
        // 因为404页面必须放在所有路由的最后,包括动态路由
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加到路由表
        next(to.path)
      } else {
        next()
      }
    }
    // 如果没有token
  } else {
    // 如果不在白名单中
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  // nprogress.done() // 关闭进度进度条，防止手动切换路径是出现错误
})
// 路由后置守卫
router.afterEach((to, from, next) => {
  // nprogress.done() // 关闭进度进度条
})
