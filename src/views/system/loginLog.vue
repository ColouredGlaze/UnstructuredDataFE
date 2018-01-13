<template>
  <div class="dissertation-manage">
    <div class="table-container">
      <el-table :data="tableData" ref="tableData" style="width: 100%" max-height="730" border stripe>
        <el-table-column prop="userName" label="用户名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userType" label="用户类型"></el-table-column>
        <el-table-column prop="status" label="用户状态"></el-table-column>
        <el-table-column prop="passwordErrorTime" label="密码错误次数"></el-table-column>
        <el-table-column prop="result" label="登录结果"></el-table-column>
        <el-table-column prop="loginTime" label="登录时间"></el-table-column>
        <el-table-column prop="exitTime" label="登出时间"></el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
        <el-pagination
          id="pagination"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[12, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalQuantity">
        </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dissertation',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 12,
      totalQuantity: 0
    }
  },
  methods: {
    async getTableDate () {
      const result = await this.api.post('/LoginLogApi/search',
      {currentPage: this.currentPage, pageSize: this.pageSize, keyWord: null})
      if (result != null) {
        this.totalQuantity = result.totalElements
        this.tableData = result.content
      }
    },
    async init () {
      await this.getTableDate()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getTableDate()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableDate()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
.digital-dictionary .el-dialog--center .el-dialog__body{
  padding: 25px 27px 0px;
}
.pagination-container{
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}
.pagination-container .el-pagination{
  font-weight: normal;
}
</style>

