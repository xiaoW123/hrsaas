import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  // 这里的process.env就是Nodejs提供的一个API，它返回一个包含用户环境信息的对象
  // VUE_APP_BASE_API是.env.production(生产)和.env.development(开发)的对应的接口环境变量
  // 当我们使用 npm run dev时调用的是.env.development(开发)的对应的接口环境变量
  // 当我们使用 npm run buil时调用的是.env.production(生产)的对应的接口环境变量
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 定义5秒超时
})

// request interceptor //请求拦截
service.interceptors.request.use()

// response interceptor //响应拦截
service.interceptors.response.use(response => {
  const {success, message, data} = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    // Promise.reject 跳过promise的执行链
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})

export default service
