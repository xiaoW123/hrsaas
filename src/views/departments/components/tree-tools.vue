<template>
<div style="width: 100%">
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <!-- 右侧内容 -->
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span> 操作<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit"
                >查看部门部门</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="del"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</div>
  
</template>

<script>
import { delDepartments, addDepartments } from "@/api/departments";

export default {
  data() {
    return {
    }
  },
  methods: {
    operateDepts(type) {
      if (type === "add") {
        // 添加部门,this.treeNode就是当前点击的部门
        this.$emit("addDepts", this.treeNode);
      } else if (type === "edit") {
        // 编辑部门
        this.$message("编辑部门！");
      } else {
        this.$confirm("确定删除吗？", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
            return delDepartments(this.treeNode.id);
          })
          .then(() => {
            // 删除后刷新页面
            this.$emit("delDepts"); // 子传父
            this.$message.success("删除部门成功！");
          });
      }
    },
  },
  props: {
    treeNode: {
      type: Object,
      required: true,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.el-dropdown-menu__item {
  color: red;
}
</style>