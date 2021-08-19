import axios from 'axios'
// create an axios instance
const service = axios.create({
  // 这里的process.env就是Nodejs提供的一个API，它返回一个包含用户环境信息的对象
  // VUE_APP_BASE_API是.env.production(生产)和.env.development(开发)的对应的接口环境变量
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 定义5秒超时
})

// request interceptor //请求拦截
service.interceptors.request.use()

// response interceptor //响应拦截
service.interceptors.response.use()

export default service
