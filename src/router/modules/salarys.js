import Layout from '@/layout'

export default {
  path: '/salarys',
  name: 'salarys',
  component: Layout,
  children:[{
    path: '', // 不写表示默认为/employees
    component: () => import('@/views/salarys'),
    // 路由的元数据/元信息，就是储存数据用的
    meta: {
      title: '工资',
      icon: 'money'
    }
  }],
}