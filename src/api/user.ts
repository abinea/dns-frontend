import { request } from '@/utils/request'

export function changePwd(data: { currentPwd: string; newPwd: string }) {
  return request({
    method: 'POST',
    url: '/user/changePwd',
    data,
  })
}

export function getUserProfile() {
  return request({
    method: 'GET',
    url: '/user/profile',
  })
}

export function updateUserProfile(data: { full_name: string; email: string }) {
  return request({
    method: 'PATCH',
    url: `/user/profile`,
    data,
  })
}
