<template>
<div>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-tabs type="border-card" style="min-height: 506px;">
        <el-tab-pane label="资源设置">
          <el-form :model="settingForm" ref="settingFormRef" :rules="settingFormRules" label-width="79px">
            <el-form-item label="资源分类" prop="classifyId">
              <el-cascader
                :options="classifyOptions"
                v-model="classifyIds"
                expand-trigger="hover"
                :show-all-levels="false"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
            <el-form-item label="资源类型" prop="resourceType">
              <el-select v-model="settingForm.resourceType">
                <el-option v-for="item in resourceTypes" :key="item.code" :label="item.designation" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资源标签" prop="tags">
              <el-tag
                :key="tag"
                v-for="tag in settingForm.tags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">加标签</el-button>
            </el-form-item>
            <el-form-item label="资源描述" prop="description">
              <el-input v-model="settingForm.description" type="textarea" :rows="8"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="chooseFile" type="primary">选择文件</el-button>
              <el-button @click="submitUpload" type="primary">上传文件</el-button>
              <el-button @click="resetData" type="success" style="float: right;">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="16">
      <el-tabs type="border-card" style="min-height: 506px;">
        <el-tab-pane label="所选资源">
          <el-upload
            ref="upload"
            :auto-upload="false"
            :file-list="fileList"
            :data="settingForm"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            action="/ud/ResourceTempApi/uploadFiles"            
            drag
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text" id="uploadFileEle">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">文件大小不超过 130 MB</div>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  data () {
    return {
      settingFormRules: {
        description: [
          {max: 300, message: '描述资源的文字长度在 300 个字符以内', trigger: 'change'}
        ]
      },
      settingForm: {
        classifyId: null,
        resourceType: null,
        tags: []
      },
      classifyIds: [],
      fileList: [],
      classifyOptions: [],
      resourceTypes: [],
      inputVisible: false,
      inputValue: null
    }
  },
  methods: {
    submitUpload () {
      if (this.settingForm.classifyId === null || this.settingForm.classifyId === '') {
        this.$message.info('请选择资源分类')
        return
      }
      this.$refs['settingFormRef'].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
        }
      })
    },
    chooseFile () {
      document.getElementById('uploadFileEle').click()
    },
    // eslint-disable-next-line
    onError (error, file, fileList) {
      if (error.status === 500) {
        this.$message.error('服务器出错，请联系管理员')
      } else if (error.status === 504) {
        this.$message.error('连接超时，请重试')
      } else if (error.status === 404) {
        this.$message.error('请求的链接不存在，请联系管理员')
      } else {
        this.$message.error('发生未知错误')
      }
      this.resetData()
    },
    onSuccess (response, file, fileList) {
      if (response.code === 3) {
        this.$message.success(response.msg)
      } else {
        this.$message.warning(response.msg)
      }
      this.resetData()
    },
    beforeUpload (file) {
      if ((file.size / (1024 * 1024)) > 130) {
        this.$message.info('文件大小不能超过 130 MB')
        return false
      }
      return true
    },
    handleClose (tag) {
      this.settingForm.tags.splice(this.settingForm.tags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        for (let i = 0; i < this.settingForm.tags.length; i++) {
          if (this.settingForm.tags[i] === inputValue) {
            this.$message.info('标签 ' + inputValue + ' 已存在')
            return
          }
        }
        this.settingForm.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = null
    },
    handleChange (value) {
      this.settingForm.classifyId = value[value.length - 1]
    },
    resetData () {
      this.$refs['settingFormRef'].resetFields()
      this.$refs['upload'].clearFiles()
      this.classifyIds = []
    },
    async initClassifyOptions () {
      const result = await this.api.post('/ClassifyApi/getParentTree', {classifyType: '006001'})
      if (result !== null) {
        this.classifyOptions = result
      }
    },
    async initResourceType () {
      const result = await this.api.post('/DigitalDictionaryApi/getChildrenForSelect', {parentCode: '003'})
      if (result !== null) {
        this.resourceTypes = result
        this.settingForm.resourceType = this.resourceTypes[0].code
      }
    },
    init () {
      this.initClassifyOptions()
      this.initResourceType()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
.resource-setting {
  width: 30%;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
