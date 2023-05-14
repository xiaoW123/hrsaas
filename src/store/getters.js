const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  name: (state) => state.user.userInfo.username,
  userId: (state) => state.user.userInfo.userId,
  staffPhoto: (state) => state.user.userInfo.staffPhoto,
  companyId: (state) => state.user.userInfo.companyId,
  routes: (state) => state.permission.routes // 导出当前的路由
}
export default getters
