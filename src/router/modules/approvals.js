import Layout from '@/layout' // 引入一级路由组件

export default {
  path: '/approvals',
  name: 'approvals',
  component: Layout,
  children: [
    {
      path: '/approvals', // 当这里什么都不写的时候，表示该路由为当前二级路由的默认路由
      component: () => import('@/views/approvals'),
      meta: {
        title: '审批',
        icon: 'tree-table'
      }
    }
  ]
}
