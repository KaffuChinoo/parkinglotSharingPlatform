import request from '@/utils/request'
import axios from 'axios'

export default {
  getOrderList(searchForm) {
    return request({
      url: '/orders/api/list',
      method: 'get',
      params: {
        username: searchForm.username,
        pageSize: searchForm.pageSize,
        pageNo: searchForm.pageNo,
        price: searchForm.price,
        orderId: searchForm.orderId
      }
    })
  },
  updateStatus(parkingLotId, orderId) {
    const request1 = request({
      url: `/parking/api/status`,
      method: 'put',
      params: {
        parkingLotId: parkingLotId
      }
    })
    const request2 = request({
      url: `/orders/api/status`,
      method: 'put',
      params: {
        orderId: orderId
      }
    })
    return axios.all([request1, request2])
  }
}
