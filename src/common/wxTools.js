/**
 * 获取小程序设置
 * @returns {Promise<unknown>}
 */
export function getSetting() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(rs) {
        resolve(rs)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

/**
 * 获取系统信息
 */
export function saveSystemInfo() {
  const sysytemData = wx.getStorageSync('systemInfo')
  if (!sysytemData || !sysytemData.model) {
    const systemInfo = wx.getSystemInfoSync()
    wx.setStorageSync('systemInfo', systemInfo)
  }
}

/**
 * 获取胶囊按钮信息
 */
export function saveMenuButtonInfo() {
  const menuData = wx.getStorageSync('menuButtonInfo')
  if (!menuData || !menuData.top) {
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
    wx.setStorageSync('menuButtonInfo', menuButtonInfo)
  }
}

/**
 * 获取导航栏高度
 * @returns {*}
 */
export function getNavBarHeight() {
  const systemInfo = wx.getStorageSync('systemInfo')
  const menuButtonInfo = wx.getStorageSync('menuButtonInfo')
  const { statusBarHeight } = systemInfo
  const { top, height } = menuButtonInfo
  return (top - statusBarHeight) * 2 + height + statusBarHeight
}

/**
 * 下载并转发文件
 * @param fileName 文件名。用于转发时显示文件名称
 * @param filePath 下载文件路径
 */
export function downloadAndShare(fileName, filePath) {
  if (!filePath) throw Error('请检查要下载的文件路径')

  wx.showLoading({
    title: '下载中...',
    mask: true
  })
  wx.downloadFile({
    url: filePath,
    success(res) {
      // [note] 下载完成后转发
      wx.shareFileMessage({
        filePath: res.tempFilePath,
        fileName: fileName || res.tempFilePath,
        success() {},
        fail() {
          wx.showToast({
            title: '转发失败,请重试！',
            icon: 'none'
          })
        }
      })
    },
    fail() {
      wx.showToast({
        title: '下载失败,请重试！',
        icon: 'none'
      })
    },
    complete() {
      wx.hideLoading()
    }
  })
}
