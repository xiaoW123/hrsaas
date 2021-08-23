import request from '@/utils/request'

// 封装登录接口
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data // 传入请求参数data
  })
}

export function getInfo(token) {

}

export function logout() {

}
