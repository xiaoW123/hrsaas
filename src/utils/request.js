import store from '@/store'
import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600
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
service.interceptors.request.use(request => {
  // 如果token存在 注入token
  if (store.getters.token) {
    if(IsCheckTimeOut()) {
      // true表示过期了
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    request.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return request // 必须返回配置
},error => {
  return Promise.reject(error)
})

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
  if(error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})


// 定义检测时间戳是否超时
function IsCheckTimeOut() {
  var currentTime =  Date.now()
  var timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
