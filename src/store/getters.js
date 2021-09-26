const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  staffPhoto: state => state.user.userInfo.staffPhoto // 建立用户头像的映射
}
export default getters
