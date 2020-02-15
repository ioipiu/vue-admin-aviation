<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" label-width="200px" class="demo-ruleForm" style="width: 1000px;margin-top: 30px">
      <el-form-item label="平台apiKey：" prop="apiKey">
        <el-input v-model="ruleForm.apiKey" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">保存</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Mess',
  data() {
    return {
      ruleForm: {}
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    submitForm() {
      var params = new URLSearchParams()
      params.append('id', this.ruleForm.id)
      params.append('apiKey', this.ruleForm.apiKey)
      this.$axios.post('http://localhost:8787/setup/updateSms', params).then((res) => {
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
      this.$axios.get('http://localhost:8787/setup/getSms').then((res) => {
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
