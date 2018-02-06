<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="5">
        <el-input v-model="searchParameters.designation" placeholder="请输入名称">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :span="2"><el-button @click="getTableData" type="primary">搜 索</el-button></el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <SearchResultTable
        :tableColumn="tableColumn"
        :maxHeight="570"
        tableSearchUrl="/ResourceUploadApi/search"
        ref="uploadRecordTable"></SearchResultTable>
    </el-row>
  </div>
</template>

<script>
import SearchResultTable from '@/components/SearchResultTable.vue'
export default {
  data () {
    return {
      searchParameters: {
        designation: null
      },
      tableColumn: []
    }
  },
  methods: {
    getTableData () {
      this.$refs.uploadRecordTable.getTableData(this.searchParameters)
    },
    init () {
      this.tableColumn = [
        {prop: 'designation', label: '资源名称', sot: true},
        {prop: 'classify', label: '所属分类', sot: true},
        {prop: 'auditStatus', label: '审核状态', width: '100'},
        {prop: 'uploadTime', label: '上传时间', width: '159'}
      ]
      this.getTableData()
    }
  },
  mounted () {
    this.init()
  },
  components: {
    SearchResultTable
  }
}
</script>
