import request from '@/utils/request'
import axios from 'axios'

export default {
  getAllLocations() {
    return request({
      url: '/locations/api/getAll',
      method: 'get',
      params: {
        pageNo: 1,
        pageSize: 100
      }
    })
  }
}
