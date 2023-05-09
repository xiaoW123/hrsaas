<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 卡片区域 -->
      <el-card class="tree-card" v-loading="loading">
        <tree-tools class="line_one" :isRoot="true" :tree-node="company" @addDepts="addDepts" />
        <!-- 树形组件 -->

        <el-tree default-expand-all :data="departs" :props="defaultProps" @node-click="handleNodeClick">
          <!-- 插槽内容会循环多次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据,进行了解构， slot-scope="obj"-->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <!-- 把解构出来的data传给该组件 -->
          <tree-tools @editDepts="editDepts" @addDepts="addDepts" @delDepts="getDepartments" slot-scope="{ data }" :tree-node="data" />
        </el-tree>
        <!-- 弹窗 -->
        <add-dept ref="addDept" @addDeptss="getDepartments" :show-dialog.sync="showDialog" :tree-node="node"></add-dept>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from '@/components/TreeTools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDept from './compoents/AddDept'

export default {
  components: { TreeTools, AddDept },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' },
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      // 控制弹窗
      showDialog: false,
      node: {},
      loading: false
    }
  },
  created() {
    // 获取组织架构数据
    this.getDepartments()
  },
  methods: {
    handleNodeClick() {},
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '')
      this.loading = false
    },
    // 控制添加部门弹窗
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    // 控制编辑弹窗
    editDepts(node) {
      this.showDialog = true
      console.log(node)
      this.node = node

      // 调用子组件的函数
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.line_one {
  padding-bottom: 10px;
  border-bottom: 1px solid #f3f3f3;
  margin-bottom: 10px;
}
</style>
