<template>
  <div>
    <el-row class="search-container">
      <el-col :span="6">&nbsp;</el-col>
      <el-col :span="10">
        <el-input v-model="keyword"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" @click="searchResource">搜 索</el-button>        
      </el-col>
      <el-col :span="6">&nbsp;</el-col>
    </el-row>
    <router-view v-on:indexRouterMethods="indexRouterMethods"></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keyword: '',
      content: null
    }
  },
  methods: {
    searchResource () {
      if (this.keyword.length === 0) {
        this.$message.info('请输入搜索关键词')
        return
      }
      this.$router.push('/client/index/searchResourceResult/' + this.keyword)
    },
    indexRouterMethods (tag, param) {
      switch (tag) {
        case 'resourceDetail':
          this.$router.push('/client/resourceDetail/' + param)
          break
        default:
          break
      }
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/client/index') {
        this.$router.push('/client/index/listResource')
      }
    }
  },
  mounted () {
    this.$router.push('/client/index/listResource')
    this.keyword = '设计'
  }
}
</script>

<style>
.search-container {
  margin-bottom: 20px;
}
.search-container .el-button{
  height: 39px;
  border-radius: 0px;
}
.search-container .el-input--medium .el-input__inner{
  height: 39px;
  border-radius: 0px;
}
</style>
