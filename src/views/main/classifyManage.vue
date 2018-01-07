<template>
  <div class="classify-manage">
    <el-row>
      <el-col :span="6">
        <el-form ref="searchClassifyForm" :model="searchClassify" :inline="true">
          <el-form-item label="关键词：">
            <el-input v-model="searchClassify.keyWord"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchByKeyWord" type="primary" icon="el-icon-search">搜 索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="18" style="text-align: right;">
        <el-button @click="newDialogVisible = true" type="primary" icon="el-icon-edit">新增分类</el-button>
        <el-button @click="deleteClassify" type="primary" icon="el-icon-delete">删除分类</el-button>
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" ref="tableData" style="width: 100%" max-height="730" @select="tableSelect" @select-all="tableSelect" border stripe>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="designation" label="分类名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parent" label="父级分类"></el-table-column>
        <el-table-column prop="classifyType" label="分类类型"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="collectionNum" label="收藏数"></el-table-column>
        <el-table-column prop="downloadNum" label="下载数"></el-table-column>
        <el-table-column prop="uploadNum" label="上传数"></el-table-column>
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
    <el-dialog title="新增分类" :visible.sync="newDialogVisible" width="30%" center>
      <el-form :model="newClassifyForm" ref="newClassifyForm" :rules="classifyRules" label-width="70px" >
        <el-form-item label="名称" prop="designation">
          <el-input v-model="newClassifyForm.designation" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父类" prop="parentId">
          <el-input v-model="parentDesignation" placeholder="请选择父类" :disabled="true">
            <el-button @click="chooseParentIdDialogVisible = true" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="分类类型" prop="classifyType">
          <el-select v-model="newClassifyForm.classifyType">
            <el-option v-for="item in classifyTypes" :key="item.code" :label="item.designation" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="newClassifyForm.description" placeholder="请描述该分类" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="newDialogVisible = false">取 消</el-button>
        <el-button @click="addClassify" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改分类" :visible.sync="modifyDialogVisible" width="30%" center>
      <el-form :model="modifyClassifyForm" ref="modifyClassifyForm" :rules="classifyRules" label-width="70px" >
        <el-form-item label="名称" prop="designation">
          <el-input v-model="newClassifyForm.designation" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父类" prop="parentId">
          <el-input v-model="parentDesignation" placeholder="请选择父类" :disabled="true">
            <el-button @click="chooseParentIdDialogVisible = true" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="分类类型" prop="classifyType">
          <el-select v-model="newClassifyForm.classifyType">
            <el-option v-for="item in classifyTypes" :key="item.code" :label="item.designation" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="newClassifyForm.description" placeholder="请描述该分类" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button @click="modifyClassify" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择父级分类" :visible.sync="chooseParentCodeDialogVisible" width="30%" center>
      <el-tree :props="treeProps" :load="loadParentCode" @node-click="chooseParentCode" lazy ></el-tree>
      <span slot="footer">
        <el-button @click="confirmParentCode" type="primary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'ClassifyManager',
  data () {
    return {
      classifyTypes: [],
      parentDesignation: '',
      classifyTypeDesignation: '',
      modifyClassifyForm: {},
      newClassifyForm: {
        designation: '',
        parentCode: '',
        code: '',
        description: ''
      },
      tableData: [],
      searchClassify: {
        keyWord: ''
      },
      classifyRules: {
        designation: [
          {required: true, message: '分类名称不能为空', trigger: 'blur'},
          {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
        ],
        description: [
          {max: 100, message: '长度在 300 个字符以内', trigger: ''}
        ]
      },
      newDialogVisible: false,
      modifyDialogVisible: false,
      chooseParentIdDialogVisible: false,
      chooseClassifyTypeDialogVisible: false,
      treeProps: {
        label: 'designation',
        children: 'children'
      },
      deleteData: [],
      currentPage: 1,
      pageSize: 12,
      totalQuantity: 0
    }
  },
  methods: {
    deleteClassify () {
      if (this.deleteData.length === 0) {
        this.$message.info('请选择要删除的记录')
      } else {
        this.$confirm('确定要删除当前选中的 ' + this.deleteData.length + ' 条记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.api.post('/ClassifyApi/delete', this.deleteData)
        }).then(() => {
          this.getTableDate()
        })
      }
    },
    tableSelect (selection) {
      this.deleteData = selection
    },
    chooseParentCode (node) {
      this.newClassifyForm.parentCode = node.code
      this.modifyClassifyForm.parentCode = node.code
    },
    confirmParentCode () {
      this.chooseParentCodeDialogVisible = false
    },
    searchByKeyWord () {
      this.getTableDate()
    },
    async loadParentCode (node, resolve) {
      if (node.level === 0) {
        const result = await this.api.post('/ClassifyApi/findChildrenForTree', {parentCode: ''})
        resolve(result)
      } else {
        const result = await this.api.post('/ClassifyApi/findChildrenForTree', {parentCode: node.data.code})
        resolve(result)
      }
    },
    addClassify () {
      this.$refs['newClassifyForm'].validate(async (valid) => {
        if (valid) {
          const result = await this.api.post('/ClassifyApi/save', this.newClassifyForm)
          if (result !== null) {
            this.newDialogVisible = false
            this.getTableDate()
          }
          this.$refs['newClassifyForm'].resetFields()
        }
      })
    },
    async modify (data) {
      const result = await this.api.post('/ClassifyApi/findOneById', {id: data.id})
      if (result !== null) {
        this.modifyDialogVisible = true
        this.modifyClassifyForm = result
      }
    },
    async modifyClassify () {
      this.$refs['modifyClassifyForm'].validate(async (valid) => {
        if (valid) {
          await this.api.post('/ClassifyApi/update', this.modifyClassifyForm)
          this.modifyDialogVisible = false
          this.getTableDate()
        }
        this.$refs['modifyClassifyForm'].resetFields()
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getTableDate()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableDate()
    },
    async getTableDate () {
      const result = await this.api.post('/ClassifyApi/search',
      {currentPage: this.currentPage, pageSize: this.pageSize, keyWord: this.searchClassify.keyWord})
      if (result != null) {
        this.totalQuantity = result.totalElements
        this.tableData = result.content
      }
    }
  },
  mounted () {
    this.getTableDate()
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

