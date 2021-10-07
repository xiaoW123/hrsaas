<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :showBefore="true">
        <span slot="before">共166条记录</span>
        <template slot="after">
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </page-tools>
      <el-card>
        <el-table v-loading="loading" :data="list" border>
          <el-table-column
            label="序号"
            type="index"
            sortable=""
          ></el-table-column>
          <el-table-column
            label="姓名"
            prop="username"
            sortable=""
          ></el-table-column>
          <el-table-column
            label="工号"
            prop="workNumber"
            sortable=""
          ></el-table-column>
          <el-table-column
            label="聘用形式"
            :formatter="formatEmployment"
            prop="formOfEmployment"
            sortable=""
          ></el-table-column>
          <el-table-column
            label="部门"
            prop="departmentName"
            sortable=""
          ></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
            <!-- <template slot-scope="obj"></template> -->
            <template v-slot="{ row }">
              <!-- 时间格式化 -->
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable="">
            <template v-slot="{row}">
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" width="250">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
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
            layout="prev, pager, next"
            :current-page="page.page"
            :total="page.total"
            :page-size="page.size"
            @current-change="changePage"
          ></el-pagination>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees";
// 格式化聘用形式

export default {
  data() {
    return {
      list: [],
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0,
      },
      loading: false, // 显示遮罩层
    };
  },
  components: {},
  created() {
    this.getEmployeeList();
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeList();
    },
    async getEmployeeList() {
      this.loading = true;
      const { total, rows } = await getEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
      this.loading = false;
      console.log(this.list);
    },
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
  },
};
</script>

<style>
</style>