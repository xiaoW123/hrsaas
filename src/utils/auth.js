import Cookies from 'js-cookie'

// 通过工具自动设定一个独一无二的token  key
const TokenKey = 'hrsaas-ihrm-token' 

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
