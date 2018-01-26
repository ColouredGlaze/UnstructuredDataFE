<template>
  <div class="client">
    <div class="main-container">
      <div class="menu-container">
        <el-menu
          :router="true"
          :default-active="activeIndex"
          mode="horizontal"
          @select="handleSelect">
          <el-menu-item index="/client/index">首页</el-menu-item>
          <el-menu-item index="/client/personalCenter">个人中心</el-menu-item>
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
      activeIndex: '/client/index'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log('client.vue:handleSelect' + key)
    }
  },
  mounted () {
    this.$router.push('/client/index')
  }
}
</script>

<style scope>
.el-input-group__append, .el-input-group__prepend {
  border-radius: 0px;
}
.el-upload-dragger {
  border-radius: 0px;
}
.el-select-dropdown {
  border-radius: 0px;
}
.el-textarea__inner {
  border-radius: 0px;
} .el-input__inner {
  border-radius: 0px;
}
.el-button {
  border-radius: 0px;
}
.el-upload {
  width: 100%;
}
.el-upload-dragger {
  width: 100%;
}
.menu-container{
  padding-bottom: 20px;
}
.main-container{
  width: 70%;
  margin: 0 auto;
  margin-top: 10px
}
</style>

