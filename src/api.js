import axios from 'axios'
import { Message } from 'element-ui'
// import { Loading, Message } from 'element-ui'

// 配置接口地址
axios.defaults.baseURL = '/ud'
// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// let loadinginstace
// let requestingCount = 0

// const handleRequestLoading = () => {
//   if (!requestingCount) {
//     loadinginstace = Loading.service({ fullscreen: true })
//   }
//   requestingCount++
// }

// const handleResponseLoading = () => {
//   requestingCount--
//   if (!requestingCount) {
//     loadinginstace.close()
//   }
// }

// http请求拦截
axios.interceptors.request.use(config => {
  // handleRequestLoading()
  return config
}, error => {
  // handleResponseLoading()
  return Promise.reject(error)
})
// http 响应拦截
axios.interceptors.response.use(response => {
  // handleResponseLoading()
  return response
}, error => {
  // handleResponseLoading()
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  // 状态码
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
      if (response.data.msg.length > 0) {
        Message.success(response.data.msg)
      }
      return 3
    } else if (response.data.code === 0) {
      // 操作失败
      Message.warning(response.data.msg)
      return null
    } else {
      // 操作成功，有返回数据，直接将数据返回
      return response.data.data
    }
  } else if (response.status === 200) {
    return
  } else if (response.data.code === 500) {
    Message.error('服务器出错，请联系管理员')
  } else if (response.data.code === 504) {
    Message.error('连接超时，请重试')
  } else if (response.data.code === 404) {
    Message.error('请求的链接不存在，请联系管理员')
  } else {
    Message.error('发生未知错误')
  }
  return null
}
// downloadUrl
// 作者：Geovanni.zhang
// 链接：https://www.zhihu.com/question/263323250/answer/267842980
// 来源：知乎
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
// function downloadUrl (response) {
//   console.log(response.request.responseURL)
//   let iframe = document.createElement('iframe')
//   iframe.style.display = 'none'
//   iframe.src = response.request.responseURL
//   iframe.onload = function () {
//     document.body.removeChild(iframe)
//   }
//   document.body.appendChild(iframe)
// }

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
  },
  download (resource) {
    let parameters
    if (typeof resource.esId !== 'undefined') {
      // 下载审核通过的资源
      const result = this.post('/ResourceDownloadApi/save', {resourceId: resource.resourceId})
      if (result === null) {
        return
      }
      resource.resourceTempId = ''
    } else {
      resource.esId = ''
    }
    parameters = 'resourceId=' + resource.resourceId + '&esId=' + resource.esId + '&resourceTempId=' + resource.resourceTempId
    let iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = 'http://localhost:9363/ud/FileApi/download?' + parameters
    iframe.onload = function () {
      document.body.removeChild(iframe)
    }
    document.body.appendChild(iframe)
  }
}
