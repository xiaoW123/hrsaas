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

  // user logout,登出路由
  logout(context) {
    context.commit('REMOVE_TOKEN') // 删除token
    context.commit('REMOVE_USERINFO')
    resetRouter()
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
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
