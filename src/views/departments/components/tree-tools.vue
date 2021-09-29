<template>
  <el-row
          type="flex"
          justify="space-between"
          align="middle"
          style="height: 40px; width:100%"
        >
          <el-col>
            <!-- 左侧内容 -->
            <span>{{treeNode.name}}</span>
          </el-col>
          <el-col :span="4">
            <!-- 右侧内容 -->
            <el-row type="flex" justify="end">
              <el-col>{{treeNode.manager}}</el-col>
              <el-col>
                <el-dropdown>
                  <span>
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                    <el-dropdown-item v-if="!isRoot">查看部门部门</el-dropdown-item>
                    <el-dropdown-item v-if="!isRoot">删除部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
</template>

<script>
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.el-dropdown-menu__item {
  color: red;
}
</style>