<template>
  <div>
    <el-table
      v-loading="loading"
      stripe
      :default-sort="{prop: 'createTime', order: 'descending'}"
      :data="tableData.filter(data => !search || data.content.includes(search) ||
        data.phone.includes(search))"
    >
      <el-table-column
        prop="cname"
        label="姓名"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.cname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="咨询内容"
        :show-overflow-tooltip="true"
        width="500px"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px;overflow: hidden">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="咨询时间"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系方式"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.phone }}</span>
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
            @click="handleDelete(scope.$index, scope.row.zid)"
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

    <!--弹出框-->

  </div>
</template>

<style lang="css">
  .el-tooltip__popper{font-size: 14px; max-width:50% } /*设置显示隐藏部分内容，按50%显示*/
</style>

<script>

export default {
  name: 'Con',
  data() {
    return {
      loading: true,
      dialogFormVisible: false,
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      form: []
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, zid) {
      console.log(index, zid)
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
      this.$axios.post('http://localhost:8787/usr/getCons', params).then((res) => {
        this.loading = true
        if (res.data.code == '2001') {
          console.log('请求成功')
          this.tableData = res.data.data.tableData
          this.total = res.data.data.total
          this.loading = false
        }
        if (res.data.code == '3001') {
          console.log('请求失败')
          this.loading = false
        }
      })
    }
  }

}
</script>
