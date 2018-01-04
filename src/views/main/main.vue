<template>
<div>
  <div class="menu-container">
    <el-menu
    :router="true"
    background-color="#2d3a4b"
    text-color="#fff"
    active-text-color="#ffd04b"
    style="border-right: 0px">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>系统管理</span>
        </template>
        <el-menu-item index="1-1">菜单管理</el-menu-item>
        <el-menu-item index="/main/digitalDictionary">数据字典</el-menu-item>
        <el-menu-item index="1-3">登录日志</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
  <div class="main-container">
    <div class="breadcrumb">
      <el-breadcrumb separator="/" >
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="router-view">
      <router-view></router-view>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Main',
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
.main-container{
  margin-left: 230px;
}
.main-container .router-view{
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 30px;
}
.main-container .breadcrumb{
  padding-left: 20px;
  padding-top: 20px;
  height: 39px;
  border-bottom: solid 1px #bdbdbd;
}
.main-container .breadcrumb .el-breadcrumb{
  font-size: 15px;
  font-family: '微软雅黑';
}
.menu-container{
  transition: width 0.28s;
  width: 230px!important;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  background-color: #2d3a4b;
}
</style>
