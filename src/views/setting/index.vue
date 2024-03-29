<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- button -->
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <!-- tables -->
            <el-table :data="list" border="">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignRole(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                @current-change="changePage"
                :current-page="page.page"
                :page-size="page.pagesize"
                layout="total, prev, pager, next"
                :total="page.total"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form :model="formData" label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width: 400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 弹层 -->
      <my-dialog @getRoleList="getRoleList" :showDialog.sync="showDialog" :roleForm.sync="roleForm" />
      <!-- 分配权限弹层 -->
      <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
        <!-- 权限是一颗树 -->
        <!-- 将数据绑定到组件上 -->
        <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
        <!-- id作为唯一标识 -->
        <el-tree
          ref="permTree"
          :data="permData"
          :props="defaultProps"
          :show-checkbox="true"
          :check-strictly="true"
          :default-expand-all="true"
          :default-checked-keys="selectCheck"
          node-key="id"
        />
        <!-- 确定 取消 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
            <el-button size="small" @click="btnPermCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
import MyDialog from './components/dialog.vue'

export default {
  name: 'Setting',
  components: { MyDialog },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  data() {
    return {
      showDialog: false,
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      list: [],
      page: {
        page: 1, // 页码
        pagesize: 5, // 每页条数
        total: 0
      },
      formData: {},
      roleForm: {},
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  methods: {
    // 员工列表
    async getRoleList() {
      const data = await getRoleList(this.page)
      this.page.total = data.total
      this.list = data.rows
    },
    // 当页码发生改变
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    // 公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除员工
    deleteRole(id) {
      this.$confirm('确认删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新渲染数据
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 编辑员工
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    // 分配权限
    async assignRole(id) {
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      this.roleId = id
      const { permIds } = await getRoleDetail(id) // 获取当前角色拥有的权限
      console.log(permIds)
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    // 确定
    async btnPermOK() {
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    // 取消
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  }
}
</script>

<style lang="scss" scoped></style>
