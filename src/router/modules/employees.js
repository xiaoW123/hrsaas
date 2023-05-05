import Layout from '@/layout' // 引入一级路由组件

export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '', // 当这里什么都不写的时候，表示该路由为当前二级路由的默认路由
      component: () => import('@/views/employees'),
      meta: {
        title: '员工管理',
        icon: 'people'
      }
    }
  ]
}
