import { login, logout, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {},
  staffPhoto: ''
}

const mutations = {
  // 设置token
  SET_TOKEN: (state, token) => {
    state.token = token // 设置state的token
    setToken(token) // 设置浏览器缓存的token
  },
  // 清除token
  REMOVE_TOKEN: (state) => {
    state.token = null
    removeToken()
  },
  // 设置userInfo
  SET_USERINFO: (state, result) => {
    state.userInfo = result // 是响应式，或者{...userInfo}
  },
  // 清空userInfo
  REMOVE_USERINFO: (state) => {
    state.userInfo = {}
  }
}

const actions = {
  // user login
  async login(context, data) {
    const result = await login(data)
    context.commit('SET_TOKEN', result)
    // 在登录成功获取token时，设置token超时所需要的时间戳
    setTimeStamp()
  },

  // get user info
  async getUserInfoAction(context) {
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId)
    const baseResult = { ...result, ...baseInfo } // 合并两个接口返回的数据
    context.commit('SET_USERINFO', baseResult)
    return baseResult // 这里给后期做权限时留伏笔
  },

  // user logout
  logout(context) {
    context.commit('REMOVE_TOKEN') // 删除token
    context.commit('REMOVE_USERINFO')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  // namespaced为true的作用是告诉vuex，该模块所有的state 、getters、mutations、actions里面的东西调用时都需要加上命名空间，这个命名空间就是该模块被improt时命名的名字。
  namespaced: true,
  state,
  mutations,
  actions
}
