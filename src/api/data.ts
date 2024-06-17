import { request } from '@/utils/request'

export function getPacketList(isSuperuser: boolean) {
  return request({
    method: 'GET',
    url: `/data/packet_list`,
    params: {
      limit: 100,
      skip: 0,
      all: isSuperuser,
    },
  })
}

export function getPacketDetail(id: number) {
  return request({
    method: 'GET',
    url: `/data/packet_detail/${id}`,
  })
}

export function updateDataManual(files: any) {
  return request({
    method: 'GET',
    url: `/data/upload`,
    data: { files },
  })
}
