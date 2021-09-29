import Layout from '@/layout'

export default {
  path: '/permission',
  name: 'permission',
  component: Layout,
  children:[{
    path: '', // 不写表示默认为/employees
    component: () => import('@/views/permission'),
    // 路由的元数据/元信息，就是储存数据用的
    meta: {
      title: '权限管理',
      icon: 'lock'
    }
  }],
}