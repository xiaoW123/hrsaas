import Cookies from 'js-cookie'

// 通过工具自动设定一个独一无二的token  key
const TokenKey = 'hrsaas-ihrm-token' 
// 时间戳
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

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
// 读取时间戳
export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}