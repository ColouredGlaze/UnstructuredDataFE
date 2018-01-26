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
      :key="item.prop" 
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      :show-overflow-tooltip="item.sot">
    </el-table-column>
    <el-table-column
      :v-if="revisability"
      width="96">
      <template slot-scope="scope">
        <el-button v-if="revisability" type="primary" icon="el-icon-edit" @click="handleModify(scope.row)" size="small">修 改</el-button>
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
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalQuantity">
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
    handleModify (data) {
      this.$emit('handleModifyData', data)
    },
    getSelectData () {
      return this.selectData
    }
  },
  props: ['tableColumn', 'tableSearchUrl', 'maxHeight', 'selectable', 'border', 'stripe', 'revisability']
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
