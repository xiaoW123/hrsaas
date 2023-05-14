<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col :class="{ fontStyle: isRoot }">
      <i v-if="!isRoot" class="el-icon-s-custom"></i>
      <i v-else class="el-icon-s-home"></i>
      {{ treeNode.name }}</el-col
    >
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <!-- 下拉菜单 -->
        <el-col type="flex" justify="end">
          <el-dropdown @command="operateDepts">
            <span class="el-dropdown-link"> 操作<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="false" command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item command="edit" v-if="!isRoot">编辑部门</el-dropdown-item>
              <el-dropdown-item command="del" v-if="!isRoot">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'

export default {
  name: 'TreeTools',
  data() {
    return {
      dialogVisible: false
    }
  },
  props: {
    title: {
      type: String
    },
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // 添加部门操作
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // 编辑部门操作
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除部门操作
        this.$confirm('您确定要删除该组织部门吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            // 到这里时说明点了确定
            console.log(this.treeNode.id)
            delDepartments(this.treeNode.id).then(() => {
              this.$emit('delDepts') // 子传父，调用父组件的函数，重新渲染数据
              this.$message({
                type: 'success',
                message: '删除部门成功!'
              })
            })
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fontStyle {
  font-weight: 600;
}
.el-dropdown-menu__item {
  color: #40aaff;
}
</style>
>
