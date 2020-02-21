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
      <el-button type="primary" @click="toAdd">新增条款</el-button>
    </el-form>
    <el-table
      stripe
      :data="tableData.filter(data => !search || data.termsAlias.toLowerCase().includes(search.toLowerCase()) ||
        data.termsTitle.includes(search) || data.termsContent.includes(search))"
    >
      <el-table-column
        prop="tno"
        label="条款号"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.tno }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="termsAlias"
        label="条款号别名"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.termsAlias }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="termsTitle"
        label="条款标题"
        sortable
        width="300px"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.termsTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rname"
        label="所属法规名称"
        width="500px"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.rname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="termsVersion"
        label="版本号"
        sortable
        width="150px"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.termsVersion }}</span>
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
            @click="handleEdit(scope.$index, scope.row.tid)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.tid)"
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
  </div>
</template>

<script>
export default {
  name: 'Terms',
  data() {
    return {
      regList: [],
      regId: '',
      options: [],
      value: '',
      tableData: [],
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    handleEdit(index, tid) {
      console.log(index, tid)
      this.$router.push({
        name: 'UpdateTerms',
        query: {
          tid: tid
        }
      })
    },
    handleDelete(index, tid) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = new URLSearchParams()
        params.append('tid', tid)
        this.$axios.post(this.$url + 'term/delTerms', params).then((res) => {
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
    handleSizeChange: function(size) {
      console.log(this.regId)
      this.pageSize = size
      this.onChange()
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      this.onChange()
    },
    onSubmit() {
      console.log('submit!')
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
      var params = new URLSearchParams()
      params.append('rid', this.regId)
      params.append('currentPage', this.currentPage)
      params.append('pageSize', this.pageSize)
      this.$axios.post(this.$url + 'term/getTerms', params).then((res) => {
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.total = res.data.data.total
          this.tableData = res.data.data.tableData
        }
        if (res.data.code === 3001) {
          console.log('无数据')
          this.tableData = []
          this.$message({
            type: 'info',
            message: '此法规下目前无条款'
          })
        }
      })
    },
    toAdd() {
      this.$router.push({ path: '/reg/addTerms' })
    }
  }
}
</script>
