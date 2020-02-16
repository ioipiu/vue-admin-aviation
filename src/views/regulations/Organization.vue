<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" style="margin-top: 30px;margin-left:30px">
      <el-form-item>
        <el-button type="primary" @click="btn">新增法规</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column
        label="法规一级分类"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="法规二级分类"
      >
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.regulationsClassifyList" style="margin-left: 10px">{{ item.classifyName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row.typeId)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.typeId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--弹出框-->

    <el-dialog title="添加一级分类" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="width: 500px">
        <el-form-item label="分类名称：" label-width="120px">
          <el-input v-model="form.typeName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrg">确 定</el-button>
      </div>
    </el-dialog>

    <!--弹出表格-->

    <el-dialog title="法规二级分类" :visible.sync="dialogTableVisible">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="二级分类名称：">
          <el-input v-model="formInline.classifyName" placeholder="请输入" style="width:300px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="classifyList">
        <el-table-column property="classifyName" label="分类名称" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleTableEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleTableDelete(scope.$index, scope.row.classifyId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--表格内表格-->
    <el-dialog title="编辑二级分类" :visible.sync="formVisible">
      <el-form :model="classify" style="width: 500px">
        <el-form-item label="一级分类：" label-width="120px">
          <el-select v-model="classify.typeId" placeholder="请选法规一级分类">
            <el-option
              v-for="item in tableData"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称：" label-width="120px">
          <el-input v-model="classify.classifyName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateClassify">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Org',
  data() {
    return {
      value: '',
      tableData: [],
      form: {},
      formInline: {},
      classify: {},
      loading: true,
      dialogFormVisible: false,
      dialogTableVisible: false,
      formVisible: false,
      classifyList: []
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    addOrg() {
      var params = new URLSearchParams()
      params.append('typeName', this.form.typeName)
      this.$axios.post('http://localhost:8787/reg/addType', params).then((res) => {
        if (res.data.code === 2001) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.onload()
        }
        if (res.data.code === 3001) {
          this.$message.error('添加失败')
        }
      })
    },
    btn() {
      this.dialogFormVisible = true
    },
    handleEdit(index, typeId) {
      var params = new URLSearchParams()
      params.append('typeId', typeId)
      this.$axios.post('http://localhost:8787/reg/showClassify', params).then((res) => {
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.classifyList = res.data.data
          this.formInline.typeId = typeId
          this.dialogTableVisible = true
        }
        if (res.data.code === 3001) {
          console.log('请求失败')
          this.classifyList = []
          this.formInline.typeId = typeId
          this.dialogTableVisible = true
        }
      })
    },
    refresh() {
      var params = new URLSearchParams()
      params.append('typeId', this.formInline.typeId)
      this.$axios.post('http://localhost:8787/reg/showClassify', params).then((res) => {
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.classifyList = res.data.data
        }
        if (res.data.code === 3001) {
          console.log('请求失败')
        }
      })
    },
    handleDelete(index, typeId) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = new URLSearchParams()
        params.append('typeId', typeId)
        this.$axios.post('', params).then((res) => {
          if (res.data.code === 2001) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getData()
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
    handleTableEdit(index, row) {
      this.classify = row
      this.formVisible = true
    },
    handleTableDelete(index, classifyId) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = new URLSearchParams()
        params.append('classifyId', classifyId)
        this.$axios.post('http://localhost:8787/reg/delClassify', params).then((res) => {
          if (res.data.code === 2001) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.refresh()
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
    onload() {
      this.$axios.get('http://localhost:8787/reg/type').then((res) => {
        this.loading = true
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.tableData = res.data.data
          this.loading = false
        }
        if (res.data.code === 3001) {
          console.log('请求失败')
          this.loading = false
        }
      })
    },
    onSubmit() {
      var params = new URLSearchParams()
      params.append('typeId', this.formInline.typeId)
      params.append('classifyName', this.formInline.classifyName)
      this.$axios.post('http://localhost:8787/reg/addClassify', params).then((res) => {
        if (res.data.code === 2001) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.refresh()
          this.formInline.classifyName = ''
          this.onload()
        }
        if (res.data.code === 3001) {
          this.$message.error('添加失败')
        }
      })
    },
    updateClassify() {
      this.$axios.post('http://localhost:8787/reg/updateClassify', this.classify).then((res) => {
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
    }
  }

}
</script>
