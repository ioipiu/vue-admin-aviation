<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top: 30px">
      <el-form-item label="法规部号：" prop="rno">
        <el-input v-model="ruleForm.rno" />
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
          <el-radio label="显示" />
          <el-radio label="不显示" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="首页法规图标 ：">
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
      <el-form-item label="法规PDF文件名称：" prop="pdf_name">
        <el-input v-model="ruleForm.pdf_name" />
      </el-form-item>
      <el-form-item label="法规PDF文件下载链接：：" prop="pdf_link">
        <el-input v-model="ruleForm.pdf_link" />
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
import TinyMce from '../../components/tinymce/Tinymce.vue'
export default {
  name: 'AddRegulations',
  components: {
    tinymce_editor: TinyMce
  },
  data() {
    return {
      msg: 'Welcome to Use Tinymce Editor',
      disabled: false,
      imageUrl: '',
      ruleForm: {
        rno: '',
        alias: '',
        version: '',
        rname: '',
        status: '',
        pdf_name: '',
        pdf_link: '',
        desc: ''
      },
      rules: {
        rno: [
          { required: true, message: '部号不能为空', trigger: 'blur' },
          { type: 'number', message: '部号必须为数字值' }
        ],
        alias: [
          { required: true, message: '请输入部号别名', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '版本号不能为空', trigger: 'blur' }
        ],
        rname: [
          { required: true, message: '请输入法规名称', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否显示', trigger: 'change' }
        ],
        pdf_name: [
          { required: true, message: '请填写法规PDF文件名称', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
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
    // 清空内容
    clear() {
      this.$refs.editor.clear()
    },
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

