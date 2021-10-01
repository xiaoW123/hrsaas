<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构 -->
      <el-card>
        <!-- 放置内容 -->
        <tree-tools :treeNode="company" :isRoot="true" @addDepts="addDepts"></tree-tools>
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 树组件 -->
          <tree-tools slot-scope="{ data }" :treeNode="data" @delDepts="getDepartments" @addDepts="addDepts"></tree-tools>
        </el-tree>
      </el-card>
    </div>
    <!-- 新增部门对话框 -->
    <add-dept :showDialog="showDialog" @addDepts1="addDepts1" :treeNode="node"></add-dept>
  </div>
</template>

<script>
import treeTools from "./components/tree-tools.vue";
import { getDepartments } from "@/api/departments"
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue';
// import request from '@/utils/request'

export default {
  components: { treeTools, AddDept },
  data() {
    return {
      company: {},
      defaultProps: {
        label: "name",
        children: "children",
      },
      departs: [],
      showDialog: false,
      node: null
    };
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      console.log(result)
      this.company = {name: result.companyName, manager: "负责人", id:""}
      this.departs = tranListToTreeData(result.depts, '')  // 需要将数组转换成树形结构，封装一个工具（递归算法）
      // console.log(this.departs)
    }, 
    // getDepartments() {
    //   request({
    //     url: '/company/department'
    //   }).then((result) => {
    //     console.log(result)
    //   }).catch((err) => {
    //     console.log(err)
    //   });
    // }
    addDepts(node) {
      this.showDialog = true
      // node就是当前点击的部门
      this.node = node
    },
    addDepts1() {
      this.showDialog = false
    }
  }

};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}


</style>