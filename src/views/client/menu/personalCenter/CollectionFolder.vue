<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="5">
        <el-input v-model="searchParameters.designation" placeholder="请输入名称">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :span="2"><el-button @click="getTableData" type="primary">搜 索</el-button></el-col>
      <el-col :span="14">
        <el-button @click="newCollectionFolder" type="primary" icon="el-icon-plus" style="float: right;">新 增</el-button>
      </el-col>
      <el-col :span="3">
        <el-button @click="deleteCollectionFolder" type="primary" icon="el-icon-delete" style="float: right;">删 除</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <SearchResultTable
        :selectable="true"
        :tableColumn="tableColumn"
        :maxHeight="570"
        :handleModifyData="modifyCollectionFolderData"        
        tableSearchUrl="/CollectionFolderApi/search"
        ref="myCollectionFolderTable"></SearchResultTable>
    </el-row>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="collectionFolderDialogVisible"
      width="26%">
      <el-form ref="collectionFolderForm" :rules="collectionFolderRules" :model="collectionFolderForm" label-width="82px">
        <el-form-item label="名　称" prop="designation">
          <el-input v-model="collectionFolderForm.designation" placeholder="请输入收藏夹名称"></el-input>
        </el-form-item>
        <el-form-item label="属　于">
          <el-input v-model="collectionFolderForm.parent" placeholder="选择所属收藏夹" :disabled="true">
            <el-button @click="chooseParentCollectionFolder" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="描　述" prop="description">
          <el-input v-model="collectionFolderForm.description" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="collectionFolderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </span>
    </el-dialog>

    <TreeDialog
      ref="treeDialog"
      title="选择所属收藏夹"
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
      dialogTitle: null,
      confirmDialogUrl: null,
      collectionFolderForm: {
        designation: null,
        description: null,
        parentId: null,
        parent: null
      },
      searchParameters: {
        designation: null
      },
      tableColumn: [],
      collectionFolderRules: {
        designation: [
          {required: true, message: '请输入收藏夹名称', trigger: 'blur'},
          {max: 32, message: '长度不能超过 32 个字符', trigger: 'blur'}
        ],
        description: [
          {max: 300, message: '长度不能超过 300 个字符', trigger: 'blur'}
        ]
      },
      collectionFolderDialogVisible: false
    }
  },
  methods: {
    chooseParentCollectionFolder () {
      this.$refs.treeDialog.showTreeDialog()
    },
    getChooseNode (chooseNode) {
      if (chooseNode === null) {
        return
      }
      if (this.collectionFolderForm.id === chooseNode.id) {
        this.$message.info('不能选择当前修改的收藏夹作为所属收藏夹，请选择其他收藏夹')
        return
      }
      this.collectionFolderForm.parentId = chooseNode.id
      this.collectionFolderForm.parent = chooseNode.label
      this.$refs.treeDialog.closeTreeDialog()
    },
    modifyCollectionFolderData (modifyData) {
      this.dialogTitle = '修改收藏夹'
      this.confirmDialogUrl = '/CollectionFolderApi/update'
      this.collectionFolderForm = modifyData
      this.collectionFolderDialogVisible = true
    },
    newCollectionFolder () {
      this.dialogTitle = '新增收藏夹'
      this.confirmDialogUrl = '/CollectionFolderApi/save'
      this.collectionFolderDialogVisible = true
    },
    deleteCollectionFolder () {
      const selectData = this.$refs.myCollectionFolderTable.getSelectData()
      if (selectData.length === 0) {
        this.$message.info('请选择要删除的收藏夹')
        return
      }
      for (let i = 0; i < selectData.length; i++) {
        if (selectData[i].resourceNum > 0) {
          this.$message.info('请选择资源数目为 0 的收藏夹删除')
          return
        }
      }
      this.$confirm('此操作将会删除所选收藏夹以及属于所选收藏夹下的所有收藏夹，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await this.api.post('/CollectionFolderApi/delete', selectData)
        if (result !== null) {
          this.getTableData()
        }
      })
    },
    confirmDialog () {
      this.$refs['collectionFolderForm'].validate(async (valid) => {
        if (valid) {
          const result = await this.api.post(this.confirmDialogUrl, this.collectionFolderForm)
          if (result !== null) {
            this.init()
            this.collectionFolderDialogVisible = false
            this.$refs['collectionFolderForm'].resetFields()
          }
        }
      })
    },
    getTableData () {
      this.$refs.myCollectionFolderTable.getTableDate(this.searchParameters)
    },
    init () {
      this.tableColumn = [
        {prop: 'designation', label: '名称', width: '190', sot: true},
        {prop: 'resourceNum', label: '资源数目', width: '90', sot: true},
        {prop: 'parent', label: '所属收藏夹', width: '190', sot: true},
        {prop: 'description', label: '描述', sot: true},
        {prop: 'createTime', label: '创建时间', width: '159'},
        {prop: 'operation', label: '操作', width: '96', isOperation: true, operations: ['modify']}
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
