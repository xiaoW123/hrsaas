import Layout from '@/layout' // 引入一级路由组件

export default {
  path: '/departments',
  name: 'departments',
  component: Layout,
  children: [
    {
      path: '/departments', // 当这里什么都不写的时候，表示该路由为当前二级路由的默认路由
      component: () => import('@/views/departments'),
      meta: {
        title: '组织架构',
        icon: 'tree'
      }
    }
  ]
}
