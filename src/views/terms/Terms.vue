<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" style="margin-top: 30px;margin-left:30px">
      <el-form-item label="选择法规：">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 400px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-button type="primary" style="margin-left: 500px">新增目录</el-button>
    </el-form>
    <el-table
      stripe
      :default-sort="{prop: 'date', order: 'descending'}"
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
    >
      <el-table-column
        prop="no"
        label="条款号"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="条款号别名"
        width="300"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="no"
        label="条款标题"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="所属法规名称"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.name }}</p>
            <p>地址: {{ scope.row.address }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.address }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="版本号"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
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
            @click="handleDelete(scope.$index, scope.row.sid)"
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
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      formInline: {
        user: '',
        region: ''
      },
      value: '',
      tableData: [{
        no: '20',
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        no: '21',
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        no: '22',
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        no: '23',
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>
