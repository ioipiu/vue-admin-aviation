<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top: 30px">
    <el-form-item label="目录名称 ：" prop="dname">
      <el-input v-model="ruleForm.dname" />
    </el-form-item>
    <el-form-item label="同级目录排序 ：">
      <el-input-number v-model="ruleForm.sort" controls-position="right" :min="-100" :max="100" @change="handleChange" />
    </el-form-item>
    <el-form-item label="选择所属法规：" prop="rid">
      <el-select v-model="reg" clearable placeholder="请选择" style="width: 500px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="选择父级目录：" prop="parent_id">
      <el-select v-model="dir" clearable placeholder="请选择" style="width: 500px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
      ruleForm: {
        dname: '',
        sort: '',
        rid: '',
        parent_id: ''
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      reg: {},
      dir:{},
      rules: {
        dname: [
          { required: true, message: '请输入目录名称', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        rid: [
          { required: true, message: '请选择所属法规', trigger: 'change' }
        ],
        parent_id: [
          { required: true, message: '请选择父级目录', trigger: 'change' }
        ]
      },
      num: 1
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
    },
    handleChange(value) {
      console.log(value)
    }
  }
}
</script>

