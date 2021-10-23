<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
  import echarts from 'echarts'
  import tdTheme from './theme.json'
  import {on, off} from '@/libs/tools'

  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: 'ChartBar',
    props: {
      value: Object,
      text: String,
      subtext: String,
      yname: String,
      seriesname: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dom: null
      }
    },
    methods: {
      resize() {
        this.dom.resize()
      },
      redrawEcharts() {
        let xAxisData = Object.keys(this.value)
        let seriesData = Object.values(this.value)
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          xAxis: {
            type: 'category',
            data: xAxisData
          },
          yAxis: {
            type: 'value',
            name: this.yname
          },
          series: [{
            data: seriesData,
            type: 'bar',
            name: this.seriesname
          }]
        }
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      }
    },
    mounted() {
      this.$nextTick(this.redrawEcharts)
    }
    ,
    watch: {
      value() {
        this.redrawEcharts();
      }
    }
    ,
    beforeDestroy() {
      off(window, 'resize', this.resize)
    }
  }
</script>
