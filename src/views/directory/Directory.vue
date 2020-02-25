<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" style="margin-top: 30px;margin-left:30px">
      <el-form-item label="选择法规：">
        <el-select v-model="regId" clearable placeholder="请选择" style="width: 400px" @change="onChange">
          <el-option
            v-for="item in regList"
            :key="item.rid"
            :label="item.rname"
            :value="item.rid"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="toAdd">新增目录</el-button>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="did"
      border
      stripe
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="dname"
        label="目录名称"
      />
      <el-table-column
        prop="sort"
        label="同级排序"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--弹出框-->
    <el-dialog title="修改目录" :visible.sync="dialogFormVisible" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
        <el-form-item label="目录名称 ：" prop="dname">
          <el-input v-model="ruleForm.dname" style="width: 500px" />
        </el-form-item>
        <el-form-item label="同级目录排序 ：" prop="sort">
          <el-input-number v-model="ruleForm.sort" controls-position="right" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="目录层级：" prop="level">
          <el-input-number v-model="ruleForm.level" controls-position="right" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="选择法规：" prop="rid">
          <el-select v-model="ruleForm.rid" clearable placeholder="请选择" style="width: 500px" @change="handerChange">
            <el-option
              v-for="item in regList"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateDir('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Directory',
  data() {
    return {
      isResouceShow: 0,
      dialogFormVisible: false,
      valueId: '',
      options: [],
      regList: [],
      regId: '',
      value: '',
      tableData: [],
      dire: [],
      ruleForm: [],
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
    handleEdit(index, row) {
      this.ruleForm = row
      var params = new URLSearchParams()
      params.append('rid', this.ruleForm.rid)
      this.$axios.post(this.$url + 'cascader/getDir', params).then((res) => {
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.dire = res.data.data
          this.valueId = this.ruleForm.parentId
          this.dialogFormVisible = true
        }
        if (res.data.code === 3001) {
          console.log('无数据')
        }
      })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = new URLSearchParams()
        params.append('rid', row.rid)
        params.append('did', row.did)
        this.$axios.post(this.$url + 'cascader/delDir', params).then((res) => {
          if (res.data.code === 2001) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.onChange()
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
    onload() {
      this.$axios.get(this.$url + 'cascader/getAllReg').then((res) => {
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.regList = res.data.data
        }
        if (res.data.code === 3001) {
          console.log('请求失败')
        }
      })
    },
    onChange() {
      this.tableData = []
      var params = new URLSearchParams()
      params.append('rid', this.regId)
      this.$axios.post(this.$url + 'cascader/getDir', params).then((res) => {
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.tableData = res.data.data
        }
        if (res.data.code === 3001) {
          console.log('无数据')
          this.$message({
            type: 'info',
            message: '此法规下目前无目录'
          })
        }
      })
    },
    toAdd() {
      this.$router.push({ path: '/reg/addDire' })
    },
    onHandleChange() {
      if (this.valueId == null) {
        this.ruleForm.parentId = 0
        console.log(this.ruleForm.parentId)
      }
      if (this.valueId.length === 1) {
        this.ruleForm.parentId = this.valueId[0]
        this.ruleForm.level = this.valueId.length
        console.log(this.valueId[0])
        console.log('level:' + (this.valueId.length + 1))
      } else {
        this.ruleForm.parentId = this.valueId[this.valueId.length - 1]
        this.ruleForm.level = this.valueId.length
        console.log('level:' + (this.valueId.length + 1))
      }
    },
    handerChange() {
      ++this.isResouceShow
      this.valueId = ''
      this.ruleForm.parentId = 0
      this.dire = []
      var params = new URLSearchParams()
      params.append('rid', this.ruleForm.rid)
      this.$axios.post(this.$url + 'cascader/getDir', params).then((res) => {
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.dire = res.data.data
        }
        if (res.data.code === 3001) {
          console.log('无数据')
          this.ruleForm.parentId = 0
        }
      })
    },
    updateDir(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post(this.$url + 'dir/updateDir', this.ruleForm).then((res) => {
            if (res.data.code === 2001) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.onChange()
              this.dialogFormVisible = false
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
    }
  }
}
</script>
