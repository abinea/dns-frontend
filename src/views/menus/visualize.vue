<template>
  <main class="charts-wrapper">
    <div>
      <t-row :gutter="14">
        <t-col :lg="6" :xs="12">
          <t-card title="TTL为0相关性" :bordered="false">
            <div class="deploy-panel-left">
              <div ref="pieShellRef" id="Pie-shell" class="chart"></div>
            </div>
          </t-card>
        </t-col>
        <t-col :lg="6" :xs="12">
          <t-card title="域名记录相关性" :bordered="false">
            <div ref="pieMethodsRef" id="Pie-get-post" class="chart"></div>
          </t-card>
        </t-col>
      </t-row>
    </div>
    <div>
      <t-row :gutter="12">
        <t-col :lg="6" :xs="12">
          <t-card title="TTL相关性" :bordered="false">
            <div class="deploy-panel-left">
              <div ref="barShellRef" id="Bar-shell" class="chart"></div>
            </div>
          </t-card>
        </t-col>
        <t-col :lg="6" :xs="12">
          <t-card title="目标IP top4" :bordered="false">
            <div ref="barIpRef" id="Bar-ip" class="chart"></div>
          </t-card>
        </t-col>
      </t-row>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { EChartsType, init as initChart } from 'echarts'

const pieShellRef = ref()
const pieMethodsRef = ref()
const barShellRef = ref()
const barIpRef = ref()
const charts = ref<EChartsType[]>([])
const allDataNumDay = [
  { value: 2, name: 'DNS隐秘隧道中TTL为0' }, // Represents 66.7%
  { value: 1, name: 'DNS隐秘隧道中TTL不为0' },
] // Represents 33.3%],
const dataGetPostDay = [
  { value: 144, name: 'DNS隐秘隧道中txt记录' }, // Represents 66.7%
  { value: 77, name: 'DNS隐秘隧道中非txt记录' },
]
const dataBarDay = ['40', '20', '1200', '1250']
const dataBarXlabelDay = [
  'TTL为0是隐秘隧道',
  'TTL为其他是隐秘隧道',
  'TTL为0不是隐秘隧道',
  'TTL为其他不是隐秘隧道',
]

// 当天攻击ip数据
const ipAttackNumDay_list = [120, 150, 180, 210]
const ipAttackName = [
  '193.198.77.26',
  '56.205.138.201',
  '108.9.60.33',
  '46.191.3.62',
]
const data = reactive({
  allDataNumDay,
  dataGetPostDay,
  dataBarDay,
  dataBarXlabelDay,
  ipAttackNumDay_list,
  ipAttackName,
})

onMounted(() => {
  getDayData()
  drawPieDayAllData()
  drawPieDayGetPost()
  drawBarShellDayChart()
  drawBarIpDayChart()
  const viewElem = document.body
  const resizeObserver = new ResizeObserver(() => {
    // 加个if约束，当Echarts1和Echarts2存在时再执行resize()，否则图表不存在时运行到这会报错。
    charts.value.forEach(chart => chart?.resize())
  })
  resizeObserver.observe(viewElem)
})

window.onresize = function () {
  pieShellRef.value!.resize()
}

function get(type: string) {
  console.log(type)
  return new Promise(r => r({ data: { a: 'any' } }))
}

async function getDayData() {
  try {
    const res = await get('getDayData')
    data.allDataNumDay = res.data['allDataNumDay']
    data.dataGetPostDay = res.data['dataGetPostDay']
    data.dataBarDay = res.data['dataBarDay']
    data.dataBarXlabelDay = res.data['dataBarXlabelDay']
    data.ipAttackNumDay_list = res.data['ipAttackNumDay_list']
    data.ipAttackName = res.data['ipAttackName']
  } catch (error) {
    console.log(error)
  }
}

// 流量总数饼状图
function drawPieDayAllData() {
  // 基于准备好的dom，初始化echarts实例
  const chart = initChart(pieShellRef.value)
  charts.value.push(chart)

  const pieSeriesData = [
    { value: 40, name: 'DNS隐秘隧道中TTL为0' }, // 40 entries
    { value: 20, name: 'DNS隐秘隧道中TTL不为0' }, // 20 entries
  ]

  const total = pieSeriesData.reduce((acc, item) => acc + item.value, 0)

  // 指定图表的配置项和数据
  const option = {
    color: ['#6495ED', '#B22222'],
    tooltip: {
      trigger: 'item',
      formatter: '{a} : {c} ({d}%)',
    },
    legend: {
      orient: 'horizontal', // 布局方式，默认为水平布局，可选为：'horizontal' ¦ 'vertical'
      // 水平安放位置，默认为左侧，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
      x: 'center',
      // 垂直安放位置，默认为全图顶端，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
      y: 'bottom',
      textStyle: {
        fontSize: 16, // Set the font size for the legend text
        fontWeight: 'bold',
      },
      // 重写legend显示样式
      formatter(name: string) {
        // Find the corresponding data entry
        const dataItem = pieSeriesData.find(item => item.name === name)
        const value = dataItem ? dataItem.value : 0
        // Calculate percentage
        const percentage = ((value / total) * 100).toFixed(2)
        // Return the formatted legend label
        return `${name}: ${value}条 (${percentage}%)`
      },
      data: pieSeriesData.map(item => item.name),
    },
    title: {
      text: 'DNS隐秘隧道TTL为0相关性分析',
      left: 'center',
      textStyle: {
        color: '#9AA8D4',
        fontSize: 20,
      },
    },

    series: [
      {
        name: 'anomalous',
        type: 'pie',
        radius: 80,
        //  center: ['25%', '40%'],
        data: allDataNumDay,

        label: {
          show: true,
          formatter(res) {
            return res.data.category
          },
        },
      },
      {
        name: 'normal',
        type: 'pie',
        radius: 80,
        //  center: ['25%', '40%'],
        data: allDataNumDay,
        label: {
          show: true,
          formatter(res) {
            return res.data.category
          },
        },
      },
    ],
  }
  chart.setOption(option)
}
// 恶意流量get、post饼状图
function drawPieDayGetPost() {
  // 基于准备好的dom，初始化echarts实例
  const chart = initChart(pieMethodsRef.value)
  charts.value.push(chart)
  // 指定图表的配置项和数据
  // Updated data for the pie chart
  const pieSeriesData = [
    { value: 144, name: 'TXT记录' }, // 140 TXT records
    { value: 77, name: '非TXT记录' }, // 55 non-TXT records
  ]
  const total = pieSeriesData.reduce((sum, item) => sum + item.value, 0)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} : {c} ({d}%)',
    },
    legend: {
      orient: 'horizontal', // Use 'horizontal' for a centered layout
      // 水平安放位置，默认为左侧，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
      x: 'center',
      // 垂直安放位置，默认为全图顶端，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
      y: 'bottom',
      textStyle: {
        fontSize: 16, // Set the font size for the legend text
        fontWeight: 'bold',
      },
      formatter(name) {
        const dataItem = pieSeriesData.find(item => item.name === name)
        const value = dataItem ? dataItem.value : 0
        const percentage = ((value / total) * 100).toFixed(2)
        return `${name} ${percentage}% (${value}条)` // Adjusted format
      },
      data: pieSeriesData.map(item => item.name),
    },
    title: {
      text: '检测DNS隐秘隧道与请求域名记录的关系',
      left: 'center',
      textStyle: {
        color: '#9AA8D4',
        fontSize: 20,
      },
    },

    series: [
      {
        name: 'TXT记录',
        type: 'pie',
        radius: 80,
        //  center: ['25%', '40%'],
        data: data.dataGetPostDay,
        label: {
          show: true,
          formatter(res) {
            return res.data.category
          },
        },
      },
      {
        name: '非TXT记录',
        type: 'pie',
        radius: 80,
        //  center: ['25%', '40%'],
        data: dataGetPostDay,
        label: {
          show: true,
          formatter(res) {
            return res.data.category
          },
        },
      },
    ],
  }
  chart.setOption(option)
}
// 当天流量柱状图
function drawBarShellDayChart() {
  const chart = initChart(barShellRef.value)
  charts.value.push(chart)

  // 指定图表的配置项和数据
  const option = {
    color: ['#3498db', '#2ecc71', '#9b59b6', '#f1c40f'], // This line can be removed if we apply color directly in series
    title: {
      text: 'DNS隐秘隧道与TTL关系',
      left: 'center',
      textStyle: {
        color: '#9AA8D4',
        fontSize: 20,
      },
    },
    legend: {
      data: ipAttackName, // Make sure this is correctly passed
      textStyle: {
        fontSize: '12',
        color: '#fff',
      },
      right: 'right',
      show: true,
    },
    tooltip: {
      trigger: 'axis',
    },
    toolbox: {
      show: true,
      feature: {
        magicType: { show: true, type: ['line', 'bar'] },
        saveAsImage: { show: true },
      },
    },
    calculable: true,
    grid: {
      left: '0%',
      right: '10%',
      top: '10%',
      bottom: '0%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: dataBarXlabelDay,
        axisLabel: {
          textStyle: {
            color: '#111',
            fontWeight: 'bold', // This will make the text bold

            fontSize: 14, // Increase the font size as needed
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          textStyle: {
            color: '#111',
            fontWeight: 'bold', // This will make the text bold

            fontSize: 15, // Increase the font size as needed
          },
        },
      },
    ],
    series: [
      {
        name: 'Data Series',
        type: 'bar',
        data: [
          { value: dataBarDay[0], itemStyle: { color: '#3498db' } },
          { value: dataBarDay[1], itemStyle: { color: '#2ecc71' } },
          { value: dataBarDay[2], itemStyle: { color: '#9b59b6' } },
          { value: dataBarDay[3], itemStyle: { color: '#f1c40f' } },
        ],
        barWidth: '30%', // Optional: adjust width as needed
      },
    ],
  }
  chart.setOption(option)
}

// 当天攻击ip柱状图
function drawBarIpDayChart() {
  const barColors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f']
  const coloredData = ipAttackNumDay_list.map(function (item, index) {
    return {
      value: item,
      itemStyle: {
        color: barColors[index % barColors.length],
      },
    }
  })

  const chart = initChart(barIpRef.value)
  charts.value.push(chart)

  const option = {
    title: {
      text: 'DNS隐秘隧道目标IP的top4',
      left: 'center',
      textStyle: {
        color: '#9AA8D4',
        fontSize: 20,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    toolbox: {
      show: true,
      feature: {
        magicType: { show: true, type: ['line', 'bar'] },
        saveAsImage: { show: true },
      },
    },
    calculable: true,
    grid: {
      left: '3%',
      right: '4%',
      top: '12%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'value',
        axisLabel: {
          textStyle: {
            color: '#111',
            fontWeight: 'bold',
            fontSize: 17,
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'category',
        data: ipAttackName,
        axisLabel: {
          textStyle: {
            color: '#111',
            fontWeight: 'bold',
            fontSize: 17,
          },
        },
      },
    ],
    series: [
      {
        name: 'IP',
        type: 'bar',
        data: coloredData,
        barWidth: '60%',
      },
    ],
  }
  chart.setOption(option)
}
</script>

<style lang="less" scoped>
.charts-wrapper {
  display: grid;
  column-gap: 16px;
  row-gap: 16px;
  width: 98%;

  :deep(.t-card) {
    padding: 8px;
  }

  :deep(.t-card__title) {
    font-size: 20px;
    font-weight: 500;
  }
}

.chart-layout .chart-col {
  padding: 15px;
}

.chart {
  width: 100%;
  height: 400px;
}

/* Add responsive design for smaller screens */
@media (max-width: 991px) {
  .chart {
    height: 300px;
    /* Smaller height for smaller screens */
  }
}
</style>
