<template>
  <div class="digital-dictionary">
    <el-row>
      <el-col :span="6">
        <el-form ref="searchDigitalDictionaryForm" :model="searchDigitalDictionary" :inline="true">
          <el-form-item label="关键词：">
            <el-input v-model="searchDigitalDictionary.keyWord"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchByKeyWord" type="primary" icon="el-icon-search">搜 索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="18" style="text-align: right;">
        <el-button @click="newDialogVisible = true" type="primary" icon="el-icon-edit">新增数据字典</el-button>
        <el-button @click="deleteDigitalDictionary" type="primary" icon="el-icon-delete">删除数据字典</el-button>
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" ref="tableData" style="width: 100%" max-height="730" @select="tableSelect" @select-all="tableSelect" border stripe>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="数据字典ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="designation" label="名称"></el-table-column>
        <el-table-column prop="parentCode" label="父类编码"></el-table-column>
        <el-table-column prop="code" label="编码"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
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
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[12, 20, 36, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalQuantity">
        </el-pagination>
    </div>
    <el-dialog title="新增数据字典" :visible.sync="newDialogVisible" width="36%" center>
      <el-form :model="newDigitalDictionary" ref="newDigitalDictionary" :rules="digitalDictionaryRules" label-width="70px" >
        <el-form-item label="名称" prop="designation">
          <el-input v-model="newDigitalDictionary.designation" placeholder="请输入数据字典的名称"></el-input>
        </el-form-item>
        <el-form-item label="父类编码" prop="parentCode">
          <el-input v-model="newDigitalDictionary.parentCode" placeholder="请选择父类编码" :disabled="true">
            <el-button @click="chooseParentCodeDialogVisible = true" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="newDigitalDictionary.code" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="newDigitalDictionary.description" placeholder="请描述该数据字典" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="newDialogVisible = false">取 消</el-button>
        <el-button @click="addDigitalDictionary" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改数据字典" :visible.sync="modifyDialogVisible" width="36%" center>
      <el-form :model="modifyDigitalDictionaryForm" ref="modifyDigitalDictionaryForm" :rules="digitalDictionaryRules" label-width="70px" >
        <el-form-item label="名称" prop="designation">
          <el-input v-model="modifyDigitalDictionaryForm.designation" placeholder="请输入数据字典的名称"></el-input>
        </el-form-item>
        <el-form-item label="父类编码" prop="parentCode">
          <el-input v-model="newDigitalDictionary.parentCode" placeholder="请选择父类编码" :disabled="true">
            <el-button @click="chooseParentCodeDialogVisible = true" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="modifyDigitalDictionaryForm.code" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="modifyDigitalDictionaryForm.description" placeholder="请描述该数据字典" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button @click="modifyDigitalDictionary" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择父级数据字典" :visible.sync="chooseParentCodeDialogVisible" width="30%" center>
      <el-tree :data="chooseParentCodeTree" @node-click="chooseParentCode" ></el-tree>
      <span slot="footer">
        <el-button @click="confirmParentCode" type="primary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'DigitalDictionary',
  data () {
    return {
      currentChooseParent: null,
      chooseParentCodeTree: [],
      deleteData: [],
      modifyDigitalDictionaryForm: {},
      newDigitalDictionary: {
        designation: null,
        code: null,
        description: null,
        parentCode: null
      },
      tableData: [],
      searchDigitalDictionary: {
        keyWord: null
      },
      digitalDictionaryRules: {
        designation: [
          {required: true, message: '数据字典名称不能为空', trigger: 'blur'},
          {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '编码不能为空', trigger: 'blur'},
          {min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur'}
        ],
        description: [
          {max: 100, message: '长度在 100 个字符以内', trigger: ''}
        ]
      },
      newDialogVisible: false,
      modifyDialogVisible: false,
      chooseParentCodeDialogVisible: false,
      currentPage: 1,
      pageSize: 12,
      totalQuantity: 0
    }
  },
  methods: {
    deleteDigitalDictionary () {
      if (this.deleteData.length === 0) {
        this.$message.info('请选择要删除的记录')
      } else {
        this.$confirm('确定要删除当前选中的 ' + this.deleteData.length + ' 条记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.api.post('/DigitalDictionaryApi/delete', this.deleteData)
        }).then(() => {
          this.init()
        })
      }
    },
    tableSelect (selection) {
      this.deleteData = selection
    },
    chooseParentCode (node) {
      this.currentChooseParent = node
    },
    confirmParentCode () {
      this.newDigitalDictionary.parentCode = this.currentChooseParent.code
      this.modifyDigitalDictionaryForm.parentCode = this.currentChooseParent.code
      this.chooseParentCodeDialogVisible = false
    },
    searchByKeyWord () {
      this.getTableDate()
    },
    addDigitalDictionary () {
      this.$refs['newDigitalDictionary'].validate(async (valid) => {
        if (valid) {
          const result = await this.api.post('/DigitalDictionaryApi/save', this.newDigitalDictionary)
          if (result !== null) {
            this.newDialogVisible = false
            this.$refs['newDigitalDictionary'].resetFields()
            this.init()
          }
        }
      })
    },
    async modify (data) {
      const result = await this.api.post('/DigitalDictionaryApi/findOneById', {id: data.id})
      if (result !== null) {
        this.modifyDialogVisible = true
        this.modifyDigitalDictionaryForm = result
        this.init()
      }
    },
    async modifyDigitalDictionary () {
      this.$refs['modifyDigitalDictionaryForm'].validate(async (valid) => {
        if (valid) {
          await this.api.post('/DigitalDictionaryApi/update', this.modifyDigitalDictionaryForm)
          this.modifyDialogVisible = false
          this.$refs['modifyDigitalDictionaryForm'].resetFields()
          this.init()
        }
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
    init () {
      this.getTableDate()
      this.initParentCodeTree()
    },
    async initParentCodeTree () {
      const result = await this.api.post('/DigitalDictionaryApi/getParentCodeTree')
      if (result !== null) {
        this.chooseParentCodeTree = result
      }
    },
    async getTableDate () {
      const result = await this.api.post('/DigitalDictionaryApi/search',
      {currentPage: this.currentPage, pageSize: this.pageSize, keyWord: this.searchDigitalDictionary.keyWord})
      if (result != null) {
        this.totalQuantity = result.totalElements
        this.tableData = result.content
      }
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

