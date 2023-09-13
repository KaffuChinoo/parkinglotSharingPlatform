import request from '@/utils/request'

export default {
  getUserList(searchForm) {
    return request({
      url: '/users/api/list',
      method: 'get',
      params: {
        pageNo: searchForm.pageNo,
        pageSize: searchForm.pageSize,
        username: searchForm.username,
        email: searchForm.email
      }
    })
  },
  addUser(user) {
    return request({
      url: '/users/api/add',
      method: 'post',
      data: user
    })
  },
  getUserById(id) {
    return request({
      url: `/users/${id}`,
      method: 'get'
    })
  },
  deleteUserById(id) {
    return request({
      url: `/users/${id}`,
      method: 'delete'
    })
  },
  updateUser(user) {
    return request({
      url: `/users/api/update`,
      method: 'put',
      data: user
    })
  },
  saveUser(user) {
    if (user.userId == null) {
      return this.addUser(user)
    }
    return this.updateUser(user)
  },
  getUserByName(username) {
    return request({
      url: `/users/api/getByName`,
      method: 'get',
      params: {
        username: username
      }
    })
  },
  resetUserPwd(userForm) {
    return request({
      url: `/users/api/resetPwd`,
      method: 'put',
      data: userForm
    })
  }
}
