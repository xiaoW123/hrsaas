import axios from 'axios'
// create an axios instance
const service = axios.create()

// request interceptor //请求拦截
service.interceptors.request.use()

// response interceptor //响应拦截
service.interceptors.response.use()

export default service
