<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top: 30px">
      <el-form-item label="分类：" prop="classifyId">
        <el-cascader
          ref="myCascader"
          v-model="valueId"
          :options="options"
          clearable
          style="width: 280px"
          @change="onChange"
        />
      </el-form-item>
      <el-form-item label="法规部号：" prop="rno">
        <el-input v-model.number="ruleForm.rno" />
      </el-form-item>
      <el-form-item label="法规部号别名：" prop="alias">
        <el-input v-model="ruleForm.alias" />
      </el-form-item>
      <el-form-item label="法规版本号：" prop="version">
        <el-input v-model="ruleForm.version" />
      </el-form-item>
      <el-form-item label="法规名称 ：" prop="rname">
        <el-input v-model="ruleForm.rname" />
      </el-form-item>
      <el-form-item label="是否显示 ：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="首页法规图标 ：" prop="icon">
        <el-upload
          action=""
          list-type="picture-card"
          :auto-upload="false"
          :limit="1"
          :on-change="handleChange"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="ruleForm.icon" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="法规PDF文件名称：" prop="pdfName">
        <el-input v-model="ruleForm.pdfName" />
      </el-form-item>
      <el-form-item label="法规PDF文件下载链接：：" prop="pdfLink">
        <el-input v-model="ruleForm.pdfLink" />
        <el-upload
          ref="upload"
          class="upload-demo"
          action="http://upload.qiniup.com/"
          :http-request="uploadRequest"
          :on-remove="handlePDFRemove"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="法规版本说明：" prop="desc">
        <tinymce_editor
          ref="editor"
          v-model="ruleForm.desc"
          :disabled="disabled"
          @onClick="onClick"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即保存</el-button>
        <el-button @click="goback">返回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import * as qiniu from 'qiniu-js'
import TinyMce from '../../components/tinymce/Tinymce.vue'
// token 找后端，obj 这里指代从 el-upload 接收到的 object
export const upload = (token, obj, next, error, complete) => {
  const {
    file
  } = obj
  // 关于 key 要怎么处理自行解决，但如果为 undefined 或者 null 会使用上传后的 hash 作为 key.
  const key = new Date().getTime()
  // 因人而异，自行解决
  const putExtra = {
    fname: '',
    params: {},
    mimeType: ['application/pdf']
  }
  //       fname: string，文件原文件名
  // params: object，用来放置自定义变量
  // mimeType: null || array，用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
  const config = {
    useCdnDomain: true,
    region: qiniu.region.z1
  }
  var observable = qiniu.upload(file, key, token, putExtra, config)
  observable.subscribe(next, error, complete) // 这样传参形式也可以
}
export default {
  name: 'AddRegulations',
  components: {
    tinymce_editor: TinyMce
  },
  data() {
    return {
      options: [],
      disabled: false,
      imageUrl: '',
      valueId: [],
      dialogVisible: false,
      regTypeList: [],
      classifyList: [],
      ruleForm: {},
      rules: {
        rno: [
          { required: true, message: '部号不能为空', trigger: 'blur' },
          { type: 'number', message: '部号必须为数字值', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入部号别名', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        rname: [
          { required: true, message: '请输入法规名称', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否显示', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    // 鼠标单击的事件
    onClick(e, editor) {
      console.log('Element clicked')
      console.log(e)
      console.log(editor)
    },
    // 清空内容
    clear() {
      this.$refs.editor.clear()
    },
    handleChange(file, fileList) {
      this.getBase64(file.raw).then(res => {
        this.ruleForm.icon = res
      })
    },
    typeChange() {
      var params = new URLSearchParams()
      params.append('typeId', this.ruleForm.typeId)
      this.$axios.post('http://localhost:8787/reg/showClassify', params).then((res) => {
        if (res.data.code == '2001') {
          console.log('请求成功')
          this.classifyList = res.data.data
        }
        if (res.data.code == '3001') {
          console.log('请求失败')
          this.$message.error('没有二级目录')
        }
      })
    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.ruleForm.icon = ''
    },
    handlePictureCardPreview() {
      this.dialogVisible = true
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    uploadRequest: function(request) {
      this.$axios.get('http://localhost:8787/reg/getToken').then((res) => {
        const token = res.data.data.token
        const host = res.data.data.host
        upload(
          token,
          request,
          next => {
            const total = next.total
            console.log(total)
          },
          error => {
            console.log(error)
          },
          complete => {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            const hash = complete.hash
            const key = complete.key
            this.ruleForm.pdfLink = 'http://' + host + '/' + key
            console.log(hash)
            console.log(key)
          }
        )
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handlePDFRemove(file, fileList) {
      this.ruleForm.pdfLink = ''
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8787/reg/updateReg', this.ruleForm).then((res) => {
            if (res.data.code == '2001') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$refs[formName].resetFields()
            }
            if (res.data.code == '3001') {
              this.$message.error('修改失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    goback() {
      this.$router.push({ path: '/reg/table' })
    },
    onload() {
      var rid = this.$route.query.rid
      const params = new URLSearchParams()
      params.append('rid', rid)
      this.$axios.post('http://localhost:8787/reg/getRegById', params).then((res) => {
        if (res.data.code == '2001') {
          console.log('请求成功')
          this.options = res.data.data.options
          this.ruleForm = res.data.data.reg
          this.valueId = this.ruleForm.classifyId
        }
        if (res.data.code == '3001') {
          console.log('请求失败')
        }
      })
    },
    onChange() {
      if (this.valueId.length === 1) {
        this.ruleForm.classifyId = this.valueId[0]
        console.log(this.valueId[0])
      } else {
        this.ruleForm.classifyId = this.valueId[this.valueId.length - 1]
        console.log(this.valueId[this.valueId.length - 1])
      }
    }
  }
}
</script>
