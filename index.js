'use strict'

const Axios = require('axios')

module.exports = (app, conf = {}) => {

  const dfConf = {
    timeout: 30000,
    responseType: 'json',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    }
  }

  const dataDf = {
    errno: 1,
    errmsg: '',
    data: {}
  }

  const axios = Axios.create(Object.assign(dfConf, conf))

  function serialize(query, type = '?') {
    let urlText = ''
    if (typeof query === 'object') {
      Object.keys(query).forEach((key) => {
        if (typeof query[key] !== 'undefined' && query[key] !== 'undefined' && query[key] !== '') {
          if (type === '?') {
            urlText += `&${key}=${query[key]}`
          } else {
            urlText += `/${key}/${query[key]}`
          }
        }
      })
    }
    return urlText.replace(/^&/, '?')
  }

  function httpError(res) {
    let url = ''
    let errmsg = ''
    if (res.response) {
      url = res.response.config.url
      errmsg = `出错了 错误代码: ${res.response.status}  错误信息: ${res.response.statusText}`
    } else {
      url = res.config.url
      errmsg = `请求出错，请检查您的网络配置 ${res}`
    }
    app.think.logger.error(`请求：${url} 出错`)
    app.think.logger.error(new Error(errmsg))
    return Object.assign(dataDf, { errmsg })
  }

  function httpGet(url, opt = {}, conf = {}) {
    const req = { url: url + serialize(opt), conf }
    return axios(req).then(res => Object.assign(dataDf, { errno: 0, data: res.data }), res => httpError(res))
  }

  function httpPost(url, opt = {}, conf = {}) {
    return axios.post(url, opt, conf).then(res => Object.assign(dataDf, {
      errno: 0,
      data: res.data
    }), res => httpError(res.response))
  }

  return {
    think: {
      axios,
      httpGet,
      httpPost
    },
    context: {
      axios,
      httpGet,
      httpPost
    },
    controller: {
      axios,
      httpGet,
      httpPost
    },
    service: {
      axios,
      httpGet,
      httpPost
    }
  }
}
