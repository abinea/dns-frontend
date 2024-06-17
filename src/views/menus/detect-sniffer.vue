<template>
  <div role="header">
    <div style="display: flex; margin-bottom: 30px">
      <t-space>
        <t-input-number
          label="监听端口"
          id="listen-port"
          theme="normal"
          v-model="port"
          tips="默认监听80端口"
        />
        <t-button theme="primary" @click="setCurrentPort">修改端口</t-button>
        <t-divider layout="vertical" />
        <t-button theme="primary" @click="startListen">开始监听</t-button>
        <t-button theme="danger" @click="stopListen">停止监听</t-button>

        <t-divider layout="vertical" />
        <t-button theme="warning" @click="execWordVec">快速检测</t-button>
        <t-button theme="warning" @click="execBert">精确检测</t-button>
        <t-divider layout="vertical" />
        <t-button theme="success" @click="saveToDb">保存数据到数据库</t-button>
      </t-space>
    </div>
    <t-input
      :style="{ width: '300px' }"
      v-model.trim="keywords"
      placeholder="请输入关键字搜索"
    ></t-input>
  </div>
  <t-tabs :default-value="1">
    <t-tab-panel :value="1" label="访问数据">
      <t-table
        :data="filteredData"
        :columns="columns"
        :pagination="pagination"
        stripe
        hover
        lazy-load
        style="width: 100%; background: #122a42; color: #6cb7c9"
      >
        <template #ifAnomalous="{ row }">
          <span v-if="row.ifAnomalous == '1'" style="color: white">
            <t-button theme="danger">是</t-button>
          </span>
          <span v-else>
            <t-button type="success">否</t-button>
          </span>
        </template>
      </t-table>
    </t-tab-panel>
  </t-tabs>
</template>

<script lang="ts" setup>
import {
  DialogPlugin,
  MessagePlugin,
  type TdPaginationProps,
} from 'tdesign-vue-next'

const columns = [
  {
    colKey: 'name',
    title: '请求方法',
  },
  {
    colKey: 'value',
    title: 'GET参数',
  },
  {
    colKey: 'value',
    title: 'POST参数',
  },
  {
    colKey: 'value',
    title: 'Cookie信息',
  },
  {
    colKey: 'value',
    title: '用户代理',
  },
  {
    colKey: 'value',
    title: '接受语言',
  },
  {
    colKey: 'value',
    title: '来源IP',
  },
  {
    colKey: 'value',
    title: '检测方法',
  },
  {
    colKey: 'value',
    title: '是否恶意',
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

const port = ref(80)
const keywords = ref('')

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
    requestMethod: '',
    requestUri: '',
    postData: '',
    cookie: '',
    userAgent: '',
    acceptLang: '',
    ip_src: '',
    studymethod: '',
    ifAnomalous: 1,
  },
])

getCurrentData()
function fetchTableData(res: any) {
  tableData.value = res.data
  pagination.value.current = pagination.value.defaultCurrent
  pagination.value.pageSize = pagination.value.defaultPageSize
}
async function getCurrentData() {
  try {
    const res = await get('getCurrentData')
    console.log(res)
    fetchTableData(res)
  } catch (error) {
    console.log(error)
  }
}

function get(type: string) {
  console.log(type)
  return new Promise(r => r({ data: { a: 'any' } }))
}
function post(type: string, payload: any) {
  console.log(type, payload)
  return new Promise(r => r({ data: { a: 'any' } }))
}
async function setCurrentPort() {
  if (!port.value) {
    MessagePlugin.warning('请输入监听端口')
    return
  }
  try {
    const res = await post('setCurrentPort', { currentPort: port.value })
    console.log(res)
    MessagePlugin.success('设置端口成功')
  } catch (error) {
    console.log(error)
  }
}
function startListen() {
  const instance = DialogPlugin({
    header: '保存数据提示',
    body: '若是第一次监听数据，请点击确定。若不是，请确认已将数据保存到数据库。若已保存数据库，点击继续，否则请取消。',
    theme: 'warning',
    confirmBtn: '确定',
    onConfirm: async () => {
      const res = await get('listen')
      console.log(res)
      if (res.data == 'timer mode') {
        MessagePlugin.error('当前处于定时期间，请等待定时结束或取消定时！')
      } else {
        MessagePlugin.success('开始监听')
      }
    },
    cancelBtn: '取消',
    onCancel: () => {
      MessagePlugin.info('已取消监听')
    },
    onClose: () => {
      MessagePlugin.info('已取消监听')
      instance.hide()
    },
  })
}
async function stopListen() {
  try {
    const res = await get('stoplisten')
    console.log(res)
    fetchTableData(res)
    MessagePlugin.success('监听完成')
  } catch (error) {
    console.log(error)
  }
}
async function saveToDb() {
  try {
    const res = await get('saveToDbCurrent')
    console.log(res)
    MessagePlugin.success('保存数据成功')
  } catch (error) {
    console.log(error)
  }
}
async function execWordVec() {
  try {
    const res = await get('WordVeclearning')
    console.log(res)
    fetchTableData(res)
    MessagePlugin.success('学习完成')
  } catch (error) {
    console.log(error)
  }
}
async function execBert() {
  try {
    const res = await get('Bertlearning')
    console.log(res)
    fetchTableData(res)
    MessagePlugin.success('学习完成')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="less" scoped>
:deep(.t-table) {
  & th {
    color: #6cb7c9;
    /* 字体颜色 */
    font-size: 16px;
    /* background-color: #122a42; */
    border: 0;
    height: 30px;
    line-height: 30px;
  }

  & tr,
  td {
    color: #6cb7c9;
    font-size: 12px;
    background-color: #fff;
    border: 0;
    height: 30px;
    line-height: 30px;
  }
}

.searchbox {
  margin: 15px auto;
  border: none;
  padding: 0;
  border-radius: 0;
  box-shadow: 0 0 0 #000000;
}
</style>
