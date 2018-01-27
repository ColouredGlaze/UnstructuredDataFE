<template>
  <el-dialog title="选择所属收藏夹" :visible.sync="treeDialogVisible" width="30%" center>
    <el-tree :data="treeDialogData" @node-click="nodeClick"></el-tree>
      <span slot="footer">
        <el-button @click="treeDialogVisible = false">取 消</el-button>
        <el-button @click="getChooseNode" type="primary">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      chooseNode: null,
      treeDialogData: []
    }
  },
  methods: {
    nodeClick (node) {
      this.chooseNode = node
    },
    getChooseNode () {
      this.$emit('getChooseNode', this.chooseNode)
    },
    async initTreeDialogData (initTreeDialogDataParameters) {
      let result
      if (initTreeDialogDataParameters === null) {
        result = await this.api.post(this.initTreeDialogUrl)
      } else {
        result = await this.api.post(this.initTreeDialogUrl, initTreeDialogDataParameters)
      }
      if (result !== null) {
        this.treeDialogData = result
      }
    }
  },
  props: ['title', 'treeDialogVisible', 'width', 'center', 'initTreeDialogUrl']
}
</script>
