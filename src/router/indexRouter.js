import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/login'
import Main from '@/views/main/main'
import DigitalDictionary from '@/views/main/digitalDictionary'
import UserManage from '@/views/main/userManage'
import ClassifyManage from '@/views/main/classifyManage'
import DissertationManage from '@/views/main/dissertationManage'
import ResourceTemp from '@/views/main/resourceTemp'
import AuditRecord from '@/views/main/auditRecord'
import LoginLog from '@/views/main/loginLog'
import SystemResource from '@/views/main/systemResource'

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
      path: '/main',
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
          path: 'systemResource',
          name: 'SystemResource',
          component: SystemResource
        }
      ]
    }
  ]
})
