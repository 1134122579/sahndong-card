let admin_token = 'token'
let userauth = 'userIfo'
// 设置token
export function setToken(token) {
  localStorage.setItem(admin_token, token)
}
// 获取token
export function getToken() {
  return localStorage.getItem(admin_token)
}
// 删除token
export function removeToken() {
  localStorage.removeItem(admin_token)
}

// 设置用户权限
export function setUserAuth(data) {
  sessionStorage.setItem(userauth, data)
}
// 获取用户信息
export function getUserAuth() {
  return sessionStorage.getItem(userauth)
}

