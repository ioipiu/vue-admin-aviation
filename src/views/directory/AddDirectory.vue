<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 700px;margin-top: 30px">
    <el-form-item label="目录名称 ：" prop="dname">
      <el-input v-model="ruleForm.dname" />
    </el-form-item>
    <el-form-item label="同级目录排序 ：" prop="sort">
      <el-input-number v-model="ruleForm.sort" controls-position="right" :min="1" :max="100" />
    </el-form-item>
    <el-form-item label="选择法规：" prop="rid">
      <el-select v-model="ruleForm.rid" clearable placeholder="请选择" style="width: 500px" @change="onChange">
        <el-option
          v-for="item in options"
          :key="item.rid"
          :label="item.rname"
          :value="item.rid"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="选择父级目录：" prop="parentId">
      <el-cascader
        :key="isResouceShow"
        v-model="valueId"
        :options="dire"
        :props="{ value: 'did', label: 'dname', checkStrictly: true}"
        clearable
        style="width: 500px"
        @change="onHandleChange"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">新增目录</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'AddDire',
  data() {
    return {
      isResouceShow: 0,
      valueId: '',
      dire: [],
      ruleForm: {
        rid: '',
        dname: '',
        sort: 0,
        parentId: 0,
        level: 1,
        key: ''
      },
      options: [],
      rules: {
        dname: [
          { required: true, message: '请输入目录名称', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        rid: [
          { required: true, message: '请选择所属法规', trigger: 'change' }
        ],
        parentId: [
          { required: true, message: '请选择父级目录', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          this.$axios.post('http://localhost:8787/dir/addDir', this.ruleForm).then((res) => {
            if (res.data.code === 2001) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.resetForm(formName)
            }
            if (res.data.code === 3001) {
              this.$message.error('添加失败')
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
      ++this.isResouceShow
      this.valueId = ''
      this.dire = []
    },
    onHandleChange() {
      this.ruleForm.key = ''
      if (this.valueId.length === 1) {
        this.ruleForm.parentId = this.valueId[0]
        this.ruleForm.level = this.valueId.length + 1
        this.ruleForm.key += this.ruleForm.parentId + '-'
      } else {
        for (var i = 0; i < this.valueId.length - 1; i++) {
          this.ruleForm.key += this.valueId[i] + '-'
        }
        this.ruleForm.parentId = this.valueId[this.valueId.length - 1]
        this.ruleForm.level = this.valueId.length + 1
        this.ruleForm.key += this.ruleForm.parentId
      }
      console.log(this.ruleForm.key)
    },
    onload() {
      this.$axios.get('http://localhost:8787/cascader/getAllReg').then((res) => {
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.options = res.data.data
        }
        if (res.data.code === 3001) {
          console.log('请求失败')
        }
      })
    },
    onChange() {
      ++this.isResouceShow
      this.valueId = ''
      this.dire = []
      var params = new URLSearchParams()
      params.append('rid', this.ruleForm.rid)
      this.$axios.post('http://localhost:8787/cascader/getDir', params).then((res) => {
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.dire = res.data.data
        }
        if (res.data.code === 3001) {
          console.log('无数据')
        }
      })
    }
  }
}
</script>

