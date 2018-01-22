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
    <router-view v-on:clientIndexRouter="routerMethods"></router-view>
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
    routerMethods (tag, param) {
      console.log(tag + '------' + param)
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.path === '/client/index') {
      this.$router.push('/client/index/listResource')
    } else {
      next()
    }
  },
  mounted () {
    this.$router.push('/client/index/listResource')
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
