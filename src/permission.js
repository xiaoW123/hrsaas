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
        // 为什么写await？因为我们想获取完资料再放行
        await store.dispatch('user/getUserInfoAction')
      }
      next()
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
