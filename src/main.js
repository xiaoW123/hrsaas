import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import checkPermission from '@/mixin/checkPermission'
import i18n from '@/lang'

// 自定义指令注册(所有)
import * as directives from '@/directives'
Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key])
})
// 全局注册时间格式化工具
import * as filters from '@/filters'
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

import Print from 'vue-print-nb'
Vue.use(Print)

Vue.mixin(checkPermission)
// 引如全局注册的组件
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
import component from '@/components'
Vue.use(component)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: (h) => h(App)
})
