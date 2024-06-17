<template>
  <t-card :bordered="false">
    <t-table
      row-key="id"
      :data="data"
      :columns="columns"
      :pagination="pagination"
      bordered
      hover
      lazy-load
      style="width: 100%"
    >
      <template #is_doh="{ row }">
        <t-tag shape="round" :theme="row.is_doh ? 'danger' : 'success'">
          {{ row.is_doh ? '是' : '否' }}
        </t-tag>
      </template>
      <template #operation="{ row: { id } }">
        <t-button size="small" theme="default" @click="onNavigate(id)"
          >查看详情</t-button
        >
      </template>
    </t-table>
  </t-card>
</template>

<script lang="ts" setup>
import { TdPaginationProps, MessagePlugin } from 'tdesign-vue-next'
import { getPacketList } from '@/api'
import { navigateTo } from '@/router'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const data = ref([])

onMounted(async () => {
  const flag = userStore.userInfo.isSuperuser
  const res = await getPacketList(flag)
  MessagePlugin.success({
    content: '请求成功',
    duration: 1000,
  })
  console.log(res)
  data.value = res.data.data.packets.data
  pagination.value.total = res.data.data.packets.count
})

const columns = [
  {
    colKey: 'reported_time',
    title: '时间戳',
    width: '180',
  },
  // {
  //   colKey: 'srcMAC',
  //   title: '源MAC',
  //   width: '180',
  // },
  // {
  //   colKey: 'destMAC',
  //   title: '目的MAC',
  //   width: '180',
  // },
  {
    colKey: 'source_ip',
    title: '源IP',
    width: '180',
  },
  {
    colKey: 'dst_ip',
    title: '目的IP',
    width: '180',
  },
  {
    colKey: 'is_doh',
    title: '是否DNS（DOH）隐秘隧道',
    align: 'center',
    width: '150',
  },
  {
    colKey: 'operation',
    title: '操作',
    width: '100',
  },
]

const pagination = ref<TdPaginationProps>({
  defaultPageSize: 5,
  defaultCurrent: 1,
  pageSizeOptions: [1, 2, 3, 5, 20],
  total: 0, //总信息数
  // onPageSizeChange: (pageSize, { current }) => {
  //   viewData.value = getList(tableData.value, current, pageSize)
  // },
  // onCurrentChange: (current, { pageSize }) => {
  //   viewData.value = getList(tableData.value, current, pageSize)
  // },
})

const filteredData = computed(() => {
  const text = keywords.value
  if (text) {
    let keys = text.split(' ').map(String.prototype.toLowerCase)
    console.log(keys)
    return tableData.value.filter(item => {
      return Object.keys(item).some(k => {
        return keys.some(key => {
          // @ts-ignore
          return item[k].toString().toLowerCase().includes(key)
        })
      })
    })
  } else {
    return tableData.value
  }
})

const tableData = ref([
  {
    index: 1,
    timestamp: '2024/3/18/14:11:11',
    srcMAC: 'DA:4F:95:A6:7A:E6',
    srcIP: '172.31.171.15',
    destMAC: '63:C8:51:69:D0:B0',
    destIP: '204.106.240.53',
    requestMethod: 'mysite.edu.bot.hackbiji.top',
    requestType: 'TXT',
    packetType: 'response',
    TTL: 0,
    isTunnel: '是',
  },
  {
    index: 2,
    timestamp: '2024/3/18/14:12:12',
    srcMAC: '1B:AE:A2:99:AB:A5',
    srcIP: '172.31.171.32',
    destMAC: '44:71:98:4C:AB:F4',
    destIP: '203.126.118.38',
    requestMethod: 'demo.net.bot.hackbiji.top',
    requestType: 'MX',
    packetType: 'query',
    TTL: 5,
    isTunnel: '否',
  },
  {
    index: 3,
    timestamp: '2024/3/18/14:13:13',
    srcMAC: '79:11:B3:AC:24:9C',
    srcIP: '172.31.171.123',
    destMAC: 'D1:DA:31:81:F9:AE',
    destIP: '210.118.170.15',
    requestMethod: 'example.com.bot.hackbiji.top',
    requestType: 'CNAME',
    packetType: 'query',
    TTL: 5,
    isTunnel: '否',
  },
  {
    index: 4,
    timestamp: '2024/3/18/14:14:14',
    srcMAC: '85:72:37:C6:E7:07',
    srcIP: '172.31.171.90',
    destMAC: '67:8E:1A:13:D9:9E',
    destIP: '81.138.71.238',
    requestMethod: 'site.info.bot.hackbiji.top',
    requestType: 'AAAA',
    packetType: 'query',
    TTL: 4,
    isTunnel: '否',
  },
  {
    index: 5,
    timestamp: '2024/3/18/14:15:15',
    srcMAC: '35:38:E3:EB:36:3C',
    srcIP: '172.31.171.24',
    destMAC: 'EC:9B:B4:47:A9:6D',
    destIP: '203.126.118.38',
    requestMethod: 'example.com.bot.hackbiji.top',
    requestType: 'A',
    packetType: 'response',
    TTL: 4,
    isTunnel: '否',
  },
  {
    index: 6,
    timestamp: '2024/3/18/14:16:16',
    srcMAC: '5A:A1:77:54:A0:33',
    srcIP: '172.31.171.220',
    destMAC: 'D4:C3:ED:CC:39:78',
    destIP: '204.106.240.53',
    requestMethod: 'demo.net.bot.hackbiji.top',
    requestType: 'A',
    packetType: 'response',
    TTL: 11,
    isTunnel: '否',
  },
  {
    index: 7,
    timestamp: '2024/3/18/14:17:17',
    srcMAC: '9F:65:6E:7A:AC:0B',
    srcIP: '172.31.171.46',
    destMAC: 'EB:6F:1A:8B:56:1A',
    destIP: '203.126.118.38',
    requestMethod: 'site.info.bot.hackbiji.top',
    requestType: 'TXT',
    packetType: 'response',
    TTL: 13,
    isTunnel: '否',
  },
  {
    index: 8,
    timestamp: '2024/3/18/14:18:18',
    srcMAC: '05:57:FA:36:11:BB',
    srcIP: '172.31.171.187',
    destMAC: '4D:36:FB:4C:CC:4F',
    destIP: '203.126.118.38',
    requestMethod: 'demo.net.bot.hackbiji.top',
    requestType: 'AAAA',
    packetType: 'response',
    TTL: 13,
    isTunnel: '否',
  },
  {
    index: 9,
    timestamp: '2024/3/18/14:19:19',
    srcMAC: '64:3E:62:2E:25:48',
    srcIP: '172.31.171.118',
    destMAC: 'C5:D7:A5:11:1B:34',
    destIP: '204.106.240.53',
    requestMethod: 'demo.net.bot.hackbiji.top',
    requestType: 'CNAME',
    packetType: 'query',
    TTL: 17,
    isTunnel: '否',
  },
  {
    index: 10,
    timestamp: '2024/3/18/14:20:20',
    srcMAC: '90:C3:FE:B7:83:B4',
    srcIP: '172.31.171.89',
    destMAC: '4F:DF:91:0A:19:8A',
    destIP: '210.118.170.15',
    requestMethod: 'mysite.edu.bot.hackbiji.top',
    requestType: 'AAAA',
    packetType: 'response',
    TTL: 5,
    isTunnel: '否',
  },
  {
    index: 11,
    timestamp: '2024/3/18/14:21:21',
    srcMAC: '63:AC:1D:59:68:31',
    srcIP: '172.31.171.27',
    destMAC: '20:1A:D2:B0:31:E8',
    destIP: '81.138.71.238',
    requestMethod: 'testsite.org.bot.hackbiji.top',
    requestType: 'A',
    packetType: 'query',
    TTL: 6,
    isTunnel: '否',
  },
  {
    index: 12,
    timestamp: '2024/3/18/14:22:22',
    srcMAC: '60:10:26:92:99:B5',
    srcIP: '172.31.171.202',
    destMAC: '9A:C4:7C:CA:E2:29',
    destIP: '204.106.240.53',
    requestMethod: 'site.info.bot.hackbiji.top',
    requestType: 'CNAME',
    packetType: 'response',
    TTL: 16,
    isTunnel: '否',
  },
  {
    index: 13,
    timestamp: '2024/3/18/14:23:23',
    srcMAC: 'BA:62:A4:28:5A:73',
    srcIP: '172.31.171.111',
    destMAC: '3C:1A:95:B5:24:55',
    destIP: '108.179.34.214',
    requestMethod: 'example.com.bot.hackbiji.top',
    requestType: 'MX',
    packetType: 'response',
    TTL: 20,
    isTunnel: '否',
  },
  {
    index: 14,
    timestamp: '2024/3/18/14:24:24',
    srcMAC: '57:63:A2:CA:56:86',
    srcIP: '172.31.171.88',
    destMAC: '6A:15:51:E5:58:76',
    destIP: '210.118.170.15',
    requestMethod: 'demo.net.bot.hackbiji.top',
    requestType: 'MX',
    packetType: 'response',
    TTL: 8,
    isTunnel: '否',
  },
  {
    index: 15,
    timestamp: '2024/3/18/14:25:25',
    srcMAC: 'CD:CE:4D:3E:76:6A',
    srcIP: '172.31.171.213',
    destMAC: 'FA:47:6E:FB:64:D4',
    destIP: '81.138.71.238',
    requestMethod: 'demo.net.bot.hackbiji.top',
    requestType: 'CNAME',
    packetType: 'query',
    TTL: 11,
    isTunnel: '否',
  },
])

function onNavigate(id: number) {
  sessionStorage.setItem('packetId', id.toString())
  navigateTo(`/visual-map?id=${id}`)
}
</script>
