<template>
<div>
  <el-table
    :data="tableData"
    :max-height="maxHeight"
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
      v-if="!item.isOperation"
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
      <template slot-scope="scope" v-for="operation in item.operations">
        <el-button v-if="operation === 'modify'" 
          :key="operation"
          icon="el-icon-edit"
          type="primary"
          size="small"
          @click="handleModifyData(scope.row)">修 改</el-button>
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
      tableData: [],
      selectData: [],
      baseParameters: {
        currentPage: 1,
        pageSize: 10
      },
      totalQuantity: 0
    }
  },
  methods: {
    async getTableDate (extensionParameters) {
      let searchParameters = $.extend({}, this.baseParameters, extensionParameters)
      const result = await this.api.post(this.tableSearchUrl, searchParameters)
      if (result != null) {
        this.totalQuantity = result.totalElements
        this.tableData = result.content
      }
    },
    handleSizeChange (val) {
      this.baseParameters.pageSize = val
      this.getTableDate()
    },
    handleCurrentChange (val) {
      this.baseParameters.currentPage = val
      this.getTableDate()
    },
    handleSelectionChange (selection) {
      this.selectData = selection
    },
    getSelectData () {
      return this.selectData
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
