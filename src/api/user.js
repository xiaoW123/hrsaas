import request from '@/utils/request'

// 封装登录接口
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data // 传入请求参数data
  })
}
// 获取用户资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export function getUserDetailBuId(id) {
  return request({
    url: `/sys/user/${id}`
  })
} 
export function getInfo(token) {

}

export function logout() {

}
