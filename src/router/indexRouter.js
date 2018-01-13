import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/login'
import Main from '@/views/system/system'
import DigitalDictionary from '@/views/system/digitalDictionary'
import UserManage from '@/views/system/userManage'
import ClassifyManage from '@/views/system/classifyManage'
import DissertationManage from '@/views/system/dissertationManage'
import ResourceTemp from '@/views/system/resourceTemp'
import AuditRecord from '@/views/system/auditRecord'
import LoginLog from '@/views/system/loginLog'
import Resource from '@/views/system/resource'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/system',
      name: 'Main',
      component: Main,
      children: [
        {
          path: 'digitalDictionary',
          name: 'DigitalDictionary',
          component: DigitalDictionary
        },
        {
          path: 'userManage',
          name: 'UserManage',
          component: UserManage
        },
        {
          path: 'classifyManage',
          name: 'ClassifyManage',
          component: ClassifyManage
        },
        {
          path: 'dissertationManage',
          name: 'DissertationManage',
          component: DissertationManage
        },
        {
          path: 'resourceTemp',
          name: 'ResourceTemp',
          component: ResourceTemp
        },
        {
          path: 'auditRecord',
          name: 'AuditRecord',
          component: AuditRecord
        },
        {
          path: 'loginLog',
          name: 'LoginLog',
          component: LoginLog
        },
        {
          path: 'resource',
          name: 'Resource',
          component: Resource
        }
      ]
    }
  ]
})
