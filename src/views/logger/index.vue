<template>
  <div>
    <el-table
      v-loading="loading"
      stripe
      :default-sort="{prop: 'logDate', order: 'descending'}"
      :data="tableData.filter(data => !search || data.username.includes(search) ||
        data.operation.includes(search))"
    >
      <el-table-column
        prop="username"
        label="操作者"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作内容描述"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px;overflow: hidden">{{ scope.row.operation }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="method"
        label="被执行的方法"
        width="300"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="params"
        label="数据内容"
        sortable
        width="500"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.params }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="logDate"
        label="操作时间"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.logDate | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
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
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >查看</el-button>
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

    <el-dialog title="日志详情" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="操作者：" label-width="120px">
          <el-input v-model="form.username" autocomplete="off" :readonly="true" />
        </el-form-item>
        <el-form-item label="操作内容：" label-width="120px">
          <el-input v-model="form.operation" autocomplete="off" :readonly="true" />
        </el-form-item>
        <el-form-item label="被执行的方法：" label-width="120px">
          <el-input
            v-model="form.method"
            type="textarea"
            autosize
            :readonly="true"
          />
        </el-form-item>
        <el-form-item label="数据内容：" label-width="120px">
          <el-input
            v-model="form.params"
            type="textarea"
            autosize
            :readonly="true"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

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
    handleEdit(index, row) {
      this.form = row
      this.dialogFormVisible = true
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
      this.$axios.post(this.$url + 'log/showLoggers', params).then((res) => {
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
