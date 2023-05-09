<template>
  <el-dialog width="600px" :title="isTitle" :visible="showDialog" @close="btnCancel">
    <!-- 编辑弹层 -->
    <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roleForm.description" />
      </el-form-item>
    </el-form>

    <!-- 底部 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { updateRole, addRole } from '@/api/setting'

export default {
  name: 'MyDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: true
    },
    roleForm: {
      type: Object,
      default: {
        name: '',
        description: ''
      }
    },
    rules: {
      name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
      description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    btnCancel() {
      // 重置数据
      this.$emit('update:roleForm', { name: '', description: '' })
      // this.roleForm = {
      //   name: '',
      //   description: ''
      // }
      this.$refs.roleForm.resetFields()
      this.$emit('update:showDialog', false)
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // id存在表示编辑
          await updateRole(this.roleForm)
        } else {
          // id不存在表示添加
          await addRole(this.roleForm)
        }
        // 重新渲染
        this.$emit('getRoleList')
        this.$message.success('操作成功')
        this.$emit('update:showDialog', false)
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {
    isTitle() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  }
}
</script>

<style></style>
