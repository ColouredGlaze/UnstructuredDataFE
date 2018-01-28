<template>
<div>
  <el-row :gutter="30">
  <el-col :span="6">
    <el-card style="text-align:center">
      <div slot="header">
        <span>个人信息</span>
      </div>
      <div>
        <span class="user-info user-name">用户名：{{userInfo.userName}}</span>
        <span class="user-info">资源收藏数：{{userInfo.collectNum}}个</span>
        <span class="user-info">资源下载次数：{{userInfo.downloadNum}}次</span>
      </div>
    </el-card>
  </el-col>
  <el-col :span="18">
    <el-tabs type="border-card" style="min-height: 682px;">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-star-on"></i> 我的收藏</span>
        <MyCollection v-on:refreshUserInfo="initUserInfo"></MyCollection>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-menu"></i> 收藏夹</span>
        <CollectionFolder></CollectionFolder>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-download"></i> 下载记录</span>
        <DownloadRecord></DownloadRecord>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-upload"></i> 上传记录</span>
        <UploadRecord></UploadRecord>
      </el-tab-pane>
    </el-tabs>
  </el-col>
</el-row>
</div>
</template>

<script>
import MyCollection from './personalCenter/MyCollection.vue'
import CollectionFolder from './personalCenter/CollectionFolder.vue'
import DownloadRecord from './personalCenter/DownloadRecord.vue'
import UploadRecord from './personalCenter/UploadRecord.vue'
export default {
  data () {
    return {
      userInfo: {
        userName: null,
        collectNum: 0,
        downloadNum: 0
      }
    }
  },
  methods: {
    async initUserInfo () {
      const result = await this.api.post('/UserInfoApi/getUserInfo', {id: null})
      if (result !== null) {
        this.userInfo = result
      }
    },
    init () {
      this.initUserInfo()
    }
  },
  mounted () {
    this.init()
  },
  components: {
    MyCollection,
    CollectionFolder,
    DownloadRecord,
    UploadRecord
  }
}
</script>

<style scoped>
.user-info {
  display: block;
  -webkit-margin-before: 1.33em;
  -webkit-margin-after: 1.33em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
}
.user-name {
  font-weight: 550;
  font-size: 1.2em;
  color: coral;
}
</style>
