import request from '@common/request'

/**
 * 测试接口
 */
export function testList() {
  return request.get(
    '/projectCategory/list',
    {
      name: 1
    },
    {
      showLoading: true
    }
  )
}
