import axios from 'axios'
import store from '@/store'
import router from '@/router'
// import { Spin } from 'iview'
import {Notice, Message} from 'view-design'
import {getToken} from '@/libs/util'

const addErrorLog = errorInfo => {
  const {statusText, status, request: {responseURL}} = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  /*if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)*/
}

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'X-Innovate-Application': 'OA',
        'X-Innovate-UserCode': getToken()
      },
      timeout: 10000
    }
    return config
  }

  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      if (config.url === undefined) {
        Notice.warning({
          title: '警告',
          desc: '请求路径错误，请检查！'
        })
        return false
      }
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const {data, status} = res
      if (!(data && status === 200 && data.code === '0000')) {
        Notice.error({
          title: `错误码：${data && data.code || status}`,
          desc: data && data.message
        })
      }
      return {data, status}

    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const {request: {statusText, status}, config} = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: {responseURL: config.url}
        }
      }
      Notice.error({
        title: `错误码：${errorInfo.status}`,
        desc: errorInfo.data && errorInfo.data.message || errorInfo.statusText
      })
      /*if (errorInfo.status === 401 || errorInfo.status === 500) {
        router.push({path: `/${errorInfo.status}`})
      }*/
      if (errorInfo.status === 401) {
        router.push({path: `/${errorInfo.status}`})
      }

      //addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
