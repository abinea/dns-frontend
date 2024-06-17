import {
  type TdPaginationProps,
  type BaseTableColumns,
  TableProps,
} from 'tdesign-vue-next'

interface UseTableConfigOptions {
  columns: BaseTableColumns
  fetchData: (...args: unknown[]) => unknown
}

export function useTableConfig(options: UseTableConfigOptions) {
  const { columns, fetchData } = options

  const data = ref<TableProps['data']>()
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
  onMounted(fetchData)

  return {
    data,
    columns,
    pagination,
  }
}
