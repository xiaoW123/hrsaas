import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404']
//路由前置守卫
router.beforeEach(async (to, from, netx) => {
  NProgress.start() //开启过度条
  if (store.getters.token) {
    if (to.path === '/login') {
      netx('/')
    } else {
      if(!store.state.user.userInfo.userId) {
        await store.dispatch('user/getUserInfo')
      }
      netx()
    }
  } else {
    if(whiteList.indexOf(to.path) > -1) {
      netx()
    } else {
      netx('/login')
    }
  }
  NProgress.done() //关闭过度条
})

//后置守卫
router.afterEach((to, from, next) => {
  NProgress.done() //关闭过度条
})