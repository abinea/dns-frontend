import { request } from '@/utils/request'

interface Sniffer {
  id: number
  refresh_apikey: boolean
  is_enabled: boolean
  is_deleted: boolean
  name: string
  userid: number
}

export function getSnifferDetail(id: number) {
  return request({
    method: 'GET',
    url: `sniffer/detail/${id}`,
  })
}

export function getSnifferList() {
  return request({
    method: 'GET',
    url: `sniffer/list`,
    params: {
      limit: 100,
      skip: 0,
    },
  })
}

export function createSniffer(data: { name: string }) {
  return request({
    method: 'POST',
    url: `sniffer/create`,
    data,
  })
}

export function updateSniffer(data: Partial<Sniffer>) {
  return request({
    method: 'PATCH',
    url: `sniffer/update`,
    data,
  })
}

export function deleteSniffer(id: number) {
  return request({
    method: 'DELETE',
    url: `sniffer/delete/${id}`,
  })
}
