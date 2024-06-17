<template>
  <t-card :bordered="false">
    <div class="container">
      <!-- 数据表格 -->
      <div class="table-wrapper">
        <t-table
          row-key="name"
          :data="packetData.packet"
          :columns="columns"
          bordered
          hover
          lazy-load
        >
        </t-table>
        <!-- 操作按钮 -->

        <div class="table-actions">
          <!-- <t-button theme="danger" @click="deletePacket">删除数据包</t-button> -->
          <!-- <t-button theme="primary" @click="reloadData">重新检测</t-button> -->
        </div>
      </div>

      <pre class="packet-data">
      <span v-for="line in rawPacketData" :key="line.offset">
        {{ line.offset }}  {{ line.hex }}  {{ line.ascii }}
      </span>
    </pre>
    </div>
  </t-card>
</template>

<script lang="ts" setup>
import { getPacketDetail } from '@/api'
import { rawPacketData } from '@/mock/raw-packet-data.json'
import { isNil } from 'lodash-es'
import { MessagePlugin } from 'tdesign-vue-next'

const router = useRouter()
const route = useRoute()

interface PacketData {
  packet: any[]
  rawData: any[]
  filteredData: any[]
}

const packetData = reactive<PacketData>({
  packet: [], // JSON数据从外部加载
  rawData: [],
  filteredData: [], // 存储原始数据的新属性
})

const storeId = sessionStorage.getItem('packetId')
if (!route.query.id) {
  if (storeId) {
    router.push({
      query: {
        id: storeId,
      },
    })
    fetchData(Number(storeId))
  } else MessagePlugin.error('缺少数据包ID')
}
fetchData(Number(route.query.id))

async function fetchData(id: number) {
  const res = await getPacketDetail(id)
  const packet = res.data.data.packet
  packetData.rawData = packet.data
  packetData.packet = rows.map(row => {
    if (isNil(row.key)) {
      return { ...row }
    } else {
      return {
        name: row.name,
        value: packet[row.key],
      }
    }
  })
}

const columns = [
  { colKey: 'name', title: '字段名称', width: '150' },
  { colKey: 'value', title: '值', width: '300' },
]

const rows = [
  {
    name: '时间',
    key: 'reported_time',
  },
  {
    name: '1-捕获长度',
    key: 'frame.cap_len',
  },
  {
    name: '以太网源MAC地址',
    key: 'source_mac',
  },
  {
    name: '以太网目的MAC地址',
    key: 'dst_mac',
  },
  {
    name: '网络层协议',
    value: 'ip',
  },
  {
    name: '数据链路层协议',
    value: 'udp',
  },
  {
    name: '应用层协议',
    value: 'dns',
  },
  {
    name: 'IP版本',
    key: 'ip.version',
  },
  {
    name: '源IP地址',
    key: 'source_ip',
  },
  {
    name: '目标IP地址',
    key: 'dst_ip',
  },
  {
    name: 'UDP源端口',
    key: 'source_port',
  },
  {
    name: 'UDP目标端口',
    key: 'dst_port',
  },
  {
    name: 'DNS响应名称',
    key: 'domain',
  },
  {
    name: 'DNS TTL',
    key: 'dns.resp.ttl',
  },
  {
    name: 'DNS Answers类型',
    value: 'TXT',
  },
]

function deletePacket() {
  console.log('删除数据包')
}
</script>

<style lang="less" scoped>
.container {
  padding: 30px 20px;
  display: flex;
}

.table {
  &-wrapper {
    width: 950px;
  }

  &-actions {
    display: flex;
    width: 300px;
    justify-content: space-around;
    margin-top: 20px;
  }
}

.packet-data {
  margin: 0;
  margin-left: 40px;
  width: 1000px;
  /* 设置原始数据区域的宽度 */
  overflow-x: auto;
  /* 如果内容太宽，则允许滚动 */
  white-space: pre-wrap;
  /* 保持文本格式，允许自动换行 */
  /*background-color: #f5f5f5; !* 背景色 *!*/
  /*border: 1px solid #eaecef; !* 边框颜色 *!*/
  /* 内填充 */
  /* 与表格之间的空隙 */
  white-space: pre;
  font-family: 'Consolas', 'Monaco', monospace;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}
</style>
