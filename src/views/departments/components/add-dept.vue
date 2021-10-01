<template>
  <el-dialog
    title="新增部门"
    :visible="showDialog"
    style="min-width: 800px"
    :before-close="handleClose"
  >
    <el-form label-width="100px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input style="width: 80%" placeholder="1-50个字符" v-model="formData.name"/>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input style="width: 80%" placeholder="1-50个字符" v-model="formData.code"/>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select style="width: 80%" placeholder="请选择" v-model="formData.manager"/>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="showDialog = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getDepartments} from "@/api/departments"

export default {
  data() {
    // 自定义效证 检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      // 找到同级部门的所有子部门，然后some进行判断返回true/false
      const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      isRepeat ? callback(new Error(`同级部门下已经存在${value}这个部门了`)) : callback()
    }
    // 自定义效证 编码唯一
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      const isRepeat = depts.some(item => item.code === value && value != "")
      isRepeat ? callback(new Error(`${value}已经存在`)) : callback()
    }
    return {
      //   labelPosition: 'top'
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur"
          },
          { 
            
            trigger: "blur",
            validator: checkNameRepeat
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkCodeRepeat
          }
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            trigger: "blur",
            min: 1,
            max: 300,
            message: "部门介绍要求1-50个字符",
          },
        ],
      },
    };
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default:null
    }
  },
  methods: {
    // ×关闭
    handleClose() {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.$emit('addDepts1')
        })
        .catch(_ => {

        });
    },
  },
};
</script>

<style>
</style>