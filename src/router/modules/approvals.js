import Layout from '@/layout'

export default {
  path: '/approvals',
  name: 'approvals',
  component: Layout,
  children:[{
    path: '', // 不写表示默认为/employees
    component: () => import('@/views/approvals'),
    // 路由的元数据/元信息，就是储存数据用的
    meta: {
      title: '审批',
      icon: 'tree-table'
    }
  }],
}