<template>
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    style="min-width: 800px"
    @close="btnCancle"
  >
    <el-form
      label-width="100px"
      :model="formData"
      :rules="rules"
      ref="deptForm"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- 获取焦点时 -->
        <el-select
          @focus="getEmployeeSimple"
          style="width: 80%"
          placeholder="请选择"
          v-model="formData.manager"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
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
      <el-button @click="btnCancle">取 消</el-button>
      <el-button type="primary" @click="btnOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";

import { getEmployeeSimple } from "@/api/employees";

export default {
  data() {
    // 自定义效证 检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      let isRepeat = false
      const { depts } = await getDepartments();
      // 找到同级部门的所有子部门，然后some进行判断返回true/false
      // 有id就是新增校验，无id就是编辑校验
      if (this.formData.id) {
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.id === this.treeNode.pid).some(item => item.name === value)
      } else {
        isRepeat = depts.filter((item) => item.pid === this.treeNode.id).some(item => item.name === value);
      }
      isRepeat ? callback(new Error(`同级部门下已经存在${value}这个部门了`)) : callback();
    };

    // 自定义效证 编码唯一
    const checkCodeRepeat = async (rule, value, callback) => {
      let isRepeat = false
      const { depts } = await getDepartments();
      if (this.formData.id) {
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        isRepeat = depts.some((item) => item.code === value && value != "");
      }
      isRepeat ? callback(new Error(`${value}已经存在`)) : callback();
    };
    return {
      // labelPosition: 'top'
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
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkNameRepeat,
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
          },
          {
            trigger: "blur",
            validator: checkCodeRepeat,
          },
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
      peoples: [],
    };
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: null,
    },
  },
  methods: {
    // 获取简单员工列表数据
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple();
    },
    // 确认提交表单
    btnOk() {
      this.$refs.deptForm.validate(async (isOK) => {
        if (isOK) {
          if (this.formData.id) {
            // 有id编辑，不能用相同的校验规则
            await updateDepartments(this.formData);
          } else {
            // 无id新增
            await addDepartments({ ...this.formData, pid: this.treeNode.id }); // 调用新增接口 添加父部门的id
          }
          this.$emit("addDepts");
          // 改变父组键的值，使用 sync
          // 关闭对话框
          this.$emit("update:showDialog", false);
        }
      });
    },
    // 取消清除表单
    btnCancle() {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      // 关闭弹层
      this.$refs.deptForm.resetFields();
      this.$emit("update:showDialog", false);
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
    },
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增子部门";
    },
  },
};
</script>

<style>
</style>