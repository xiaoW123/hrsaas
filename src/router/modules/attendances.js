import Layout from '@/layout'

export default {
  path: '/attendances',
  name: 'attendances',
  component: Layout,
  children:[{
    path: '', // 不写表示默认为/employees
    component: () => import('@/views/attendances'),
    // 路由的元数据/元信息，就是储存数据用的
    meta: {
      title: '考勤',
      icon: 'skill'
    }
  }],
}