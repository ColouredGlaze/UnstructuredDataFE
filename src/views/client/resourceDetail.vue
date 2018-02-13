<template>
<div>
<el-row :gutter="20">
  <el-col :span="18">
    <el-card style="min-height: 780px; max-height: 780px;">
      <div>
        <img v-if="resource.designation.substring(resource.designation.lastIndexOf('.') + 1) === 'doc'" 
          src="../../assets/doc.png" width="50" height="50" class="extendImage">
        <img v-else-if="resource.designation.substring(resource.designation.lastIndexOf('.') + 1) === 'docx'" 
          src="../../assets/docx.png" width="50" height="50" class="extendImage">
        <img v-else-if="resource.designation.substring(resource.designation.lastIndexOf('.') + 1) === 'pdf'" 
          src="../../assets/pdf.png" width="50" height="50" class="extendImage">
        <img v-else-if="resource.designation.substring(resource.designation.lastIndexOf('.') + 1) === 'ppt'" 
          src="../../assets/ppt.png" width="50" height="50" class="extendImage">
        <img v-else-if="resource.designation.substring(resource.designation.lastIndexOf('.') + 1) === 'pptx'" 
          src="../../assets/pptx.png" width="50" height="50" class="extendImage">
        <img v-else-if="resource.designation.substring(resource.designation.lastIndexOf('.') + 1) === 'txt'" 
          src="../../assets/txt.png" width="50" height="50" class="extendImage">
        <img v-else-if="resource.designation.substring(resource.designation.lastIndexOf('.') + 1) === 'xls'" 
          src="../../assets/xls.png" width="50" height="50" class="extendImage">
        <img v-else-if="resource.designation.substring(resource.designation.lastIndexOf('.') + 1) === 'xlsx'" 
          src="../../assets/xlsx.png" width="50" height="50" class="extendImage">
        <img v-else
          src="../../assets/file.png" width="50" height="50" class="extendImage">
        <span class="resourceDesignation">{{resource.designation}}</span>
        <span class="extend-option" @click="downloadResource()"><icon name="download" scale="2"></icon></span>
        <span class="extend-option" @click="collectResource()">
          <icon v-if="collected" name="isCollected" scale="2"></icon>
          <icon v-else name="isNotCollected" scale="2"></icon>
        </span>
      </div>
      <div style="padding-top: 10px;" class="resourceDescription">
        <el-col :span="2"><p>资源描述</p></el-col>
        <el-col :span="22">
          <p v-if="typeof resource.description !== 'undefined'">{{resource.description}}</p>
          <p v-else class="description">无资源描述</p>
        </el-col>
      </div>
      <div>
        <el-col :span="6"><span class="information">资源类型：{{resource.type}}</span></el-col>
        <el-col :span="6"><span class="information">资源大小：{{resource.resourceSize}} KB</span></el-col>
        <el-col :span="6"><span class="information">下载次数：{{resource.downloadNum}} 次</span></el-col>
        <el-col :span="6"><span class="information">收藏次数：{{resource.collectionNum}} 次</span></el-col>
      </div><br/>
      <div>
        <el-col :span="8"><span class="information">所属分类：{{resource.classify}}</span></el-col>
        <el-col :span="8"><span class="information">所属专题：{{resource.dissertation}}</span></el-col>
        <el-col :span="8"><span class="information">上传时间：{{resource.uploadTime}}</span></el-col>
      </div><br/>
      <hr/>
      <el-table
        height="390"
        :data="commentData"
        :show-header="false"
        empty-text="暂无评论"
        stripe>
        <el-table-column label="评论内容">
          <template slot-scope="scope">
            <span class="observer">{{scope.row.observer}}</span>
            <span class="commentTime">{{scope.row.commentTime}}</span><br/>
            {{scope.row.content}}
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
      <div class="discuss">
        <el-input v-model="resourceComment.content" :rows="3" placeholder="请输入评论内容" type="textarea"></el-input>
        <el-button @click="saveComment" type="primary" style="float: right; margin-top: 20px;">发表评论</el-button>
      </div>
    </el-card>
  </el-col>
  <el-col :span="6">
    <el-card style="text-align:center">
      <div slot="header">
        <span>作者信息</span>
      </div>
      <div>
        <span class="author-info author-name">作者：{{authorInfo.authorName}}</span>
        <span class="author-info">个人简介：{{authorInfo.description}}</span>
        <span class="author-info">性别：{{authorInfo.sex}}</span>
        <span class="author-info">职业：{{authorInfo.profession}}</span>
        <span class="author-info">邮箱：{{authorInfo.email}}</span>
      </div>
    </el-card>
  </el-col>
</el-row>
  <TreeDialog
    ref="treeDialog"
    title="选择所属收藏夹"
    width="30%"
    :center="true"
    initTreeDialogUrl="/CollectionFolderApi/getParentTree"
    v-on:getChooseNode="handleChooseNode"></TreeDialog>
</div>
</template>

<script>
import TreeDialog from '@/components/TreeDialog.vue'
export default {
  data () {
    return {
      authorInfo: {},
      commentData: [],
      collected: false,
      resource: {
        designation: ''
      },
      resourceComment: {
        resourceId: null,
        content: ''
      },
      collectOptionUrl: null,
      collectionNumChange: 0,
      collectionParameters: {
        objId: null,
        collectionFolderId: null
      },
      currentPage: 1,
      pageSize: 10,
      totalQuantity: 0
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.initCommentData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initCommentData()
    },
    async saveComment () {
      console.log(this.resourceComment.content.length)
      if (this.resourceComment.content.length === 0) {
        this.$message.info('请输入评论内容!')
        return
      }
      const result = await this.api.post('/ResourceCommentApi/save', this.resourceComment)
      if (result !== null) {
        this.resourceComment.content = ''
        this.initCommentData()
      }
    },
    async handleChooseNode (chooseNode) {
      if (chooseNode !== null) {
        this.collectionParameters.collectionFolderId = chooseNode.id
      } else {
        // 收藏资源时chooseNode !== null
        if (!this.collected) {
          this.$message.info('请选择资源所在的收藏夹')
          return
        }
      }
      const result = await this.api.post(this.collectOptionUrl, this.collectionParameters)
      if (result !== null) {
        this.collected = !this.collected
        this.resource.collectionNum += this.collectionNumChange
        this.$refs.treeDialog.closeTreeDialog()
      }
    },
    collectResource () {
      if (this.collected) {
        this.collectOptionUrl = '/CollectionApi/cancelCollectResource'
        this.collectionNumChange = -1
        this.handleChooseNode(null)
      } else {
        this.$refs.treeDialog.showTreeDialog()
        this.collectionNumChange = 1
        this.collectOptionUrl = '/CollectionApi/collectResource'
      }
      this.collectionParameters.objId = this.resource.id
    },
    downloadResource () {
      this.api.download({resourceId: this.resource.id, esId: this.resource.esId})
      this.resource.downloadNum += 1
    },
    async initAuthorInfo () {
      const result = await this.api.post('/ResourceApi/getAuthorInfo', {resourceId: this.resourceComment.resourceId})
      if (result !== null) {
        this.authorInfo = result
      }
    },
    async initCommentData () {
      const result = await this.api.post('/ResourceCommentApi/getCommentByResourceId',
      {currentPage: this.currentPage, pageSize: this.pageSize, resourceId: this.resourceComment.resourceId})
      if (result !== null) {
        this.totalQuantity = result.totalElements
        this.commentData = result.content
      }
    },
    async initResourceInfo () {
      const result = await this.api.post('/ResourceApi/getResourceDetail', {id: this.resourceComment.resourceId})
      if (result !== null) {
        this.resource = result
      }
      const collected = await this.api.post('/CollectionApi/isCollected', {objId: this.resource.id})
      if (collected !== null) {
        this.collected = collected
      }
    },
    init () {
      this.initResourceInfo()
      this.initCommentData()
      this.initAuthorInfo()
      this.$refs.treeDialog.initTreeDialogData(null)
    }
  },
  mounted () {
    this.resourceComment.resourceId = this.$route.params.resourceId
    this.init()
  },
  components: {
    TreeDialog
  }
}
</script>

<style scoped>
.description {
  color: rgb(119, 127, 134);
  font-size: 15px;
}
.author-info {
  display: block;
  -webkit-margin-before: 1.33em;
  -webkit-margin-after: 1.33em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
}
.author-name {
  font-weight: 550;
  font-size: 1.2em;
  color: coral;
}
.commentTime{
  display: block;
  float: left;
  color: rgb(180, 178, 178);
  font-size: 14px;
}
.observer{
  color: rgb(64, 147, 198);
  float: left;
  font-size: 14px;
  margin-right: 15px;
}
.pagination-container{
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
}
.pagination-container .el-pagination{
  font-weight: normal;
}
.extend-option:hover {
  cursor: pointer;
}
.extend-option {
  margin-left: 13px;
}
.discuss{
  bottom: 0px;
}
.resourceDescription{
  color: rgb(89, 98, 104);
  font-size: 15px;
}
.information {
  color: rgb(119, 127, 134);
  margin-top: 10px;
  font-size: 13px;
}
.resourceDesignation{
  font-weight: 550;
  font-size: 1.0em;
  color: coral;
  padding-left: 20px;
}
</style>
