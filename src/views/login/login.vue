<template>
  <div class="login-container">
    <el-col :span="10">&nbsp;</el-col>
      <el-col :span="4">
        <div class="title-container">
          <h3 class="title">非结构化资源共享与管理</h3>
        </div>
        <div class="login-form">
          <el-form ref="form" :model="loginForm">
            <el-form-item>
              <el-input v-model="loginForm.userName" placeholder="请输入用户名">
                <div slot="prefix" class="el-input__icon"><icon name="user" scale="3"></icon></div>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="loginForm.userPassword" type="password" placeholder="请输入密码">
                <div slot="prefix" class="el-input__icon"><icon name="password" scale="2"></icon></div>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="primary" style="width:100%;" @click="login">登 录</el-button>
        <el-button @click="newDialogVisible = true" type="text" style="float: right">立即注册</el-button>
      </el-col>
      <el-col :span="10">&nbsp;</el-col>
      <div class="dialog-container">
        <el-dialog :visible.sync="newDialogVisible" width="36%" >
          <el-form :model="registerForm" ref="registerForm" :rules="registerRules" label-width="69px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户名 " prop="userName">
                  <el-input v-model="registerForm.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密　码 " prop="userPassword">
                  <el-input v-model="registerForm.userPassword" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">          
                <el-form-item label="性　别 ">
                  <el-radio v-for="item in sexs" :key="item.code" v-model="registerForm.sex" :label="item.code">{{item.designation}}</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮　箱 " prop="email">
                  <el-input v-model="registerForm.email" placeholder="请输入邮箱地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="职　业 " prop="profession">
                  <el-select v-model="registerForm.profession">
                    <el-option v-for="item in professions" placeholder="请选择职业" :key="item.code" :label="item.designation" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="住　址 " prop="addressCode">
                  <el-input v-model="registerForm.addressCode" placeholder="请选择住址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="出生日期" prop="birthday">
                  <el-date-picker v-model="registerForm.birthday" placeholder="选择日期" ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电　话 " prop="phoneNumber" >
                  <el-input v-model="registerForm.phoneNumber" placeholder="请输入电话号码"></el-input>
                </el-form-item>
              </el-col>

            </el-row>
            <el-form-item label="个人简介" prop="description" >
              <el-input v-model="registerForm.description" placeholder="介绍一下你自己吧！" type="textarea" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="newDialogVisible = false">取 消</el-button>
            <el-button @click="register" type="primary">注 册</el-button>
          </span>
        </el-dialog>
      </div>
  </div>
</template>

<script>
import { validatAlphabets } from '@/utils/validate'
export default {
  name: 'Login',
  data () {
    const validatePassword = (rule, value, callback) => {
      if (!validatAlphabets(value)) {
        callback(new Error('只能包含大小写字母'))
      } else {
        callback()
      }
    }
    return {
      registerRules: {
        userName: [
          {required: true, trigger: 'change', message: '请输入用户名'},
          {min: 3, max: 5, trigger: 'change', message: '长度在 3 到 8 个字符'}
        ],
        userPassword: [
          {required: true, trigger: 'change', message: '请输入密码'},
          {trigger: 'change', validator: validatePassword},
          {min: 6, max: 16, trigger: 'change', message: '长度在 6 到 16 个字符'}
        ],
        email: [
          {required: true, trigger: 'change', message: '请输入邮箱'},
          {type: 'email', trigger: 'change', message: '请输入正确的邮箱地址'}
        ],
        profession: [
          {required: true, trigger: 'change', message: '请选择职业'}
        ],
        addressCode: [
          {required: true, trigger: 'change', message: '请选择地址'}
        ]
      },
      registerForm: {
        userName: '超级管理员',
        userPassword: 'aaaaaa',
        sex: '',
        birthday: '',
        phoneNumber: '17805930630',
        email: 'mingtielin@outlook.com',
        addressCode: '中国',
        profession: '002001',
        description: '我是超级管理员！'
      },
      professions: [],
      sexs: [],
      loginForm: {
        userName: '用户呀',
        userPassword: 'aaaaaa'
      },
      confirmPassword: '',
      newDialogVisible: false,
      confirmDialogVisible: false
    }
  },
  methods: {
    // 点击注册按钮
    register () {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          const passwordConfirmValidator = (value) => {
            return value === this.registerForm.userPassword
          }
          // 重新输入密码进行确认
          this.$prompt('确认密码', '密码：', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: passwordConfirmValidator,
            inputErrorMessage: '输入的密码与设置的密码不一致'
          }).then(async () => {
            // 确认通过，注册用户信息
            const result = await this.api.post('/UserInfoApi/register', this.registerForm)
            if (result !== null) {
              this.newDialogVisible = false
              this.$refs['registerForm'].resetFields()
            }
          })
        }
      })
    },
    // 点击登录按钮
    async login () {
      const result = await this.api.post('/UserInfoApi/login', this.loginForm)
      if (result !== null) {
        if (result === '008001') {
          this.$router.push('/system')
        } else {
          this.$router.push('/client')
        }
      }
    },
    // 初始化数据
    async init () {
      const sexResult = await this.api.post('/DigitalDictionaryApi/getChildrenForSelect', {parentCode: '001'})
      // 初始化性别选项
      if (sexResult !== null) {
        this.sexs = sexResult
        this.registerForm.sex = this.sexs[0].code
      }
      // 初始化职业选项
      const professionsResult = await this.api.post('/DigitalDictionaryApi/getChildrenForSelect', {parentCode: '002'})
      if (professionsResult !== null) {
        this.professions = professionsResult
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
.dialog-container{
  text-align: left;
}
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
    position: absolute;
    text-align: center;
    background-color:#2d3a4b;
}
</style>
