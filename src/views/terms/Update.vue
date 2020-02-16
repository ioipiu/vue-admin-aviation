<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top:30px">
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
      <el-form-item label="选择父级目录：" prop="did">
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
      <el-form-item label="条款编号 ：" prop="tno">
        <el-input v-model="ruleForm.tno" />
      </el-form-item>
      <el-form-item label="条款编号别名 ：" prop="termsAlias">
        <el-input v-model="ruleForm.termsAlias" />
      </el-form-item>
      <el-form-item label="条款版本号 ：" prop="termsVersion">
        <el-input v-model="ruleForm.termsVersion" />
      </el-form-item>
      <el-form-item label="条款标题 ：" prop="termsTitle">
        <el-input v-model="ruleForm.termsTitle" />
      </el-form-item>
      <el-form-item label="条款内容 ：" prop="termsContent">
        <tinymce_editor
          ref="editor"
          v-model="ruleForm.termsContent"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="关键词 ：" prop="termsKeyword">
        <el-input v-model="ruleForm.termsKeyword" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即保存</el-button>
        <el-button @click="goback">返回</el-button>
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
      isResouceShow: 0,
      valueId: '',
      dire: [],
      disabled: false,
      ruleForm: {
        rid: '',
        did: '',
        tno: '',
        termsAlias: '',
        termsVersion: '',
        termsTitle: '',
        termsContent: '',
        termsKeyword: ''
      },
      options: [],
      rules: {
        termsTitle: [
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
        termsContent: [
          { required: true, message: '条款内容不能为空', trigger: 'blur' }
        ],
        termsKeyword: [
          { required: true, message: '关键词不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.onload()
    this.getTerms()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8787/term/updateTerms', this.ruleForm).then((res) => {
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
    goback() {
      this.$router.push({ path: '/reg/terms' })
    },
    onHandleChange() {
      if (this.valueId.length === 1) {
        this.ruleForm.did = this.valueId[0]
        console.log(this.valueId[0])
      } else {
        this.ruleForm.did = this.valueId[this.valueId.length - 1]
        console.log(this.ruleForm.did)
      }
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
    getTerms() {
      var tid = this.$route.query.tid
      var params = new URLSearchParams()
      params.append('tid', tid)
      this.$axios.post('http://localhost:8787/term/getTermsById', params).then((res) => {
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.ruleForm = res.data.data
          var params = new URLSearchParams()
          params.append('rid', this.ruleForm.rid)
          this.$axios.post('http://localhost:8787/cascader/getDir', params).then((res) => {
            if (res.data.code === 2001) {
              console.log('请求成功')
              this.dire = res.data.data
              this.valueId = this.ruleForm.did
            }
            if (res.data.code === 3001) {
              console.log('无数据')
            }
          })
        }
        if (res.data.code === 3001) {
          console.log('请求失败')
          this.$message.error('获取数据失败')
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
