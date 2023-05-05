<template>
  <!-- 弹出层 -->
  <el-dialog :title="showTitle" :visible="showDialog" width="680px" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- 获取焦点是请求数据 -->
        <el-select @focus="getEmployeeSimple" v-model="formData.manager" style="width: 80%" placeholder="请选择">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width: 80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button @click="btnCancel">取 消</el-button>
        <el-button type="primary" @click="btnOK">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, getEmployeeSimple, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'

export default {
  name: 'AddDept',
  data() {
    // 自定义部门名称校验-新增得到部门不能同名
    const checkNameRepeat = async (rule, value, callback) => {
      // value是部门名称,和同级部门下的部门比较,不能一样,但是要先获取最新的组织架构信息,防止别人又新添加了
      // 1.先获取最新数据
      let isRepeat = false
      const { depts } = await getDepartments()
      if (this.formData.id) {
        // 编辑模式
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts.filter((item) => item.id !== this.formData.id && item.pid === this.treeNode.pid).some((item) => item.name === value)
      } else {
        // 添加模式
        // 2.先找到当前id相同的pid(子部门)
        // 3.再检测子部门的名字与添加的名字是否相等
        isRepeat = depts.filter((item) => item.pid === this.treeNode.id).some((item) => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 自定义部门code校验-code不能相同
    const checkCodeRepeat = async (rule, value, callback) => {
      let isRepeat = false
      const { depts } = await getDepartments()
      if (this.formData.id) {
        // 编辑，因为编辑模式下 不能算自己
        isRepeat = depts.some((item) => item.id !== this.formData.id && item.code === value && value)
      } else {
        // 添加模式
        // code不为空
        isRepeat = depts.some((item) => item.code === value && value)
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkNameRepeat
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }
        ]
      },
      // 简单员工列表
      peoples: []
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  methods: {
    btnOK() {
      this.$refs.deptForm.validate(async (valid) => {
        if (valid) {
          // 区分是编辑还是添加
          if (this.formData.id) {
            // 编辑模式  调用编辑接口
            await updateDepartments(this.formData)
          } else {
            // 校验通过
            // 因为是添加子部门,所以把新增的部门的pid设置为当前部门的id
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 让父组件关闭弹窗
          this.$emit('update:showDialog', false)
          // 添加完后重新渲染
          this.$emit('addDeptss')
          this.$message({
            type: 'success',
            message: '删除部门成功!'
          })
        }
      })
    },
    btnCancel() {
      // 重置数据，因为之前加了id
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      // 清除之前的校验  可以重置数据 只能重置 定义在data中的数据
      this.$refs.deptForm.resetFields()
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      console.log(this.formData)
      console.log(this.treeNode)
    }
  },
  computed: {
    showTitle() {
      // 因为原先的formData是没有定义id属性的，当我们点击编辑时，调用了根据id获取部门详细的方法，把信息赋值给了formdata就有了id
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  }
}
</script>

<style></style>
