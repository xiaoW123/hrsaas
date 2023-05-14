<!-- 分配角色 -->
<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnColse">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnColse">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { getRoleList } from '@/api/setting'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户id，用来查询当前用户的角色
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 所有角色列表
      roleIds: [] // 赋值本用户的角色
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    //  获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    // 确定
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
    },
    // 取消
    btnColse() {
      // 就是没有提交选中的,就要清空
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style></style>
