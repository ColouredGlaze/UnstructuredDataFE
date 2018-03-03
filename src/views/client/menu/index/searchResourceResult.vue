<template>
<div style="width: 83%; margin: 0 auto;">
  <el-table
    :data="tableData"
    :show-header="false"
    :height="700"
    stripe>
    <el-table-column label="资源">
      <template slot-scope="scope">
        <el-row class="designation">
          <a @click="resourceDetail(scope.row)"><span v-html="scope.row.designation"></span></a>
          <span class="extend-option" @click="downloadResource(scope.row)"><icon name="download" scale="2"></icon></span>
          <span class="extend-option" @click="collectResource(scope.row)">
            <icon v-if="scope.row.collected" name="isCollected" scale="2"></icon>
            <icon v-else name="isNotCollected" scale="2"></icon>
          </span>
        </el-row>
        <el-row><span class="hightlight-container" v-html="scope.row.highlight"></span></el-row>
        <el-row class="information">
          <el-col :span="4">上传者：{{scope.row.author}}</el-col>
          <el-col :span="3">收藏次数：{{scope.row.collectionNum}}</el-col>
          <el-col :span="3">下载次数：{{scope.row.downloadNum}}</el-col>
          <el-col :span="5">上传日期：{{scope.row.uploadTime}}</el-col>          
        </el-row>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination
      id="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalQuantity">
    </el-pagination>
  </div>

  <TreeDialog
      ref="treeDialog"
      title="选择所属收藏夹"
      width="30%"
      :center="true"
      initTreeDialogUrl="/CollectionFolderApi/getParentTree"
      v-on:getChooseNode="getChooseNode"></TreeDialog>
</div>
</template>

<script>
import TreeDialog from '@/components/TreeDialog.vue'
export default {
  data () {
    return {
      keyword: null,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalQuantity: 0,
      collectionParameters: {
        collectionFolderId: null,
        objId: null
      },
      collectOptionUrl: null,
      chooseResource: null,
      collectionNumChange: 0
    }
  },
  methods: {
    resourceDetail (resource) {
      this.$emit('indexRouterMethods', 'resourceDetail', resource.resourceId)
    },
    // 将收藏资源和取消收藏资源放在一个函数里面处理
    async getChooseNode (chooseNode) {
      if (chooseNode !== null) {
        this.collectionParameters.collectionFolderId = chooseNode.id
      } else {
        // 收藏资源时chooseNode !== null
        if (!this.resource.collected) {
          this.$message.info('请选择资源所在的收藏夹')
          return
        }
      }
      const result = await this.api.post(this.collectOptionUrl, this.collectionParameters)
      if (result !== null) {
        this.resource.collected = !this.resource.collected
        this.resource.collectionNum += this.collectionNumChange
        this.$refs.treeDialog.closeTreeDialog()
      }
    },
    collectResource (resource) {
      this.resource = resource
      if (resource.collected) {
        this.collectOptionUrl = '/CollectionApi/cancelCollectResource'
        this.collectionNumChange = -1
        this.getChooseNode(null)
      } else {
        this.$refs.treeDialog.showTreeDialog()
        this.collectionNumChange = 1
        this.collectOptionUrl = '/CollectionApi/collectResource'
      }
      this.collectionParameters.objId = resource.resourceId
    },
    downloadResource (resourceEs) {
      this.api.download({resourceId: resourceEs.resourceId, esId: resourceEs.id})
      resourceEs.downloadNum += 1
    },
    async getTableDate () {
      const result = await this.api.post('/ResourceEsApi/searchFromEs',
      {currentPage: this.currentPage, pageSize: this.pageSize, keyword: this.keyword})
      if (result !== null) {
        this.totalQuantity = result.totalElements
        this.tableData = result.content
      }
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
  watch: {
    '$route' (to, from) {
      this.keyword = this.$route.params.keyword
      this.getTableDate()
    }
  },
  mounted () {
    this.keyword = this.$route.params.keyword
    this.$refs.treeDialog.initTreeDialogData(null)
    this.getTableDate()
  },
  components: {
    TreeDialog
  }
}
</script>

<style scoped>
.extend-option:hover {
  cursor: pointer;
}
.extend-option {
  margin-left: 13px;
}
.information {
  color: rgb(119, 127, 134);
  margin-top: 10px;
  font-size: 11px;
}
.hightlight-container {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.designation {
  font-size: 1.1em;
  -webkit-margin-before: 5px;
  -webkit-margin-after: 10px;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
   font-weight: bold;
   margin-top: 6px;
   margin-bottom: 6px;
}
.pagination-container{
  background-color: white;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}
.pagination-container .el-pagination{
  font-weight: normal;
}
</style>
