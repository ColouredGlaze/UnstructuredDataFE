<template>
<div class="system">
  <div class="menu-container">
    <el-menu :router="true" :default-active="activeIndex" background-color="#2d3a4b" text-color="#fff" active-text-color="#ffd04b" style="border-right: 0px">
      <el-menu-item index="/system/userManage">
        <i class="icon-menu-item"><icon name="userManage" scale="2"></icon></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="/system/classifyManage">
        <i class="el-icon-menu"></i>
        <span slot="title">分类管理</span>
      </el-menu-item>
      <el-menu-item index="/system/dissertationManage">
        <i class="icon-menu-item"><icon name="dissertationManage" scale="2"></icon></i>
        <span slot="title">专题管理</span>
      </el-menu-item>
      <el-menu-item index="/system/resourceTemp">
        <i class="icon-menu-item"><icon name="auditResource" scale="2"></icon></i>
        <span slot="title">审核资源</span>
      </el-menu-item>
      <el-menu-item index="/system/resource">
        <i class="el-icon-document"></i>
        <span slot="title">系统资源</span>
      </el-menu-item>
      <el-menu-item index="/system/auditRecord">
        <i class="icon-menu-item"><icon name="auditRecord" scale="2"></icon></i>
        <span slot="title">审核记录</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>系统设置</span>
        </template>
        <el-menu-item index="/system/digitalDictionary">数据字典</el-menu-item>
        <el-menu-item index="/system/loginLog">登录日志</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
  <div class="main-container">
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
    return {
      activeIndex: '/system/userManage'
    }
  },
  methods: {},
  mounted () {
    this.$router.push('/system/userManage')
  }
}
</script>

<style scoped>
.system {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #ffffff;
}
.icon-menu-item{
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  font-family:element-icons!important;
  font-weight: 400;
  font-variant: normal;
  line-height: 1;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
}
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
