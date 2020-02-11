<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top:30px">
      <el-form-item label="法规：" prop="rid">
        <el-select v-model="reg" clearable placeholder="请选择" style="width: 500px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在目录：" prop="did">
        <el-select v-model="dir" clearable placeholder="请选择" style="width: 500px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="条款编号 ：" prop="tno">
        <el-input v-model="ruleForm.tno" />
      </el-form-item>
      <el-form-item label="条款编号别名 ：" prop="alias">
        <el-input v-model="ruleForm.alias" />
      </el-form-item>
      <el-form-item label="条款版本号 ：" prop="version">
        <el-input v-model="ruleForm.version" />
      </el-form-item>
      <el-form-item label="条款标题 ：" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>
      <el-form-item label="条款内容 ：" prop="content">
        <tinymce_editor
          ref="editor"
          v-model="ruleForm.content"
          :disabled="disabled"
          @onClick="onClick"
        />
      </el-form-item>
      <el-form-item label="关键词 ：" prop="keyword">
        <el-input v-model="ruleForm.keyword" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TinyMce from '../../components/tinymce/Tinymce.vue'
export default {
  name: 'AddTerms',
  components: {
    tinymce_editor: TinyMce
  },
  data() {
    return {
      reg: {},
      dir: {},
      disabled: false,
      ruleForm: {
        rid: '',
        did: '',
        tno: '',
        alias: '',
        version: '',
        title: '',
        content: '',
        keyword: ''
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
      rules: {
        title: [
          { required: true, message: '请输入条款标题', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        rid: [
          { required: true, message: '请选择所属法规', trigger: 'change' }
        ],
        did: [
          { required: true, message: '请选择所属目录', trigger: 'change' }
        ],
        tno: [
          { required: true, message: '请选择条款编号', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入条款编号别名', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '版本号不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '条款内容不能为空', trigger: 'blur' }
        ],
        keyword: [
          { required: true, message: '关键词不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 鼠标单击的事件
    onClick(e, editor) {
      console.log('Element clicked')
      console.log(e)
      console.log(editor)
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
