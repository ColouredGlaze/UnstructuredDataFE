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
        <el-button @click="uploadDialogVisible = true" type="primary" icon="el-icon-upload">上 传</el-button>
        <el-button @click="auditResourceTemp" type="primary" icon="el-icon-check">审 核</el-button>
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" ref="tableData" style="width: 100%" max-height="730" @select="tableSelect" @select-all="tableSelect" border stripe>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="designation" label="资源名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="operation" label="操作"></el-table-column>
        <el-table-column prop="classify" label="所属分类"></el-table-column>
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

    <el-dialog title="上传资源" :visible.sync="uploadDialogVisible"  width="36%" center>
      <el-form :model="uploadForm" :rules="uploadFormRules" ref="uploadFormRef"  label-width="79px">
        <el-form-item label="资源名称" prop="designation">
          <el-input v-model="uploadForm.designation" :disabled="true" placeholder="请选择文件"></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="classifyId">
          <el-input v-model="currentChooseClassifyDesignation" :disabled="true" placeholder="请选择资源所属的分类">
            <el-button slot="append" @click="chooseClassifyIdDialogVisible = true" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="resourceType">
          <el-select v-model="uploadForm.resourceType">
            <el-option v-for="item in resourceTypes" :key="item.code" :label="item.designation" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源标签" prop="tags">
          <el-tag
            :key="tag"
            v-for="tag in uploadForm.tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">加标签</el-button>
        </el-form-item>
        <el-form-item label="资源描述" prop="description">
          <el-input v-model="uploadForm.description" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            ref="upload"
            :limit="1"
            :auto-upload="false"
            :file-list="fileList"
            :data="uploadForm"
            :on-change="fileStatusChange"
            :on-exceed="onExceed"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            action="/ud/ResourceTempApi/upload">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">文件大小不可超过 130MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="submitUpload" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择所属分类" :visible.sync="chooseClassifyIdDialogVisible" width="30%" center>
      <el-tree :data="classifyIdTree" @node-click="chooseclassifyId" ></el-tree>
      <span slot="footer">
        <el-button @click="confirmClassifyId" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="审核资源" :visible.sync="auditResourceDialogVisible" width="30%" center>
      <el-form :model="auditResourceForm" :rules="auditResourceFormRules" ref="auditResourceForm">
        <el-form-item label="审核结果" prop="status">
          <el-select v-model="auditResourceForm.status">
            <el-option v-for="item in auditStatusOption" :key="item.code" :label="item.designation" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="auditResourceForm.remark" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="updateAuditData" type="primary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'ResourceTemp',
  data () {
    return {
      inputVisible: false,
      inputValue: null,
      fileList: [],
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
      uploadFormRules: {
        designation: [
          {required: true, message: '请选择要上传的资源', trigger: 'change'}
        ],
        description: [
          {max: 300, message: '描述资源的文字长度在 300 个字符以内', trigger: 'change'}
        ],
        classifyId: [
          {require: true, message: '请选择资源的分类，如果没有分类选项，请先添加资源分类', trigger: 'change'}
        ]
      },
      auditResourceFormRules: {
        remark: [
          {required: true, message: '请输入备注', trigger: 'change'},
          {min: 1, max: 300, message: '字符长度在 1 到 300 字符之间', trigger: 'change'}
        ]
      },
      auditResourceForm: {
        resourceTemps: [],
        status: null,
        remark: null
      },
      uploadDialogVisible: false,
      auditResourceDialogVisible: false,
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
    updateAuditData () {
      this.$refs['auditResourceForm'].validate(async (valid) => {
        if (valid) {
          const result = await this.api.post('/AuditApi/update', this.auditResourceForm)
          if (result !== null) {
            this.getTableDate()
            this.auditResourceDialogVisible = false
            this.$refs['auditResourceForm'].resetFields()
          }
        }
      })
    },
    handleClose (tag) {
      this.uploadForm.tags.splice(this.uploadForm.tags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        for (let i = 0; i < this.uploadForm.tags.length; i++) {
          if (this.uploadForm.tags[i] === inputValue) {
            this.$message.info('标签 ' + inputValue + ' 已存在')
            return
          }
        }
        this.uploadForm.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = null
    },
    // eslint-disable-next-line
    onError (error, file, fileList) {
      if (error.status === 500) {
        this.$message.error('服务器出错，请联系管理员')
      } else if (error.status === 504) {
        this.$message.error('连接超时，请重试')
      } else if (error.status === 404) {
        this.$message.error('请求的链接不存在，请联系管理员')
      } else {
        this.$message.error('发生未知错误')
      }
      this.$refs['uploadFormRef'].resetFields()
      this.uploadForm.designation = ''
      this.fileList = []
      this.currentChooseClassifyDesignation = null
      this.uploadDialogVisible = false
      this.getTableDate()
    },
    onSuccess (response, file, fileList) {
      if (response.code === 3) {
        this.$message.success(response.msg)
      } else {
        this.$message.warning(response.msg)
      }
      this.$refs['uploadFormRef'].resetFields()
      this.uploadForm.designation = ''
      this.fileList = []
      this.currentChooseClassifyDesignation = null
      this.uploadDialogVisible = false
      this.getTableDate()
    },
    beforeUpload (file) {
      if ((file.size / (1024 * 1024)) > 130) {
        this.$message.info('文件大小不能超过 130 MB')
        return false
      }
      return true
    },
    fileStatusChange (file, fileList) {
      this.uploadForm.designation = file.name
      this.uploadForm.resourceSize = this.getFileSize(file)
    },
    submitUpload () {
      if (this.uploadForm.classifyId === null) {
        this.$message.info('请选择资源的分类，如果没有分类选项，请先添加资源分类')
        return
      }
      this.$refs['uploadFormRef'].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
        }
      })
    },
    onExceed (files, fileList) {
      this.fileList[0] = files[0]
      this.uploadForm.designation = this.fileList[0].name
      this.uploadForm.resourceSize = this.getFileSize(this.fileList[0])
      this.$message.info('一次只能上传一个资源')
    },
    getFileSize (file) {
      return file.size / 1024
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
    async initAuditStatusOption () {
      const result = await this.api.post('/DigitalDictionaryApi/getChildrenForSelect', {parentCode: '005'})
      if (result !== null) {
        this.auditStatusOption = result
        for (let i = 0; i < this.auditStatusOption.length; i++) {
          if (this.auditStatusOption[i].code === '005003') {
            this.auditStatusOption.splice(i, 1)
            break
          }
        }
        this.auditResourceForm.status = this.auditStatusOption[0].code
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
      this.initAuditStatusOption()
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

