<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top: 30px">
      <el-form-item label="网站状态 ：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="开启" />
          <el-radio label="关闭" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="网站标题：" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>
      <el-form-item label="网站域名：" prop="domain">
        <el-input v-model="ruleForm.domain" />
      </el-form-item>
      <el-form-item label="网站logo ：" >
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="公司邮箱：" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="站点语言：" prop="language">
        <el-select v-model="ruleForm.region" placeholder="请选择" style="width:300px">
          <el-option label="简体中文" value="jianti"></el-option>
          <el-option label="繁體中文" value="fanti"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
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
      imageUrl: '',
      ruleForm: {
        status: '',
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
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择网站动态', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
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
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
