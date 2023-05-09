<template>
  <div>
    <el-upload
      :class="{ disabled: fileComputed }"
      :file-list="fileList"
      list-type="picture-card"
      action="#"
      :limit="1"
      :on-remove="handleRemove"
      :on-preview="preview"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <!-- 进度条 -->
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <!-- 图片预览弹层 -->
    <el-dialog title="头像预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
new COS({
  SecretId: 'COS_SECRETID', // 身份识别 ID
  SecretKey: 'COS_SECRETKEY' // 身份密钥
})

export default {
  name: 'ImageUpload',
  data() {
    return {
      // 自动添加uid
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '', // 弹出层头像预览
      currentFileUid: null, // 当前上传的图片id
      showPercent: false, // 进度条
      percent: 0 //进度
    }
  },
  methods: {
    // 1.点击预览事件
    preview(file) {
      console.log(file)
      this.showDialog = true
      this.imgUrl = file.url
    },
    // 2.点击删除按钮
    handleRemove(file, fileList) {
      // file是要删除的文件
      // fileList是删除后剩下的文件
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid)
    },
    // 3.添加文件、上传成功和上传失败时都会被调用
    changeFile(file, fileList) {
      // file是上传的文件
      // fileList是当前的最新的数组
      // 但是会调用2次，添加一次，上传一次
      // 为什么还是失败？因为当前还没上传成功 action我们设置的是“#”，需要配合腾讯云cos
      this.fileList = fileList.map((item) => item)
    },
    // 4.文件上传之前的钩子,确认是否上传
    beforeUpload(file) {
      // 文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      console.log(file)
      if (!types.some((item) => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 文件大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid // 记录当前的uid
      this.showPercent = true
      return true // 最后一定要return true 表示通过检测
    },
    // 上传动作
    // 进行上传操作
    // 进行上传操作
    upload(params) {
      //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            Bucket: 'shuiruohanyu-106-1302806742', // 存储桶
            Region: 'ap-beijing', // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
            // 进度条
            onProgress: (params) => {
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            console.log(err || data)
            // data中有一个statusCode === 200 的时候说明上传成功
            if (!err && data.statusCode === 200) {
              //   此时说明文件上传成功  要获取成功的返回地址
              // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
              // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
              // 需要知道当前上传成功的是哪一张图片
              this.fileList = this.fileList.map((item) => {
                // 去找谁的uid等于刚刚记录下来的id
                if (item.uid === this.currentFileUid) {
                  // 将成功的地址赋值给原来的url属性
                  return { url: 'http://' + data.Location, upload: true }
                  // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                  // 保存  => 图片有大有小 => 上传速度有快有慢 =>要根据有没有upload这个标记来决定是否去保存
                }
                return item
              })
              // 防止太快看不见，延迟1s
              setTimeout(() => {
                this.showPercent = false
                this.percent = 0
              }, 1000)

              // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
            }
          }
        )
      }
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  }
}
</script>

<style>
.disabled .el-upload {
  display: none !important;
}
</style>
