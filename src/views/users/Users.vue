<template>
  <div>
    <el-table
      v-loading="loading"
      stripe
      :default-sort="{prop: 'vip', order: 'descending'}"
      :data="tableData.filter(data => !search || data.uname.toLowerCase().includes(search.toLowerCase()) ||
        data.mobile.includes(search))"
    >
      <el-table-column
        prop="uname"
        label="姓名"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.uname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.gender == 1 ? '女':'男' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="vip"
        label="会员类型"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.vip == 1 ? 'VIP会员':'普通会员' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.status == 1 ? '正常':'禁用' }}</span>
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
            type="danger"
            @click="handleEdit(scope.$index, scope.row)"
          >管理</el-button>
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

    <el-dialog title="用户管理" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="会员类型" label-width="120px">
          <el-select v-model="form.vip" placeholder="请选择会员类型">
            <el-option label="普通会员" :value="0" />
            <el-option label="VIP会员" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="会员管理" label-width="120px">
          <el-select v-model="form.status" placeholder="请选择会员类型">
            <el-option label="禁用" :value="0" />
            <el-option label="正常" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSumbit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'User',
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
      console.log(index, row)
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
      this.$axios.post(this.$url + 'usr/getUsers', params).then((res) => {
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
    },
    onSumbit() {
      this.$axios.post(this.$url + 'usr/update', this.form).then((res) => {
        if (res.data.code === 2001) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogFormVisible = false
        }
        if (res.data.code === 3001) {
          this.$message.error('修改失败')
        }
      })
    }
  }
}
</script>
