<template>
  <div class="dissertation-manage">
    <el-row>
      <el-col :span="6">
        <el-form ref="searchDissertationForm" :model="searchDissertation" :inline="true">
          <el-form-item label="关键词：">
            <el-input v-model="searchDissertation.keyWord"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchByKeyWord" type="primary" icon="el-icon-search">搜 索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="18" style="text-align: right;">
        <el-button @click="newDialogVisible = true" type="primary" icon="el-icon-edit">新增专题</el-button>
        <el-button @click="deleteDissertation" type="primary" icon="el-icon-delete">删除专题</el-button>
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" ref="tableData" style="width: 100%" max-height="730" @select="tableSelect" @select-all="tableSelect" border stripe>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="designation" label="专题名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parent" label="父级专题"></el-table-column>
        <el-table-column prop="classify" label="所属分类"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="collectionNum" label="收藏数"></el-table-column>
        <el-table-column prop="uploadNum" label="上传数"></el-table-column>
        <el-table-column prop="downloadNum" label="下载数"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="编辑" width="100">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="primary">修 改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
        <el-pagination
          id="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[12, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalQuantity">
        </el-pagination>
    </div>
    <el-dialog title="新增专题" :visible.sync="newDialogVisible" width="36%" center>
      <el-form :model="newDissertationForm" ref="newDissertationForm" :rules="dissertationRules" label-width="79px" >
        <el-form-item label="名称" prop="designation">
          <el-input v-model="newDissertationForm.designation" placeholder="请输入专题名称"></el-input>
        </el-form-item>
        <el-form-item label="父级专题" prop="parentId">
          <el-input v-model="currentChooseParentDesignation" placeholder="请选择父级专题" :disabled="true">
            <el-button @click="chooseParentIdDialogVisible = true" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item v-show="isParent" label="所属分类" prop="classifyId">
          <el-input v-model="currentChooseClassifyDesignation" placeholder="请选择该专题所属分类" :disabled="true">
            <el-button @click="chooseClassifyIdDialogVisible = true" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="newDissertationForm.description" placeholder="请描述该专题" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="newDialogVisible = false">取 消</el-button>
        <el-button @click="addDissertation" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改专题" :visible.sync="modifyDialogVisible" width="36%" center>
      <el-form :model="modifyDissertationForm" ref="modifyDissertationForm" :rules="dissertationRules" label-width="79px" >
        <el-form-item label="名称" prop="designation">
          <el-input v-model="modifyDissertationForm.designation" placeholder="请输入专题名称"></el-input>
        </el-form-item>
        <el-form-item label="父级专题" prop="parentId">
          <el-input v-model="currentChooseParentDesignation" placeholder="请选择父级专题" :disabled="true">
            <el-button @click="chooseParentIdDialogVisible = true" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item v-show="isParent" label="所属分类" prop="classifyId">
          <el-input v-model="currentChooseClassifyDesignation" placeholder="请选择该专题所属分类" :disabled="true">
            <el-button @click="chooseClassifyIdDialogVisible = true" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="modifyDissertationForm.description" placeholder="请描述该专题" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button @click="modifyDissertation" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择父级专题" :visible.sync="chooseParentIdDialogVisible" width="30%" center>
      <el-tree :data="parentIdTree" @node-click="chooseParentId" ></el-tree>
      <span slot="footer">
        <el-button @click="confirmParentId" type="primary">确 定</el-button>
      </span>
    </el-dialog>

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
  name: 'Dissertation',
  data () {
    return {
      parentIdTree: [],
      classifyIdTree: [],
      dissertationIds: [],
      currentChooseParentDesignation: null,
      currentChooseClassifyDesignation: null,
      currentChooseParent: null,
      currentChooseClassify: null,
      classifyIdDesignation: null,
      modifyDissertationForm: {},
      newDissertationForm: {
        designation: null,
        parentId: null,
        classifyId: null,
        description: null
      },
      searchDissertation: {
        keyWord: null
      },
      dissertationRules: {
        designation: [
          {required: true, message: '专题名称不能为空', trigger: 'change'},
          {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'change'}
        ],
        description: [
          {max: 100, message: '长度在 300 个字符以内', trigger: 'change'}
        ],
        classifyId: [
          {required: true, message: '请选择该专题的分类，如无分类选项，请先添加专题分类', trigger: 'change'}
        ]
      },
      isParent: true,
      newDialogVisible: false,
      modifyDialogVisible: false,
      chooseParentIdDialogVisible: false,
      chooseClassifyIdDialogVisible: false,
      chooseDissertationTypeDialogVisible: false,
      tableData: [],
      deleteData: [],
      currentPage: 1,
      pageSize: 12,
      totalQuantity: 0
    }
  },
  methods: {
    chooseParentId (node) {
      this.currentChooseParent = node
    },
    chooseclassifyId (node) {
      this.currentChooseClassify = node
    },
    deleteDissertation () {
      if (this.deleteData.length === 0) {
        this.$message.info('请选择要删除的专题')
      } else {
        this.$confirm('确定要删除当前选中的 ' + this.deleteData.length + ' 个专题吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.api.post('/DissertationApi/delete', this.deleteData)
        }).then(() => {
          this.init()
        })
      }
    },
    confirmParentId () {
      this.currentChooseParentDesignation = this.currentChooseParent.label
      this.newDissertationForm.parentId = this.currentChooseParent.id
      this.modifyDissertationForm.parentId = this.currentChooseParent.id
      this.modifyDissertationForm.classifyId = this.currentChooseParent.classifyId
      this.chooseParentIdDialogVisible = false
      this.isParent = false
    },
    confirmClassifyId () {
      this.currentChooseClassifyDesignation = this.currentChooseClassify.label
      this.newDissertationForm.classifyId = this.currentChooseClassify.id
      this.modifyDissertationForm.classifyId = this.currentChooseClassify.id
      this.chooseClassifyIdDialogVisible = false
    },
    addDissertation () {
      this.currentChooseClassifyDesignation = null
      this.currentChooseParentDesignation = null
      this.isParent = true
      this.$refs['newDissertationForm'].validate(async (valid) => {
        if (valid) {
          const result = await this.api.post('/DissertationApi/save', this.newDissertationForm)
          if (result !== null) {
            this.newDialogVisible = false
            this.$refs['newDissertationForm'].resetFields()
            this.init()
          }
        }
      })
    },
    async modify (data) {
      this.currentChooseClassifyDesignation = null
      this.currentChooseParentDesignation = null
      this.isParent = true
      const result = await this.api.post('/DissertationApi/findOneById', {id: data.id})
      if (result !== null) {
        result.parentId = null
        result.classifyId = null
        this.modifyDissertationForm = result
        this.modifyDialogVisible = true
      }
    },
    async modifyDissertation () {
      this.$refs['modifyDissertationForm'].validate(async (valid) => {
        if (valid) {
          const result = await this.api.post('/DissertationApi/update', this.modifyDissertationForm)
          if (result !== null) {
            this.modifyDialogVisible = false
            this.$refs['modifyDissertationForm'].resetFields()
            this.init()
          }
        }
      })
    },
    async initClassifyIds () {
      const result = await this.api.post('/ClassifyApi/getParentTree', {classifyType: '006002'})
      // 初始化专题所属类别选项
      if (result !== null) {
        this.classifyIdTree = result
      }
    },
    async initParentIdTree () {
      const result = await this.api.post('/DissertationApi/getParentTree')
      if (result !== null) {
        this.parentIdTree = result
      }
    },
    async getTableDate () {
      const result = await this.api.post('/DissertationApi/search',
      {currentPage: this.currentPage, pageSize: this.pageSize, keyWord: this.searchDissertation.keyWord})
      if (result != null) {
        this.totalQuantity = result.totalElements
        this.tableData = result.content
      }
    },
    async init () {
      await this.getTableDate()
      await this.initClassifyIds()
      await this.initParentIdTree()
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
      this.deleteData = selection
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
</style>

