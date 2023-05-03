// axios 封装
import axios from 'axios'
import store from '@/store'

// 当我们的本地的请求 有/api的时候，就会代理我们的请求地址向另外一个服务器发出请求
const VUE_APP_BASE_API = '/api'
const service = axios.create({
  baseURL: VUE_APP_BASE_API,
  timeout: 5000
})
service.interceptors.request.use(
  (config) => {
    // 注入携带token
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
      console.log(config.headers['Authorization'])
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  (res) => {
    const { success, message, data } = res.data
    if (success) {
      return data
    } else {
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
