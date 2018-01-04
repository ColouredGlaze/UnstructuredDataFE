import axios from 'axios'
import { Loading, Message } from 'element-ui'

// 配置接口地址
axios.defaults.baseURL = '/ud'
// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

let loadinginstace

// http请求拦截
axios.interceptors.request.use(config => {
  loadinginstace = Loading.service({ fullscreen: true })
  return config
}, error => {
  loadinginstace.close()
  return Promise.reject(error)
})
// http 响应拦截
axios.interceptors.response.use(response => response, error => Promise.resolve(error.response))

function checkStatus (response) {
  loadinginstace.close()
  // 判断是不是网络出错
  if (response.status === 200 || response.status === 304) {
    // 正常访问连接
    return response
  }
  return {
    data: {
      code: response.status,
      msg: response.statusText,
      data: response.statusText
    }
  }
}

function checkCode (response) {
  // 判断服务器返回的编码
  if (response.data.code === 3 || response.data.code === 0) {
    if (response.data.code === 3 && typeof response.data.data === 'undefined') {
      // 操作成功，无返回数据
      Message.success(response.data.msg)
      return 3
    } else if (response.data.code === 0) {
      // 操作失败
      Message.warning(response.data.msg)
      return null
    } else {
      // 操作成功，有返回数据，直接将数据返回
      return response.data.data
    }
  } else if (response.data.code === 500) {
    Message.error('服务器出错')
  } else if (response.data.code === 504) {
    Message.error('连接超时')
  } else {
    Message.error('发生未知错误')
  }
  return null
}

export default {
  post (url, data) {
    return axios({
      method: 'post',
      url,
      data,
      timeout: 30000
    }).then(checkStatus).then(checkCode)
  },
  get (url, params) {
    return axios({
      method: 'get',
      url,
      params,
      timeout: 30000
    }).then(checkStatus).then(checkCode)
  }
}
