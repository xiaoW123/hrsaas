<template>
  <el-dialog :visible="showDialog" title="新增员工" class="dialog" @close="">
    <el-form label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 80%"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 80%"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 80%"
          placeholder="请选择入职时间"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="聘用方式" prop="formOfEmployment">
        <el-input
          v-model="formData.formOfEmployment"
          style="width: 80%"
          placeholder="请选择"
        ></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 80%"
          placeholder="请输入工号"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          @focus="getDepartments"
          v-model="formData.departmentName"
          style="width: 80%"
          placeholder="请输入部门"
        ></el-input>
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          :props="{ label: 'name' }"
          :default-expand-all="true"
        ></el-tree>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 80%"
          placeholder="请选择转正时间"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <template>
      <el-row type="flex" justify="center" align="center">
        <el-col :span="6">
          <el-button>取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
      treeData: [],
      showTree: false,
      loading: false,
    };
  },
  methods: {
    async getDepartments() {
      this.showTree = true;
      this.loading = true
      const { depts } = await getDepartments();
      this.treeData = tranListToTreeData(depts, "");
      this.loading = false
    },
  },
};
</script>

<style>
.dialog {
  min-width: 1350px;
}
</style>