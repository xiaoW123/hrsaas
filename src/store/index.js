import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 设置Vuex的模块化
  modules: {
    app,
    settings,
    user
  },
  getters
})

export default store
