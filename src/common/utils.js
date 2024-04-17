// 传进来10以下的字符，就返回前面带一个'0'
export function addZero(num) {
  if (num < 10) {
    return '0' + num
  } else {
    return num
  }
}

export function objToUrl(param) {
  if (param === null) return ''
  var tempArr = []
  for (var key in param) {
    if (param.hasOwnProperty(key) && param[key] !== undefined && param[key] !== null) {
      tempArr.push(key + '=' + param[key])
    }
  }
  if (tempArr.length) {
    return '?' + tempArr.join('&')
  }
  return ''
}

export function urlToObj(url = window.location.href) {
  if (url === null || url.indexOf('?') < 0) return {}
  let query = url.split('?')[1]
  let tempObj = {}
  query.split('&').forEach(function (item) {
    let key = item.split('=')[0]
    tempObj[key] = decodeURI(item.split('=')[1])
  })
  return tempObj
}

export function getQuery(query, url = window.location.href) {
  if (!query) return ''
  if (!url.split('?')[1]) return ''
  const _query = url.split('?')[1]
  const _eachQuery = _query.split('&')
  let i = 0
  while (i < _eachQuery.length) {
    let _keyValue = _eachQuery[i].split('=')
    if (_keyValue[0] === query) {
      return _keyValue[1]
    }
    i++
  }
  return ''
}

export function changeUrlParam(base, find, value) {
  var pattern = find + '=([^&]*)'
  var replaceText = find + '=' + value
  if (base.match(pattern)) {
    var tmp = new RegExp('(' + find + '=)([^&]*)', 'ig')
    tmp = base.replace(tmp, replaceText)
    return tmp
  } else {
    if (base.match(/\?/)) {
      return base.match(/\?.+/) ? base + '&' + replaceText : base + replaceText
    } else {
      return base + '?' + replaceText
    }
  }
}

export function delQuery(query, url = window.location.href) {
  let urlArr = url.split('?')
  if (urlArr.length > 1 && urlArr[1].indexOf(query) > -1) {
    let _search = urlArr[1]
    let obj = {}
    let arr = _search.split('&')
    let hasInterrogationMark = arr.length > 1 ? '?' : ''
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=')
      obj[arr[i][0]] = arr[i][1]
    }
    delete obj[query]
    return `${urlArr[0]}${hasInterrogationMark}${JSON.stringify(obj).replace(/["{}]/g, '').replace(/:/g, '=').replace(/,/g, '&')}`
  } else {
    return url || window.location.href
  }
}
