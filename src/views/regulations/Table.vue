<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" style="margin-top: 30px;margin-left:30px">
      <el-form-item>
        <el-button type="primary" @click="btn">新增法规</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      stripe
      :data="tableData.filter(data => !search || data.alias.toLowerCase().includes(search.toLowerCase()) ||
        data.rname.includes(search))"
    >
      <el-table-column
        prop="rno"
        label="部号"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.rno }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="alias"
        label="法规部号别名"
        width="300"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.alias }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="version"
        label="版本号"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rname"
        label="法规名称"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.rname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stauts"
        label="前台显示"
        width="200"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status==0">不显示</span>
          <span v-if="scope.row.status==1">显示</span>
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
            @click="handleEdit(scope.$index, scope.row.rid)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.rid)"
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

<style>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }
</style>

<script>
export default {
  name: 'Table',
  data() {
    return {
      tableData: [],
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    btn() {
      this.$router.push({ path: '/reg/addReg' })
    },
    handleEdit(index, rid) {
      console.log(index, rid)
      this.$router.push({
        name: 'UpdateReg',
        query: {
          rid: rid
        }
      })
    },
    handleDelete(index, rid) {
      this.$confirm('此操作将永久删除该法规, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = new URLSearchParams()
        params.append('rid', rid)
        this.$axios.post(this.$url + 'reg/delReg', params).then((res) => {
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
    handleSizeChange: function(size) {
      this.pageSize = size
      this.getData()
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      this.getData()
    },
    getData() {
      const params = new URLSearchParams()
      params.append('currentPage', this.currentPage)
      params.append('pageSize', this.pageSize)
      this.$axios.post(this.$url + 'reg/getAll', params).then((res) => {
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

