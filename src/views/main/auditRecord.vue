<template>
  <div class="dissertation-manage">
    <div class="table-container">
      <el-table :data="tableData" ref="tableData" style="width: 100%" max-height="730" border stripe>
        <el-table-column prop="resourceTempDesignation" label="审核资源名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="auditor" label="审核人"></el-table-column>
        <el-table-column prop="operation" label="审核操作"></el-table-column>
        <el-table-column prop="status" label="资源审核状态"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="auditTime" label="审核时间"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
      const result = await this.api.post('/AuditApi/search',
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

