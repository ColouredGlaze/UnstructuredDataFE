<template>
<div>
  <el-table
    :data="tableData"
    :max-height="maxHeight"
    :height="height"
    :border="border"
    :stripe="stripe"
    @selection-change="handleSelectionChange"
    style="width: 100%">
    <el-table-column
      v-if="selectable"
      type="selection"
      width="34">
    </el-table-column>
    <el-table-column 
      v-for="item in tableColumn"
      v-if="!item.showContent && !item.isOperation"
      :key="item.prop" 
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      :show-overflow-tooltip="item.sot">
    </el-table-column>
    <el-table-column
      v-else
      :label="item.label"
      :width="item.width">
      <template slot-scope="scope">
        <el-button v-if="operationModify"
          icon="el-icon-edit"
          type="primary"
          size="small"
          @click="handleModifyData(scope.row)">修 改</el-button>
        <el-button v-if="operationDownload"
          icon="el-icon-download"
          type="primary"
          size="small"
          @click="download(scope.row)">下 载</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination
      id="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="baseParameters.currentPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="baseParameters.pageSize"
      :total="totalQuantity"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</div>
</template>

<script scoped>
export default {
  data () {
    return {
      operationDownload: false,
      operationModify: false,
      tableData: [],
      selectData: [],
      baseParameters: {
        currentPage: 1,
        pageSize: 10
      },
      totalQuantity: 0,
      inited: false
    }
  },
  methods: {
    async getTableData (extensionParameters) {
      let searchParameters = $.extend({}, this.baseParameters, extensionParameters)
      const result = await this.api.post(this.tableSearchUrl, searchParameters)
      if (result != null) {
        this.totalQuantity = result.totalElements
        this.tableData = result.content
      }
      if (!this.inited) {
        this.initTableOperation()
      }
    },
    // 初始化表格操作列
    initTableOperation () {
      for (let i = 0; i < this.tableColumn.length; i++) {
        if (this.tableColumn[i].isOperation) {
          for (let j = 0; j < this.tableColumn[i].operations.length; j++) {
            switch (this.tableColumn[i].operations[j]) {
              case 'modify':
                this.operationModify = true
                break
              case 'download':
                this.operationDownload = true
                break
              default:
                break
            }
          }
          break
        }
      }
      this.inited = true
    },
    handleSizeChange (val) {
      this.baseParameters.pageSize = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.baseParameters.currentPage = val
      this.getTableData()
    },
    handleSelectionChange (selection) {
      this.selectData = selection
    },
    getSelectData () {
      return this.selectData
    }
  },
  watch: {
    tableColumn (val) {
      this.inited = false
    }
  },
  props: {
    tableColumn: {
      type: Array
    },
    tableSearchUrl: {
      type: String,
      default: null
    },
    height: {
      type: Number
    },
    maxHeight: {
      type: Number
    },
    selectable: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    handleModifyData: {
      type: Function
    },
    download: {
      type: Function
    }}
}
</script>

<style>
.pagination-container{
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}
.pagination-container .el-pagination{
  font-weight: normal;
}
</style>
