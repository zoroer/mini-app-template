// 请求header的contentType类型
const contentTypeMap = {
  json: { 'content-type': 'application/json' },
  form: { 'content-type': 'application/x-www-form-urlencoded' }
}

// 处理 HTTP 网络错误
const errMessageMap = {
  400: '请求错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求地址404',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用'
}

/**
 * HttpRequest封装
 * @param url
 * @param data
 * @param extraConf
 * @param method
 * @param contentType
 * @returns {Promise}
 * @constructor
 */
function HttpRequest(url, data, extraConf = {}, method = 'GET', contentType = 'json') {
  return new Promise((resolve, reject) => {
    // 业务额外控制字段
    let extraReqConf = {
      showErrorToast: true,
      showLoading: true,
      timeout: 30 * 1000
    }
    extraReqConf = Object.assign({}, extraReqConf, extraConf)

    if (extraReqConf.showLoading) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
    }

    // 发起请求
    wx.request({
      // eslint-disable-next-line
      url: BASE_URL + url,
      method: method,
      data,
      header: contentTypeMap[contentType],
      timeout: extraReqConf.timeout,
      dataType: 'json',
      success(response) {
        let res = response.data
        if (typeof res === 'string') {
          // [note] 处理特殊接口返回的行分隔符
          res = res.replace(/\u2028/g, '')
        }

        // todo 在此可以控制token鉴权等处理
        const { code, msg } = res
        if (code !== 200) {
          if (extraReqConf.showErrorToast) {
            wx.showToast({
              title: msg,
              mask: true,
              icon: 'error',
              duration: 3 * 1000
            })
          }
          reject(res)
        } else {
          resolve(res)
        }
      },
      fail(err) {
        const { errMsg, errno } = err

        // 无网络 自定义业务errno: -10001
        const networkErrMap = [5, 600000, 600001, 600003]
        if (networkErrMap.includes(errno)) {
          // eslint-disable-next-line
          reject({
            errMsg,
            code: -10001
          })
        } else {
          wx.showToast({
            title: errMessageMap[errno] || errMsg,
            mask: true,
            icon: 'error',
            duration: 3 * 1000
          })
          reject(err)
        }
      },
      complete() {
        wx.hideLoading()
      }
    })
  })
}

function get(url, data, extraConf, type) {
  return HttpRequest(url, data, extraConf, 'GET', type)
}
function post(url, data, extraConf, type) {
  return HttpRequest(url, data, extraConf, 'POST', type)
}

export default {
  get,
  post
}
