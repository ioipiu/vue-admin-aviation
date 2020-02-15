<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top: 30px">
      <el-form-item label="网站状态 ：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="网站标题：" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>
      <el-form-item label="网站域名：" prop="domain">
        <el-input v-model="ruleForm.domain" />
      </el-form-item>
      <el-form-item label="网站logo ：" prop="logo">
        <el-upload
          action=""
          class="avatar-uploader"
          :auto-upload="false"
          :on-change="handleChange"
          :before-upload="beforeAvatarUpload"
          :on-remove="handleRemove"
        >
          <img v-if="ruleForm.logo" :src="ruleForm.logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="公司邮箱：" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="站点语言：" prop="language">
        <el-select v-model="ruleForm.language" placeholder="请选择" style="width:300px">
          <el-option label="简体中文" :value="1" />
          <el-option label="繁體中文" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即保存</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<script>

export default {

  data() {
    return {
      ruleForm: {
        status: '',
        logo: '',
        title: '',
        domain: '',
        email: '',
        language: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入网站标题', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        language: [
          { required: true, message: '请选择语音', trigger: 'change' }
        ],
        domain: [
          { required: true, message: '请输入域名', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        status: [
          { required: true, message: '请选择网站动态', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    handleChange(file, fileList) {
      this.getBase64(file.raw).then(res => {
        this.ruleForm.logo = res
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
      this.ruleForm.logo = ''
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8787/setup/updateWebSet', this.ruleForm).then((res) => {
            if (res.data.code === 2001) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            }
            if (res.data.code === 3001) {
              this.$message.error('修改失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    onload() {
      this.$axios.get('http://localhost:8787/setup/getWebSet').then((res) => {
        this.loading = true
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.ruleForm = res.data.data
          console.log(this.ruleForm.logo)
        }
        if (res.data.code === 3001) {
          console.log('请求失败')
        }
      })
    }
  }
}
</script>
