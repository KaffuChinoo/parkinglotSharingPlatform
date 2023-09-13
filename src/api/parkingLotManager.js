import request from '@/utils/request'
import axios from 'axios'

export default {
  getParkingLotList(searchForm) {
    return request({
      url: '/parking/api/list',
      method: 'get',
      params: {
        pageNo: searchForm.pageNo,
        pageSize: searchForm.pageSize,
        address: searchForm.address,
        price: searchForm.price,
        creator: searchForm.creator,
        district: searchForm.district,
        username: searchForm.username
      }
    })
  },
  getParkingLotListByName(searchForm) {
    return request({
      url: '/parking/api/list',
      method: 'get',
      params: {
        pageNo: searchForm.pageNo,
        pageSize: searchForm.pageSize,
        address: searchForm.address,
        price: searchForm.price,
        creator: searchForm.username
      }
    })
  },
  addParkingLot(parkingLot) {
    return request({
      url: '/parking/api/add',
      method: 'post',
      data: parkingLot
    })
  },
  getParkingLotById(id) {
    return request({
      url: `/parking/${id}`,
      method: 'get'
    })
  },
  deleteParkingLotById(id) {
    return request({
      url: `/parking/${id}`,
      method: 'delete'
    })
  },
  updateParkingLot(parkingLot) {
    return request({
      url: `/parking/api/update`,
      method: 'put',
      data: parkingLot
    })
  },
  saveParkingLot(parkingLot) {
    if (parkingLot.parkingLotId == null) {
      return this.addParkingLot(parkingLot)
    }
    return this.updateParkingLot(parkingLot)
  },
  saveParkingLotOrder(parkingLot, username) {
    const request1 = request({
      url: '/parking/api/update',
      method: 'put',
      data: parkingLot
    })
    const request2 = request({
      url: '/orders/api/add',
      method: 'post',
      params: {
        parkingLotId: parkingLot.parkingLotId,
        username: username,
        price: parkingLot.price
      }
    })
    return axios.all([request1, request2])
  }
}
