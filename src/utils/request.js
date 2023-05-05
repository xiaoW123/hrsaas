// axios 封装
import axios from 'axios'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import { Message } from 'element-ui'
import router from '@/router'
const TimeOut = 3600

// 当我们的本地的请求 有/api的时候，就会代理我们的请求地址向另外一个服务器发出请求
// const VUE_APP_BASE_API = '/api'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
service.interceptors.request.use(
  (config) => {
    // 注入携带token
    if (store.getters.token) {
      // 当token存在的时间大于设置的3600秒时，为超时
      // 清除token，并登出
      if (isCheckTimeout()) {
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('token超时了'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  (res) => {
    // return res
    const { success, message, data } = res.data
    if (success) {
      return data
    } else {
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    // 在响应拦截的错误信息中设置token超时的被动介入
    if (error.response && error.response.data && error.response.data.code === 10002) {
      store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error.message) // 提示错误信息
    }
    return Promise.reject(error)
  }
)

function isCheckTimeout() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
