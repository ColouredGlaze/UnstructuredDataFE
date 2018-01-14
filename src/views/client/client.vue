<template>
  <div class="client">
    <div class="main-container">
      <div class="menu-container">
        <el-menu
          :router="true"
          :default-active="activeIndex"
          mode="horizontal"
          @select="handleSelect">
          <el-menu-item index="1">首页</el-menu-item>
          <el-submenu index="2">
            <template slot="title">个人中心</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-submenu>
          <el-menu-item index="/client/uploadResource">上传资源</el-menu-item>
        </el-menu>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '/client/uploadResource'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  mounted () {
    this.$router.push('/client/uploadResource')
  }
}
</script>

<style scoped>
.menu-container{
  padding-bottom: 20px;
}
.main-container{
  width: 70%;
  margin: 0 auto;
  margin-top: 20px
}
.client{
    height: 100%;
    width: 100%;
    position: absolute;
    /* text-align: center; */
    background-image: url('../../assets/client-clean.jpg');
    /* background-repeat: no-repeat; */
    /* background-size:100% 100%;
    -moz-background-size:100% 100%; */
}
</style>

