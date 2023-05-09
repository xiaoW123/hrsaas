<template>
  <!-- 导入excel组件 -->
  <upload-excel :on-success="success" />
  <!-- 导出excel组件 -->
</template>

<script>
import UploadExcel from '@/components/UploadExcel'
// 导入员工的接口
import { importEmployee } from '@/api/employees'
export default {
  components: {
    UploadExcel
  },
  data() {
    return {
      // 根据路由传入的参数来确定是导入还是导出
      type: this.$route.query.type
    }
  },
  methods: {
    async success({ header, results }) {
      if (this.type === 'user') {
        // 如果是导入员工
        // debugger
        const userRelations = {
          入职日期: 'timeOfEntry',
          手机号: 'mobile',
          姓名: 'username',
          转正日期: 'correctionTime',
          工号: 'workNumber'
        }
        const arr = []
        results.forEach((item) => {
          const userInfo = {}
          Object.keys(item).forEach((key) => {
            if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
              // item[key],就是该对象的值
              userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
            } else {
              userInfo[userRelations[key]] = item[key]
            }
          })
          arr.push(userInfo)
        })
        // 调用导入接口
        await importEmployee(arr)
        this.$message.success('导入Excel成功')
      }
      this.$router.back()
    },
    // 时间格式化
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style></style>
