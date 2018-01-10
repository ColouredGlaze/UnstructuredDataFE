<template>
  <div class="user-manage">
    <el-row>
      <el-col :span="6">
        <el-form ref="searchUserInfoForm" :model="searchUserInfo" :inline="true">
          <el-form-item label="关键词：">
            <el-input v-model="searchUserInfo.keyWord"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchByKeyWord" type="primary" icon="el-icon-search">搜 索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="18" style="text-align: right;">
        <el-button @click="newDialogVisible = true" type="primary" icon="el-icon-edit">新增管理员</el-button>
        <el-button @click="deleteUserInfo" type="primary" icon="el-icon-delete">删除用户/管理员</el-button>
        <el-button @click="freeze" type="primary">冻结帐号</el-button>
        <el-button @click="unfreeze" type="primary">解冻账号</el-button>
        <el-button @click="resetPassword" type="primary">重置密码</el-button>
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" ref="tableData" style="width: 100%" max-height="730" @select="tableSelect" @select-all="tableSelect" border stripe>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="userType" label="用户类型"></el-table-column>
        <el-table-column prop="userName" label="用户名" ></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="profession" label="职业"></el-table-column>
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
        <el-table-column prop="addressCode" label="地址"></el-table-column>
        <el-table-column prop="phoneNumber" label="电话号码"></el-table-column>
        <el-table-column prop="status" label="账户状态"></el-table-column>
        <el-table-column prop="description" label="个人简介" show-overflow-tooltip></el-table-column>
        <el-table-column prop="birthday" label="出生日期" show-overflow-tooltip></el-table-column>        
        <el-table-column prop="registerTime" label="注册时间" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
        <el-pagination
          id="pagination"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[12, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalQuantity">
        </el-pagination>
    </div>
    <el-dialog title="新增管理员" :visible.sync="newDialogVisible" width="36%" center>
      <el-form :model="newUserInfoForm" ref="newUserInfoForm" :rules="userInfoRules" label-width="70px" >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名 " prop="userName">
              <el-input v-model="newUserInfoForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密　码 " prop="userPassword">
              <el-input v-model="newUserInfoForm.userPassword" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">          
            <el-form-item label="性　别 ">
              <el-radio v-for="item in sexs" :key="item.code" v-model="newUserInfoForm.sex" :label="item.code">{{item.designation}}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮　箱 " prop="email">
              <el-input v-model="newUserInfoForm.email" placeholder="请输入邮箱地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职　业 " prop="profession">
              <el-select v-model="newUserInfoForm.profession">
                <el-option v-for="item in professions" placeholder="请选择职业" :key="item.code" :label="item.designation" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="住　址 " prop="addressCode">
              <el-input v-model="newUserInfoForm.addressCode" placeholder="请选择住址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker v-model="newUserInfoForm.birthday" placeholder="选择日期" ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电　话 " prop="phoneNumber" >
              <el-input v-model="newUserInfoForm.phoneNumber" placeholder="请输入电话号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="个人简介" prop="description" >
          <el-input v-model="newUserInfoForm.description" placeholder="介绍一下管理员吧！" type="textarea" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="newDialogVisible = false">取 消</el-button>
        <el-button @click="addUserInfo" type="primary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { validatAlphabets } from '@/utils/validate'

export default {
  name: 'UserInfo',
  data () {
    const validatePassword = (rule, value, callback) => {
      if (!validatAlphabets(value)) {
        callback(new Error('只能包含大小写字母'))
      } else {
        callback()
      }
    }
    return {
      selectData: [],
      newUserInfoForm: {
        userName: null,
        userPassword: null,
        sex: null,
        birthday: null,
        phoneNumber: null,
        email: null,
        addressCode: null,
        profession: null,
        description: null
      },
      tableData: [],
      searchUserInfo: {
        keyWord: null
      },
      userInfoRules: {
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
      professions: [],
      sexs: [],
      newDialogVisible: false,
      currentPage: 1,
      pageSize: 12,
      totalQuantity: 0
    }
  },
  methods: {
    freeze () {
      if (this.selectData.length === 0) {
        this.$message.info('请选择要冻结的用户')
        for (let i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i].status !== '正常') {
            this.$message('请选择账户状态为 正常 的用户')
            return
          }
        }
      } else {
        this.$confirm('确定要冻结当前选中的 ' + this.selectData.length + ' 个用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.api.post('/UserInfoApi/freeze', this.selectData)
        }).then(() => {
          this.getTableDate()
        })
      }
    },
    unfreeze () {
      if (this.selectData.length === 0) {
        this.$message.info('请选择要解冻的用户')
      } else {
        for (let i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i].status !== '冻结') {
            this.$message('请选择账户状态为 冻结 的用户')
            return
          }
        }
        this.$confirm('确定要解冻当前选中的 ' + this.selectData.length + ' 个用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.api.post('/UserInfoApi/unfreeze', this.selectData)
        }).then(() => {
          this.getTableDate()
        })
      }
    },
    resetPassword () {
      if (this.selectData.length === 0) {
        this.$message.info('请选择要重置密码的用户')
      } else {
        this.$confirm('确定要重置选中的 ' + this.selectData.length + ' 个用户的密码吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.api.post('/UserInfoApi/resetPassword', this.selectData)
        }).then(() => {
          this.getTableDate()
        })
      }
    },
    deleteUserInfo () {
      if (this.selectData.length === 0) {
        this.$message.info('请选择要删除的用户')
      } else {
        this.$confirm('确定要删除当前选中的 ' + this.selectData.length + ' 个用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.api.post('/UserInfoApi/delete', this.selectData)
        }).then(() => {
          this.getTableDate()
        })
      }
    },
    tableSelect (selection) {
      this.selectData = selection
    },
    searchByKeyWord () {
      this.getTableDate()
    },
    addUserInfo () {
      this.$refs['newUserInfoForm'].validate(async (valid) => {
        if (valid) {
          const passwordConfirmValidator = (value) => {
            return value === this.newUserInfoForm.userPassword
          }
          // 重新输入密码进行确认
          this.$prompt('确认密码', '密码：', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: passwordConfirmValidator,
            inputErrorMessage: '输入的密码与设置的密码不一致'
          }).then(async () => {
            // 确认通过，注册用户信息
            const result = await this.api.post('/UserInfoApi/addAdmin', this.newUserInfoForm)
            if (result !== null) {
              this.newDialogVisible = false
              this.getTableDate()
              this.$refs['newUserInfoForm'].resetFields()
            }
          })
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getTableDate()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableDate()
    },
    async getTableDate () {
      const result = await this.api.post('/UserInfoApi/search',
      {currentPage: this.currentPage, pageSize: this.pageSize, keyWord: this.searchUserInfo.keyWord})
      if (result !== null) {
        this.totalQuantity = result.totalElements
        this.tableData = result.content
      }
    },
    // 初始化数据
    async init () {
      const sexResult = await this.api.post('/DigitalDictionaryApi/getChildrenForSelect', {parentCode: '001'})
      // 初始化性别选项
      if (sexResult !== null) {
        this.sexs = sexResult
        this.newUserInfoForm.sex = this.sexs[0].code
      }
      // 初始化职业选项
      const professionsResult = await this.api.post('/DigitalDictionaryApi/getChildrenForSelect', {parentCode: '002'})
      if (professionsResult !== null) {
        this.professions = professionsResult
      }
    }
  },
  mounted () {
    this.getTableDate()
    this.init()
  }
}
</script>

<style scoped>
.user-manage .el-dialog--center .el-dialog__body{
  padding: 25px 27px 0px;
}
.pagination-container{
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}
.pagination-container .el-pagination{
  font-weight: normal;
}
</style>

