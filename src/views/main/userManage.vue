<template>
  <div class="digital-dictionary">
    <el-row>
      <el-col :span="6">
        <el-form ref="addDigitalDictionaryForm" :model="searchDigitalDictionary" :inline="true">
          <el-form-item label="关键词：">
            <el-input v-model="searchDigitalDictionary.keyWord"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchByKeyWord" type="primary" icon="el-icon-search">搜 索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="18" style="text-align: right;">
        <el-button @click="newDialogVisible = true" type="primary" icon="el-icon-edit">新增管理员</el-button>
        <el-button @click="deleteDigitalDictionary" type="primary" icon="el-icon-delete">删除用户/管理员</el-button>
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" ref="tableData" style="width: 100%" max-height="730" @select="tableSelect" @select-all="tableSelect" border stripe>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="" label="用户类型"></el-table-column>
        <el-table-column prop="id" label="用户名" ></el-table-column>
        <el-table-column prop="code" label="性别"></el-table-column>
        <el-table-column prop="description" label="职业"></el-table-column>
        <el-table-column prop="designation" label="邮箱"></el-table-column>
        <el-table-column prop="addressCode" label="地址"></el-table-column>
        <el-table-column prop="parentCode" label="电话号码"></el-table-column>
        <el-table-column prop="creator" label="账户状态"></el-table-column>
        <el-table-column prop="createTime" label="个人简介" show-overflow-tooltip></el-table-column>
        <el-table-column prop="registerTime" label="注册时间"></el-table-column>
        <el-table-column prop="" label=""></el-table-column>
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
    <el-dialog title="新增数据字典" :visible.sync="newDialogVisible" width="30%" center>
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

    <el-dialog title="修改数据字典" :visible.sync="modifyDialogVisible" width="30%" center>
      <el-form :model="modifyDigitalDictionary" ref="modifyDigitalDictionary" :rules="digitalDictionaryRules" label-width="70px" >
        <el-form-item label="名称" prop="designation">
          <el-input v-model="modifyDigitalDictionary.designation" placeholder="请输入数据字典的名称"></el-input>
        </el-form-item>
        <el-form-item label="父类编码" prop="parentCode">
          <el-input v-model="modifyDigitalDictionary.parentCode" placeholder="请选择父类编码" :disabled="true">
            <el-button @click="chooseParentCodeDialogVisible = true" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="modifyDigitalDictionary.code" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="modifyDigitalDictionary.description" placeholder="请描述该数据字典" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button @click="alertDigitalDictionary" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择父级数据字典" :visible.sync="chooseParentCodeDialogVisible" width="30%" center>
      <el-tree :props="treeProps" :load="loadParentCode" @node-click="chooseParentCode" lazy ></el-tree>
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
      deleteData: [],
      treeProps: {
        label: 'designation'
      },
      modifyDigitalDictionary: {},
      newDigitalDictionary: {
        designation: '',
        parentCode: '',
        code: '',
        description: ''
      },
      tableData: [],
      searchDigitalDictionary: {
        keyWord: ''
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
      this.$confirm('确定要删除当前选中的 ' + this.deleteData.length + ' 个用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.api.post('/DigitalDictionaryApi/delete', this.deleteData)
      }).then(() => {
        this.getTableDate()
      })
    },
    tableSelect (selection) {
      this.deleteData = selection
    },
    chooseParentCode (node) {
      this.newDigitalDictionary.parentCode = node.code
      this.modifyDigitalDictionary.parentCode = node.code
    },
    confirmParentCode () {
      this.chooseParentCodeDialogVisible = false
    },
    searchByKeyWord () {
      this.getTableDate()
    },
    async loadParentCode (node, resolve) {
      if (node.level === 0) {
        const result = await this.api.post('/DigitalDictionaryApi/findChildrenForTree', {parentCode: ''})
        resolve(result)
      } else {
        const result = await this.api.post('/DigitalDictionaryApi/findChildrenForTree', {parentCode: node.data.code})
        resolve(result)
      }
    },
    addDigitalDictionary () {
      this.$refs['newDigitalDictionary'].validate(async (valid) => {
        if (valid) {
          const result = await this.api.post('/DigitalDictionaryApi/save', this.newDigitalDictionary)
          if (result !== null) {
            this.newDialogVisible = false
            this.getTableDate()
          }
          this.$refs['newDigitalDictionary'].resetFields()
        }
      })
    },
    async modify (data) {
      const result = await this.api.post('/DigitalDictionaryApi/findOneById', {id: data.id})
      if (result !== null) {
        this.modifyDialogVisible = true
        this.modifyDigitalDictionary = result
      }
    },
    async alertDigitalDictionary () {
      this.$refs['modifyDigitalDictionary'].validate(async (valid) => {
        if (valid) {
          await this.api.post('/DigitalDictionaryApi/update', this.modifyDigitalDictionary)
          this.modifyDialogVisible = false
          this.getTableDate()
        }
        this.$refs['modifyDigitalDictionary'].resetFields()
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
      const result = await this.api.post('/DigitalDictionaryApi/search',
      {currentPage: this.currentPage, pageSize: this.pageSize, keyWord: this.searchDigitalDictionary.keyWord})
      this.totalQuantity = result.totalElements
      this.tableData = result.content
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

