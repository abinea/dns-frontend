<template>
  <t-card :bordered="false">
    <t-space>
      <t-input v-model="snifferName" placeholder="请输入新客户端的名称" />
      <t-button style="margin-bottom: 20px" theme="success" @click="addClient">
        添加客户端
      </t-button>
    </t-space>
    <t-table
      ref="tableRef"
      :data="data"
      :columns="columns"
      :pagination="pagination"
      :editable-row-keys="editableRowKeys"
      bordered
      hover
      lazy-load
      @row-edit="onRowEdit"
    >
      <template #is_enabled="{ row }">
        <t-tag
          v-if="row.is_enabled"
          theme="success"
          shape="round"
          variant="light-outline"
        >
          <check-circle-filled-icon /> 在线
        </t-tag>
        <t-tag v-else shape="round" theme="danger" variant="light-outline">
          <close-circle-filled-icon /> 离线
        </t-tag>
      </template>
      <template #operations="{ row: { id } }">
        <t-space v-if="!editableRowKeys!.includes(id)">
          <t-button size="small" theme="primary" @click="onEdit(id)"
            >修改</t-button
          >
          <t-button size="small" theme="danger" @click="handleDelete(id)"
            >删除</t-button
          >
          <t-button
            size="small"
            theme="default"
            @click="navigateTo(`/timer-detect-sniffer`)"
            >详细信息</t-button
          >
        </t-space>
        <t-space v-else>
          <t-button size="small" theme="danger" @click="onSave(id)">
            保存
          </t-button>
          <t-button size="small" theme="default" @click="onCancel(id)">
            取消
          </t-button>
        </t-space>
      </template>
    </t-table>
  </t-card>
</template>

<script lang="ts" setup>
import { navigateTo } from '@/router'
import { getSnifferList, deleteSniffer } from '@/api'
import {
  CheckCircleFilledIcon,
  CloseCircleFilledIcon,
} from 'tdesign-icons-vue-next'
// import SnifferForm from "./components/form.vue"
import {
  MessagePlugin,
  TableInstanceFunctions,
  TableProps,
  Input,
} from 'tdesign-vue-next'
import { useTableConfig } from '@/utils/table'

const columns = [
  {
    colKey: 'id',
    title: '序号',
    width: '100',
  },
  {
    colKey: 'name',
    title: '客户端名称',
    width: '180',
    edit: {
      component: Input,
      props: {
        clearable: true,
        autofocus: true,
        autoWidth: true,
      },
      // 校验规则，此处同 Form 表单
      rules: [{ required: true, message: '不能为空' }],
      showEditIcon: false,
    },
  },
  {
    colKey: 'is_enabled',
    title: '是否在线',
    width: '100',
  },
  {
    colKey: 'lastreporttime',
    title: '最后上报数据时间',
    width: '180',
  },
  {
    colKey: 'createtime',
    title: '添加时间',
    width: '180',
  },
  {
    colKey: 'reportCount',
    title: '上报数据条数',
    width: '150',
  },
  {
    colKey: 'dohCount',
    title: 'DOH数据条数',
    width: '150',
  },
  {
    colKey: 'operations',
    title: '操作',
    width: '360',
  },
]

const { data, pagination } = useTableConfig({ columns, fetchData })

const snifferName = ref('')

const tableRef = ref<TableInstanceFunctions>()
const editableRowKeys = ref<TableProps['editableRowKeys']>([])
const currentSaveId = ref()
const editMap = {}
const onEdit = (id: number) => {
  if (!editableRowKeys.value!.includes(id)) {
    editableRowKeys.value!.push(id)
  }
}
const updateEditState = (id: number) => {
  const index = editableRowKeys.value!.findIndex(t => t === id)
  editableRowKeys.value!.splice(index, 1)
}

const onCancel = (id: number) => {
  updateEditState(id)
}

const onSave = (id: number) => {
  currentSaveId.value = id
  // 触发内部校验，而后也可在 onRowValidate 中接收异步校验结果
  tableRef.value!.validateRowData(id).then(params => {
    console.log('Event Table Promise Validate:', params)
    if (params.result.length) {
      const r = params.result[0]
      MessagePlugin.error(`${r.col.title} ${r.errorList[0].message}`)
      return
    }
    // 如果是 table 的父组件主动触发校验
    if (params.trigger === 'parent' && !params.result.length) {
      // @ts-ignore
      const current = editMap[currentSaveId.value]
      if (current) {
        data.value!.splice(current.rowIndex, 1, current.editedRow)
        MessagePlugin.success('保存成功')
      }
      updateEditState(currentSaveId.value)
    }
  })
}

const onRowEdit: TableProps['onRowEdit'] = params => {
  const { row, col, value } = params
  console.log(params)
  // @ts-ignore
  const oldRowData = editMap[row.id]?.editedRow || row
  console.log(oldRowData, col.colKey)
  const editedRow = {
    ...oldRowData,
    // @ts-ignore
    [col.colKey]: value,
  }
  // @ts-ignore
  editMap[row.id] = {
    ...params,
    editedRow,
  }
}
async function fetchData() {
  const res = await getSnifferList()
  if (res.data.code == 200) {
    MessagePlugin.success({
      content: '请求成功',
      duration: 1000,
    })
    data.value = res.data.data.sniffers.data
    pagination.value.total = res.data.data.sniffers.count
  } else {
    MessagePlugin.error('请求失败')
  }
}
function addClient() {
  console.log('api 加客户端')
}
async function handleDelete(id: number) {
  const res = await deleteSniffer(id)
  if (res.data.code == 200) {
    MessagePlugin.success('删除成功')
  }
  fetchData()
}
</script>
