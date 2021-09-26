import {getToken, setToken, removeToken, setTimeStamp} from '@/utils/auth'
import { login, getUserInfo, getUserDetailBuId} from '@/api/user'

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
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token 
    // 拿到token说明登陆成功
    setTimeStamp() // 设置时间戳
  },
  async getUserInfo (context) {
    // 获取返回值
    const result = await getUserInfo()  
    // 获取用户详情数据
    const baseInfo = await getUserDetailBuId(result.userId)
    // 合并两个接口数据
    const baseResult = {...result, ...baseInfo}
    // 将整个的个人信息设置到用户的vuex数据中
    context.commit('setUserInfo', baseResult) 
    return baseResult // 这里为什么要返回 为后面埋下伏笔
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('reomveUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

