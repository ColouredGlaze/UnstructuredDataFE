<template>
  <div class="resourceTemp-manage">
    <el-row>
      <el-col :span="6">
        <el-form ref="searchResourceTempForm" :model="searchResourceTemp" :inline="true">
          <el-form-item label="关键词：">
            <el-input v-model="searchResourceTemp.keyWord"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchByKeyWord" type="primary" icon="el-icon-search">搜 索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="18" style="text-align: right;">
        <el-button @click="modifyDissertation" type="primary" icon="el-icon-edit">修改专题</el-button>
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" ref="tableData" style="width: 100%" max-height="730" @select="tableSelect" @select-all="tableSelect" border stripe>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="designation" label="资源名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="classify" label="所属分类"></el-table-column>
        <el-table-column prop="dissertation" label="所属专题"></el-table-column>
        <el-table-column prop="resourceType" label="资源类型"></el-table-column>        
        <el-table-column prop="description" label="资源描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="resourceSize" label="资源大小">
          <template slot-scope="scope">
            <span>{{scope.row.resourceSize}} KB</span>
          </template>
        </el-table-column>
        <el-table-column prop="downloadNum" label="下载数"></el-table-column>
        <el-table-column prop="collectionNum" label="收藏数"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="下载" width="100">
          <template slot-scope="scope">
            <el-button @click="downloadResource(scope.row)" type="primary">下 载</el-button>
          </template>
        </el-table-column>
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

    <el-dialog title="选择所属专题" :visible.sync="chooseDissertationIdDialogVisible" width="30%" center>
      <el-tree :data="dissertationIdTree" @node-click="chooseDissertation"></el-tree>
      <span slot="footer">
        <el-button @click="confirmDissertationId" type="primary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'ResourceTemp',
  data () {
    return {
      dissertationIdTree: [],
      chooseDissertationIdDialogVisible: false,
      searchResourceTemp: {
        keyWord: null
      },
      tableData: [],
      modifyDissertationData: [],
      currentPage: 1,
      pageSize: 12,
      totalQuantity: 0
    }
  },
  methods: {
    modifyDissertation () {
      if (this.modifyDissertationData.length <= 0) {
        this.$message.info('请选择要修改专题的资源')
        return
      }
      this.chooseDissertationIdDialogVisible = true
    },
    downloadResource (resource) {
      this.api.download('/FileApi/download', resource.id)
    },
    chooseDissertation (node) {
      this.currentChooseDissertation = node
    },
    confirmDissertationId () {
      if (this.currentChooseDissertation === null) {
        this.$message.info('请选择要修改的专题')
        return
      }
      this.$confirm('请确认将选中的 ' + this.modifyDissertationData.length + ' 个资源的专题修改为：' + this.currentChooseDissertation.label,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let modifyData = {resources: this.modifyDissertationData, dissertationId: this.currentChooseDissertation.id}
          const result = await this.api.post('/ResourceApi/modifyDissertation', modifyData)
          if (result !== null) {
            this.getTableDate()
            this.chooseDissertationIdDialogVisible = false
          }
        }).catche(() => {
          this.chooseDissertationIdDialogVisible = false
          this.$message.info('您取消了修改资源所属的专题')
        })
    },
    async initResourceType () {
      const result = await this.api.post('/DigitalDictionaryApi/getChildrenForSelect', {parentCode: '003'})
      if (result !== null) {
        this.resourceTypes = result
      }
    },
    async initDissertationIds () {
      const result = await this.api.post('/DissertationApi/getParentTree')
      if (result !== null) {
        this.dissertationIdTree = result
      }
    },
    async getTableDate () {
      const result = await this.api.post('/ResourceApi/search',
      {currentPage: this.currentPage, pageSize: this.pageSize, keyWord: this.searchResourceTemp.keyWord})
      if (result != null) {
        this.totalQuantity = result.totalElements
        this.tableData = result.content
      }
    },
    init () {
      this.getTableDate()
      this.initDissertationIds()
      this.initResourceType()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getTableDate()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableDate()
    },
    tableSelect (selection) {
      this.modifyDissertationData = selection
    },
    searchByKeyWord () {
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

