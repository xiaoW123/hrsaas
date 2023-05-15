import Layout from '@/layout' // 引入一级路由组件

export default {
  path: '/settings',
  name: 'settings',
  component: Layout,
  children: [
    {
      path: '/setting', // 当这里什么都不写的时候，表示该路由为当前二级路由的默认路由
      component: () => import('@/views/setting'),
      name: 'settings',
      meta: {
        title: '公司设置',
        icon: 'setting'
      }
    }
  ]
}
