<template>
  <div class="login-container">
    <el-row>
      <el-col :span="10">&nbsp;</el-col>
        <el-col :span="4">
          <div class="title-container">
            <h3 class="title">非结构化数据管理</h3>
          </div>
          <div class="login-form">
            <el-form ref="form" :model="form">
              <el-form-item>
                <el-input v-model="form.username">
                  <div slot="prefix" class="el-input__icon"><icon name="user" scale="3"></icon></div>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="form.password" type="password">
                  <div slot="prefix" class="el-input__icon"><icon name="password" scale="2"></icon></div>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <el-button type="primary" style="width:100%;" @click="login">登 录</el-button>
        </el-col>
        <el-col :span="10">&nbsp;</el-col>
      </el-row>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      this.$router.push('/main')
    }
  }
}
</script>

<style scoped>
.title-container{
  margin-top: 60%;
}
.title-container .title {
    font-size: 26px;
    font-weight: 400;
    color: #eee;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
}
.login-form{
  margin-top: 10%
}
.el-input__icon{
  margin-top: 3px;
}
.login-container {
    height: 100%;
    width: 100%;
    position: fixed;
    text-align: center;
    background-color:#2d3a4b;
}
</style>
