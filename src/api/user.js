// 引入axios的封装
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export function getUserDetailById(id) {
  return request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
}
