<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" label-width="200px" class="demo-ruleForm" style="width: 1000px;margin-top: 30px">
      <el-form-item label="服务协议：" prop="content">
        <tinymce_editor
          ref="editor"
          v-model="ruleForm.content"
          :disabled="disabled"
          @onClick="onClick"
        />
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
    components: {
      tinymce_editor: TinyMce
    },
    data() {
      return {
        msg: 'Welcome to Use Tinymce Editor',
        disabled: false,
        ruleForm:{}
      }
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
