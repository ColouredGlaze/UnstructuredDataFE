<template>
  <el-dialog title="选择所属收藏夹" :visible.sync="treeDialogVisible" width="30%" center :close-on-press-escape="closeOnPressEscape">
    <el-tree :data="treeDialogData" @node-click="nodeClick"></el-tree>
      <span slot="footer">
        <el-button v-if="showCancelButton" @click="closeTreeDialog">取 消</el-button>
        <el-button @click="getChooseNode" type="primary">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      treeDialogVisible: false,
      chooseNode: null,
      treeDialogData: []
    }
  },
  methods: {
    nodeClick (node) {
      this.chooseNode = node
    },
    closeTreeDialog () {
      this.treeDialogVisible = false
      // this.$emit('closeTreeDialog')
    },
    showTreeDialog () {
      this.treeDialogVisible = true
    },
    getChooseNode () {
      this.$emit('getChooseNode', this.chooseNode)
    },
    async initTreeDialogData (initTreeDialogDataParameters) {
      if (this.initTreeDialogUrl === null) {
        return
      }
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
  watch: {
    // treeDialogVisible (val) {
    //   if (!val) {
    //     this.$emit('closeTreeDialog')
    //   }
    // }
  },
  computed: {
    // visibleSync: {
    //   get () {
    //     return this.treeDialogVisible
    //   },
    //   set (val) {
    //     if (!val) {
    //       this.closeTreeDialog()
    //     }
    //   }
    // }
  },
  props: {
    title: {
      type: String,
      default: null
    },
    // treeDialogVisible: {
    //   type: Boolean,
    //   default: false
    // },
    width: {
      type: String,
      default: '60%'
    },
    center: {
      type: Boolean,
      default: false
    },
    initTreeDialogUrl: {
      type: String,
      default: null
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: true
    }
  }
}
</script>
