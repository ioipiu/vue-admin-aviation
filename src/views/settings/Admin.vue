<template>
  <div>
    <el-row style="margin-left: 30px;margin-top: 30px">
      <el-button type="primary" @click="onAdd">新增管理员</el-button>
    </el-row>
    <el-table
      v-loading="loading"
      stripe
      :data="tableData.filter(data => !search || data.aname.includes(search) ||
        data.mobile.includes(search))"
    >
      <el-table-column
        prop="mobile"
        label="管理员手机号"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="aname"
        label="管理员姓名"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px;overflow: hidden">{{ scope.row.aname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="添加日期"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="300px">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"
          />
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.aid)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      align="center"
      style="margin-top: 20px"
      :current-page="currentPage"
      :page-sizes="[5,10,20,30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!--添加弹出框-->

    <el-dialog title="添加子管理员" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">
        <el-form-item label="管理员姓名：" label-width="120px" prop="aname">
          <el-input v-model="ruleForm.aname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号：" label-width="120px" prop="mobile">
          <el-input v-model.number="ruleForm.mobile" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码：" label-width="120px" prop="passWord">
          <el-input v-model="ruleForm.passWord" autocomplete="off" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改弹出框-->

    <el-dialog title="管理子管理员" :visible.sync="formVisible" width="500px">
      <el-form ref="form" :model="form" :rules="adminRules" class="demo-ruleForm">
        <el-form-item label="手机号：" label-width="120px" prop="mobile">
          <el-input v-model.number="form.mobile" autocomplete="off" :readonly="true" />
        </el-form-item>
        <el-form-item label="管理员姓名：" label-width="120px" prop="aname">
          <el-input v-model="form.aname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码：" label-width="120px" prop="passWord">
          <el-input v-model="form.passWord" autocomplete="off" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="onChange('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          var params = new URLSearchParams()
          params.append('mobile', value)
          this.$axios.post(this.$url + 'admin/findMobile', params).then((res) => {
            if (res.data.code === 2001) {
              callback()
            }
            if (res.data.code === 3001) {
              callback(new Error('手机号重复,请重新输入'))
            }
          })
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      loading: true,
      formVisible: false,
      dialogFormVisible: false,
      ruleForm: {},
      form: {},
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      rules: {
        aname: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        mobile: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      adminRules: {
        aname: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    onAdd() {
      this.dialogFormVisible = true
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = new URLSearchParams()
          params.append('mobile', this.ruleForm.mobile)
          params.append('aname', this.ruleForm.aname)
          params.append('passWord', this.ruleForm.passWord)
          this.$axios.post(this.$url + 'admin/addAdmin', params).then((res) => {
            if (res.data.code === 2001) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.onload()
              this.dialogFormVisible = false
              this.$refs[formName].resetFields()
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
    onChange(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = new URLSearchParams()
          params.append('aid', this.form.aid)
          params.append('aname', this.form.aname)
          params.append('passWord', this.form.passWord)
          this.$axios.post(this.$url + 'admin/updateAdmin', params).then((res) => {
            if (res.data.code === 2001) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.formVisible = false
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
    handleEdit(index, row) {
      this.form = row
      this.formVisible = true
    },
    handleDelete(index, aid) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = new URLSearchParams()
        params.append('aid', aid)
        this.$axios.post(this.$url + 'admin/delAdmin', params).then((res) => {
          if (res.data.code === 2001) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.onload()
          }
          if (res.data.code === 3001) {
            this.$message.error('删除失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange: function(size) {
      this.pageSize = size
      this.onload()
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      this.onload()
    },
    onload() {
      const params = new URLSearchParams()
      params.append('currentPage', this.currentPage)
      params.append('pageSize', this.pageSize)
      this.$axios.post(this.$url + 'admin/showAdmin', params).then((res) => {
        this.loading = true
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.tableData = res.data.data.tableData
          this.total = res.data.data.total
          this.loading = false
        }
        if (res.data.code === 3001) {
          console.log('请求失败')
          this.loading = false
        }
      })
    }
  }

}
</script>
