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
        tableSearchUrl="/ResourceDownloadApi/search"
        ref="downloadResourceTable"></SearchResultTable>
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
      this.$refs.downloadResourceTable.getTableData(this.searchParameters)
    },
    init () {
      this.tableColumn = [
        {prop: 'resourceName', label: '资源名称', sot: true},
        {prop: 'classify', label: '所属分类', sot: true},
        {prop: 'dissertation', label: '所属专题', sot: true},
        {prop: 'collected', label: '收藏情况', width: '77', sot: true},
        {prop: 'createTime', label: '下载时间', width: '159'}
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
