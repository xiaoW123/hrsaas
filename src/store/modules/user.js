import {getToken, setToken, removeToken} from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'

const state = {
  // 读取token
  token: getToken(),
  userInfo: {}
}
const mutations = {
  // 写入token
  setToken(state, token) {
    // 修改state中的token
    state.token = token 
    //替换原来缓存的 token 同步
    setToken(token)  
  },
  // 删除token
  removeToken(state) {
    // 将vuex的token 清空
    state.token = null 
    // 将Cookies的token 清空同步
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo }
  },
  reomveUserInfo(state) {
    state.userInfo = {}
  } 
}
const actions = {
  async login(context, data) {
    const result = await login(data)
    context.commit('setToken', result)
  },
  async getUserInfo (context) {
    const result = await getUserInfo()  // 获取返回值
    context.commit('setUserInfo', result) // 将整个的个人信息设置到用户的vuex数据中
    return result // 这里为什么要返回 为后面埋下伏笔
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

