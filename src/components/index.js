// 负责注册全局组件
import PageTools from './PageTools/PageTools.vue'

export default {
    install(Vue) {
        Vue.component('PageTools',PageTools)
    }
}
