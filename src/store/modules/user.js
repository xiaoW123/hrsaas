import {getToken, setToken, removeToken} from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  // 读取token
  token: getToken() 
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
  }
}
const actions = {
  async login(context, data) {
    const result = await login(data)
    if(result.data.success) {
      context.commit('setToken', result.data.data)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

