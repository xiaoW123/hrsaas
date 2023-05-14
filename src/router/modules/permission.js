import Layout from '@/layout' // 引入一级路由组件

export default {
  path: '/permission',
  name: 'permissions',
  component: Layout,
  children: [
    {
      path: '/permission', // 当这里什么都不写的时候，表示该路由为当前二级路由的默认路由
      component: () => import('@/views/permission'),
      meta: {
        title: '权限管理',
        icon: 'lock'
      }
    }
  ]
}
