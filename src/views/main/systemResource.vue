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
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" ref="tableData" style="width: 100%" max-height="730" @select="tableSelect" @select-all="tableSelect" border stripe>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="designation" label="资源名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="classify" label="所属分类"></el-table-column>
        <el-table-column prop="dissertation" label="所属专题"></el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="resourceType" label="资源类型"></el-table-column>
        <el-table-column prop="resourceSize" label="资源大小">
          <template slot-scope="scope">
            <span>{{scope.row.resourceSize}} KB</span>
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
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

    <el-dialog title="选择所属分类" :visible.sync="chooseClassifyIdDialogVisible" width="30%" center>
      <el-tree :data="classifyIdTree" @node-click="chooseclassifyId" ></el-tree>
      <span slot="footer">
        <el-button @click="confirmClassifyId" type="primary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'ResourceTemp',
  data () {
    return {
      inputValue: null,
      resourceTypes: [],
      classifyIdTree: [],
      auditStatusOption: [],
      currentChooseClassifyDesignation: null,
      currentChooseClassify: null,
      searchResourceTemp: {
        keyWord: null
      },
      uploadForm: {
        designation: '',
        classifyId: '',
        resourceType: '',
        description: '',
        resourceSize: 0,
        tags: []
      },
      chooseClassifyIdDialogVisible: false,
      tableData: [],
      auditData: [],
      currentPage: 1,
      pageSize: 12,
      totalQuantity: 0
    }
  },
  methods: {
    downloadResource (resource) {
      let resourceName = resource.designation
      let temp = resourceName
      let index = 0
      do {
        index = temp.indexOf('.')
        temp = temp.substring(index + 1)
      } while (index !== -1)
      const resourceFileName = resource.id + resourceName.substring(resourceName.indexOf(temp) - 1)
      this.api.download('/FileApi/download', {resourceName: resourceName, resourceFileName: resourceFileName})
    },
    chooseclassifyId (node) {
      this.currentChooseClassify = node
    },
    auditResourceTemp () {
      if (this.auditData.length === 0) {
        this.$message.info('请选择要审核的资源')
        return
      }
      this.auditResourceForm.resourceTemps = this.auditData
      this.auditResourceDialogVisible = true
    },
    confirmResourceType () {
      this.currentChooseResourceTypeDesignation = this.currentChooseType.designation
      this.uploadForm.reourceType = this.currentChooseReourceType.code
      this.chooseResourceTypeDialogVisible = false
    },
    confirmClassifyId () {
      this.currentChooseClassifyDesignation = this.currentChooseClassify.label
      this.uploadForm.classifyId = this.currentChooseClassify.id
      this.chooseClassifyIdDialogVisible = false
    },
    async initResourceType () {
      const result = await this.api.post('/DigitalDictionaryApi/getChildrenForSelect', {parentCode: '003'})
      if (result !== null) {
        this.resourceTypes = result
        this.uploadForm.resourceType = this.resourceTypes[0].code
      }
    },
    async initClassifyIds () {
      const result = await this.api.post('/ClassifyApi/getParentTree', {classifyType: '006001'})
      // 初始化资源所属类别选项
      if (result !== null) {
        this.classifyIdTree = result
      }
    },
    async getTableDate () {
      const result = await this.api.post('/ResourceTempApi/search',
      {currentPage: this.currentPage, pageSize: this.pageSize, keyWord: this.searchResourceTemp.keyWord})
      if (result != null) {
        this.totalQuantity = result.totalElements
        this.tableData = result.content
      }
    },
    init () {
      this.getTableDate()
      this.initClassifyIds()
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
      this.auditData = selection
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

