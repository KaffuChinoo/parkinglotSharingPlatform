import request from '@/utils/request'
import axios from 'axios'

export default {
  createComment(commentForm) {
    const request1 = request({
      url: '/comments/api/add',
      method: 'post',
      data: commentForm
    })
    const request2 = request({
      url: `/orders/api/statusCommented`,
      method: 'put',
      params: {
        orderId: commentForm.orderId
      }
    })
    return axios.all([request1, request2])
  },
  getCommentList(searchForm) {
    return request({
      url: '/comments/api/get',
      method: 'get',
      params: {
        pageNo: searchForm.pageNo,
        pageSize: searchForm.pageSize,
        username: searchForm.username,
        commentId: searchForm.commentId
      }
    })
  },
  getCommentById(commentId) {
    return request({
      url: '/comments/api/getById',
      method: 'get',
      params: {
        commentId: commentId
      }
    })
  },
  deleteCommentById(commentId) {
    return request({
      url: '/comments/api/deleteById',
      method: 'delete',
      params: {
        commentId: commentId
      }
    })
  }
}

