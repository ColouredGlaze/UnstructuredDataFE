<template>
  <el-row class="content-container" :gutter="20">
    <el-col :span="8" v-for="item in content" :key="item.dissertation.id" class="content">
      <el-card>
        <div slot="header" class="clearfix">
          <span>{{item.dissertation.designation}}</span>
          <el-button style="float: right; padding: 3px 0" type="text">更多...</el-button>
        </div>
        <div v-for="resourceItem in item.resource" :key="resourceItem.id" class="text item">
          <a @click="resourceDetail(resourceItem.id)" >
            <el-row>
              <el-col :span="19"><span class="resourceItem-designation">{{resourceItem.designation}}</span></el-col>
              <el-col :span="5"><span style="float:right;">{{resourceItem.uploadTime.substring(0, 10)}}</span></el-col>
            </el-row>
          </a>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      content: null
    }
  },
  methods: {
    resourceDetail (id) {
      this.$emit('indexRouterMethods', 'resourceDetail', id)
    },
    async initContent () {
      const result = await this.api.post('/ResourceApi/getTopFiveByDissertation')
      if (result !== null) {
        this.content = result
      }
    },
    init () {
      this.initContent()
    }
  },
  mounted () {
    this.init()
  }
}
</script>


<style>
.resourceItem-designation{
  display: block;
  overflow: hidden;/*内容超出后隐藏*/
  text-overflow: ellipsis;/* 超出内容显示为省略号*/
  white-space: nowrap;/*文本不进行换行*/
}
.content-container .content{
  padding-bottom: 20px;
}
.content-container .el-card__header{
  padding: 11px 19px;
}
.content-container .el-card__body{
  padding: 11px 19px;
  min-height: 162px;
}
.text {
  font-size: 13px;
}
.item {
  margin-bottom: 10px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>
