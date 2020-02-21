<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" label-width="200px" class="demo-ruleForm" style="width: 1000px;margin-top: 30px">
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
        <el-input v-model="ruleForm.password" show-password />
      </el-form-item>
      <el-form-item label="一次连接服务器连续发送 ：" prop="sendnum">
        <el-input-number v-model="ruleForm.sendNum" controls-position="right" :min="1" :max="100" />
      </el-form-item>
      <el-form-item label="登录类型：" prop="logintype">
        <el-select v-model="ruleForm.loginType" placeholder="请选择">
          <el-option label="Login认证" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>

export default {
  name: 'Smtp',
  data() {
    return {
      ruleForm: {
        email: '',
        server: '',
        username: '',
        password: '',
        sendNum: '',
        loginType: ''
      }
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    submitForm() {
      this.$axios.post(this.$url + 'setup/updateSmtp', this.ruleForm).then((res) => {
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    onload() {
      this.$axios.get(this.$url + 'setup/getSmtp').then((res) => {
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.ruleForm = res.data.data
        }
        if (res.data.code === 3001) {
          console.log('请求失败')
        }
      })
    }
  }
}
</script>
