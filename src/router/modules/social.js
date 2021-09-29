import Layout from '@/layout'

export default {
  path: '/social',
  name: 'social',
  component: Layout,
  children:[{
    path: '', // 不写表示默认为/employees
    component: () => import('@/views/social'),
    // 路由的元数据/元信息，就是储存数据用的
    meta: {
      title: '社保',
      icon: 'table'
    }
  }],
}