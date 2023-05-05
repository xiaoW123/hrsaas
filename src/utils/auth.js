import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
// token超时处理
const timeKey = 'hrsaas-timestamp-key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 设置时间戳
export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now())
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
