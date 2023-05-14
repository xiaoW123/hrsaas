import { AsyncRoutes, constantRoutes } from '@/router'

const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  SET_ROUTES(state, newRoutes) {
    // 这样写是错误的，这样都是每次在新的静态路由上添加
    // state.routes = [...state.routes, ...newRoutes]
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所拥有的菜单权限
  // menus: ["settings","permissions"]
  // asyncRoutes是所有的动态路由
  // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach((key) => {
      routes.push(...AsyncRoutes.filter((item) => item.name === key))
    })
    context.commit('SET_ROUTES', routes)
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
