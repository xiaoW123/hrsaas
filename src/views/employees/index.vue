<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
          <el-button size="small" type="danger" @click="exportData">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <el-card v-loading="loading">
        <el-table :data="list" border style="width: 100%">
          <el-table-column width="100" label="序号" sortable="" type="index" />
          <el-table-column width="100" label="姓名" sortable="" prop="username" />
          <el-table-column width="150" label="头像" align="center">
            <template slot-scope="{ row }">
              <img
                slot="reference"
                v-imagerror="defaultImg"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column width="130" label="手机号" sortable="" prop="mobile" />
          <el-table-column width="100" label="工号" sortable="" prop="workNumber" />
          <el-table-column width="120" label="聘用形式" sortable="" :formatter="formatEmployment" prop="formOfEmployment" />
          <el-table-column width="120" label="部门" sortable="" prop="departmentName" />
          <el-table-column width="150" label="入职时间" sortable="">
            <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }} </template>
          </el-table-column>
          <el-table-column width="150" label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            @current-change="changePage"
            :current-page="page.page"
            :total="page.total"
            :page-size="page.size"
            layout="total,prev, pager, next"
          />
        </el-row>
      </el-card>
      <!-- 弹窗组件 -->
      <add-employee :show-dialog.sync="showDialog" />
      <!-- 二维码弹窗 -->
      <el-dialog title="二维码" :visible.sync="showCodeDialog" @opened="showQrCode" @close="imgUrl = ''">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
      <!-- 角色弹窗 -->
      <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees.js'
import PageTools from '@/components/PageTools'
// 聘用枚举类型
import EmployeeEnum from '@/api/constant/employees'
// 弹窗组件
import AddEmployee from './components/AddEmployee.vue'
import UploadExcel from '@/components/UploadExcel/index.vue'
import { formatDate } from '@/filters'
// 二维码组件
import QrCode from 'qrcode'
// 角色弹窗
import AssignRole from './components/AssignRole.vue'

export default {
  name: 'Employees',
  components: { PageTools, AddEmployee, UploadExcel, AssignRole },
  data() {
    return {
      defaultImg: require('@/assets/common/defaultImg.png'),
      showDialog: false, // 弹窗
      loading: false,
      list: [], // 表数据
      page: {
        page: 1, // 页码
        size: 10, // 每页条数
        total: 0 // 总数
      },

      showCodeDialog: false, // 二维码弹窗
      showRoleDialog: false, // 角色弹窗
      userId: '' // 角色id
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 聘用形式的格式化
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除按钮
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // Excel导出数据
    exportData() {
      // 表头对应关系
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 懒加载Excel导出功能
      import('@/vendor/Export2Excel').then(async (excel) => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total }) // 获取员工表的所有数据
        // 获得到的rows数据结构为：[{username:"管理员",mobile:"13800000002"...},{}]  --转成--> [['管理员','13800000002'...],[]]
        const data = this.formatJson(headers, rows)
        // 复杂表头
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers), // 导出的Excel表格的title字段-必填
          data, // 表头对应的数据-数据格式 [[],[],[]]
          filename: '员工信息表', //非必填
          bookType: 'xlsx', //非必填
          multiHeader, // 复杂表头，[[],[]]
          merges // 需要合并的部分
        })
      })
    },
    // Excel导出数据结构转换
    formatJson(headers, rows) {
      // rows.map -> {username:"管理员",mobile:"13800000002"...}
      //map->映射成新数组，把取到的数组值映射成一个数组 -> [['管理员','13800000002',...],[],...]
      return rows.map((item) => {
        // Object.keys -> ['姓名','手机号',...]
        // map -> 映射成新数组，把取到的值映射成一个数组 -> ['管理员','13800000002',...]
        return Object.keys(headers).map((key) => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化时间
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 格式化聘用形式
            const obj = EmployeeEnum.hireType.find((obj) => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // 点击图片查看二维码
    showQrCode(url) {
      console.log(url)
      if (url) {
        this.showCodeDialog = true
        // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 角色
    editRole(id) {
      // props把id传过去是异步的，所以我们需要父组件调用子组件的方法
      this.userId = id
      this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style lang="scss" scoped></style>
