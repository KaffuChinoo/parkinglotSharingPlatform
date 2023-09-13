import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/api/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/users/api/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/users/api/logout',
    method: 'post'
  })
}
