import request from '@/utils/request'
import axios from 'axios'

export default {
  createFollow(parkingLotId, username) {
    return request({
      url: '/follows/api/add',
      method: 'put',
      params: {
        parkingLotId: parkingLotId,
        username: username
      }
    })
  },
  deleteFollow(parkingLotId, username) {
    return request({
      url: '/follows/api/delete',
      method: 'delete',
      params: {
        parkingLotId: parkingLotId,
        username: username
      }
    })
  }
}
