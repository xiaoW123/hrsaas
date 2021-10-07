<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 公司设置  -->
      <el-card class="el-card">
        <el-tabs>
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理">
            <el-row>
              <!-- 新增按钮 -->
              <el-button
                class=""
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <el-row>
              <!-- 内容 -->
              <el-table :data="list" style="width: 100%" border>
                <el-table-column
                  align="center"
                  type="index"
                  label="序号"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="name"
                  label="角色名"
                  width="240"
                >
                </el-table-column>
                <el-table-column align="center" prop="description" label="描述">
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="data">
                    <el-button size="small" type="success">分配职权</el-button>
                    <el-button
                      size="small"
                      type="primary"
                      @click="editRole(data.row.id)"
                      >修改</el-button
                    >
                    <el-button
                      size="small"
                      type="danger"
                      @click="deleteRole(data.row.id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <el-row
                type="flex"
                justify="center"
                align="middle"
                style="height: 60px"
              >
                <el-pagination
                  @current-change="changePage"
                  :page-size="page.pagesize"
                  :total="page.total"
                  :current-page="page.page"
                  layout="prev, pager, next"
                >
                </el-pagination>
              </el-row>
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                  v-model="formData.remarks"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <!-- 编辑弹层 -->
        <el-dialog title="编辑角色" :visible.sync="showDialog" @close="btnCancel">
          <el-form
            :model="roleForm"
            :rules="rules"
            ref="roleForm"
            label-width="120px"
          >
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.description"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="btnCancel">取 消</el-button>
            <el-button type="primary" @click="btnOK"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  updateRole,
  getRoleDetail,
  addRole
} from "@/api/setting";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      // 角色列表数据
      list: [],
      page: {
        page: 1, //页码
        pagesize: 10, // 每页条数
        total: 0, //记录总条数
      },
      formData: {},
      showDialog: false, // 弹窗
      roleForm: {},
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  methods: {
    // 获取角色信息
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    // 获取企业信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
      console.log(this.formData);
    },
    changePage(newPage) {
      this.page.page = newPage; //赋值新页码
      this.getRoleList();
    },
    // 删除角色
    async deleteRole(id) {
      try {
        await this.$confirm("确定删除该角色吗？", {confirmButtonText: '确定',cancelButtonText: '取消',});
        await deleteRole(id);
        this.getRoleList();
        this.$message.success("删除成功！");
      } catch (error) {
        console.log(error);
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id);
      this.showDialog = true;
    },
    btnCancel() {
      // 关闭清空表单数据
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false;
    },
    async btnOK() {
      await this.$refs.roleForm.validate()
      // 如果id存在就是编辑，没有id就是新增
      try {
        if (this.roleForm.id) {
          // 编辑
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }
        this.getRoleList()
        this.$message.success('操作成功！')
        this.showDialog = false
      } catch(error) {
        console.log(error)
      }
      
    }
  },
};
</script>

<style>
.el-row {
  margin-top: 30px;
}
</style>