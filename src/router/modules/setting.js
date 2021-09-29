import Layout from '@/layout'

export default {
  path: '/setting',
  name: 'setting',
  component: Layout,
  children:[{
    path: '', // 不写表示默认为/employees
    component: () => import('@/views/setting'),
    // 路由的元数据/元信息，就是储存数据用的
    meta: {
      title: '公司设置',
      icon: 'setting'
    }
  }],
}