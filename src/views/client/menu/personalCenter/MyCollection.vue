<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="5">
        <el-input v-model="searchParameters.designation" placeholder="请输入名称">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :span="2"><el-button @click="getTableData" type="primary">搜 索</el-button></el-col>
      <el-col :span="17">
        <el-button @click="cancelCollection" type="primary" icon="el-icon-delete" style="float: right;">取消收藏</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <SearchResultTable
        :selectable="true"
        :tableColumn="tableColumn"
        :maxHeight="570"
        :handleModifyData="modifyCollectionData"
        :download="download"
        tableSearchUrl="/CollectionApi/search"
        ref="myCollectionTable"></SearchResultTable>
    </el-row>

    <TreeDialog
      ref="treeDialog"
      title="修改所属收藏夹"
      width="30%"
      initTreeDialogUrl="/CollectionFolderApi/getParentTree"
      v-on:getChooseNode="getChooseNode"></TreeDialog>
  </div>
</template>

<script>
import SearchResultTable from '@/components/SearchResultTable.vue'
import TreeDialog from '@/components/TreeDialog.vue'
export default {
  data () {
    return {
      searchParameters: {
        designation: null
      },
      collectionForm: null,
      tableColumn: []
    }
  },
  methods: {
    async getChooseNode (chooseNode) {
      if (chooseNode === null) {
        return
      }
      this.collectionForm.collectionFolderId = chooseNode.id
      this.$refs.treeDialog.closeTreeDialog()
      const result = await this.api.post('/CollectionApi/update', this.collectionForm)
      if (result !== null) {
        this.getTableData()
      }
    },
    download (resource) {
      this.api.download({resourceId: resource.resourceId, esId: resource.esId})
      resource.downloadNum += 1
      this.$emit('refreshUserInfo')
    },
    getTableData () {
      this.$refs.myCollectionTable.getTableData(this.searchParameters)
    },
    modifyCollectionData (modifyData) {
      this.collectionForm = modifyData
      this.$refs.treeDialog.showTreeDialog()
    },
    cancelCollection () {
      const selectData = this.$refs.myCollectionTable.getSelectData()
      if (selectData.length === 0) {
        this.$message.info('请选择要取消收藏的资源')
        return
      }
      this.$confirm('此操作将会取消收藏选中的资源，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await this.api.post('/CollectionApi/delete', selectData)
        if (result !== null) {
          this.getTableData()
          this.$emit('refreshUserInfo')
        }
      })
    },
    init () {
      this.tableColumn = [
        {prop: 'designation', label: '资源名称', width: '190', sot: true},
        {prop: 'author', label: '作者', sot: true},
        {prop: 'downloadNum', label: '下载次数', width: '77'},
        {prop: 'folder', label: '所在收藏夹', width: '190', sot: true},
        {prop: 'createTime', label: '收藏日期', width: '159'},
        {prop: 'operation', label: '操作', width: '188', isOperation: true, operations: ['modify', 'download']}
      ]
      this.getTableData()
      this.$refs.treeDialog.initTreeDialogData(null)
    }
  },
  mounted () {
    this.init()
  },
  components: {
    SearchResultTable, TreeDialog
  }
}
</script>
