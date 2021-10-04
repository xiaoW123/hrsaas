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
                  <el-button size="small" type="success">分配职权</el-button>
                  <el-button size="small" type="primary">修改</el-button>
                  <el-button size="small" type="danger">删除</el-button>
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
                <el-input disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoleList } from "@/api/setting";

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
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    changePage(newPage) {
      this.page.page = newPage //赋值新页码
      this.getRoleList();
    }
  },
};
</script>

<style>
.el-row {
  margin-top: 30px;
}
</style>