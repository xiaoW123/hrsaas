import Layout from '@/layout' // 引入一级路由组件

export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '/employees', // 当这里什么都不写的时候，表示该路由为当前二级路由的默认路由
      component: () => import('@/views/employees'),
      name: 'employees',
      meta: {
        title: '员工管理',
        icon: 'people'
      }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/employees/components/Detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    },
    {
      path: 'print/:id',
      component: () => import('@/views/employees/components/Print'),
      hidden: true,
      meta: {
        title: '打印',
        icon: 'people'
      }
    }
  ]
}
