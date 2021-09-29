// 员工的路由规则
import Layout from '@/layout'

export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children:[{
    path: '', // 不写表示默认为/employees
    component: () => import('@/views/employees'),
    // 路由的元数据/元信息，就是储存数据用的
    meta: {
      title: '员工管理',
      icon: 'people'
    }
  }],
}