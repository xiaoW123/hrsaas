import Layout from '@/layout'

export default {
  path: '/departments',
  name: 'departments',
  component: Layout,
  children:[{
    path: '', // 不写表示默认为/employees
    component: () => import('@/views/departments'),
    // 路由的元数据/元信息，就是储存数据用的
    meta: {
      title: '组织架构',
      icon: 'tree'
    }
  }],
}