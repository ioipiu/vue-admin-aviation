<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1000px;margin-top: 30px">
      <el-form-item label="Email ：" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="服务器：" prop="server">
        <el-input v-model="ruleForm.server" />
      </el-form-item>
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="ruleForm.password" />
      </el-form-item>
      <el-form-item label="一次连接服务器连续发送 ：" prop="sendnum">
        <el-input v-model="ruleForm.sendnum" />
      </el-form-item>
      <el-form-item label="登录类型：" prop="logintype">
        <el-select v-model="ruleForm.logintype" placeholder="请选择">
          <el-option label="Login认证" value="login" />
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
  name: 'Smtp',
  data() {
    return {
      imageUrl: '',
      ruleForm: {
        email: '',
        server: '',
        username: '',
        password: '',
        sendnum: '',
        logintype: ''
      },
      rules: {
        server: [
          { required: true, message: '请输入服务器', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入服务器', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入服务器', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        logintype: [
          { required: true, message: '请选择登录类型', trigger: 'change' }
        ],
        sendnum: [
          { required: true, message: '请填写次数', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
