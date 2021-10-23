<template>
  <div>
    <Row :gutter="20">
      <i-col style="margin-bottom: 20px;">

      </i-col>
    </Row>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="6" v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="attendanceData" text="当月出勤率"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="yearData" seriesname="出勤天数" yname="天" text="出勤统计"/>
        </Card>
      </i-col>
    </Row>

    <Footer style="text-align: center;margin-top: 40px">永钢协同办公-考勤管理平台 &copy; 2020 | 运维电话：59577</Footer>
    <!-- <Row>
       <Card shadow>
         <example style="height: 310px;"/>
       </Card>
     </Row>-->
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import InforCard from '_c/info-card'
  import CountTo from '_c/count-to'
  import {ChartPie, ChartBar} from '_c/charts'
  import Example from './example.vue'
  import {attendNum, attendCurrentMonthNum, attendByYear} from '@/api/attendanceGroup.js'
  import {queryKqBk, downKqBk, queryKqBkDetail, getShrDept} from '@/api/oaapprove.js'

  export default {
    name: 'home',
    components: {
      InforCard,
      CountTo,
      ChartPie,
      ChartBar,
      Example
    },
    data() {
      return {
        inforCardData: [
          {title: '请假记录', icon: 'md-locate', count: 0, color: '#19be6b'},
          {title: '历史更新', icon: 'md-share', count: 3, color: '#ed3f14'}
        ],
        attendanceData: [],
        yearData: {
          "1月": 0,
          "2月": 0,
          "3月": 0,
          "4月": 0,
          "5月": 0,
          "6月": 0,
          "7月": 0,
          "8月": 0,
          "9月": 0,
          "10月": 0,
          "11月": 0,
          "12月": 0
        }
      }
    },
    mounted() {
      this.queryKqBk()
      this.getAttendNum()
      this.getAttendCurrentMonthNum()
      this.getAttendByYear()
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      async getAttendNum() {
        const {status, data} = await attendNum()
        if (status === 200 && data.code === '0000') {
          this.inforCardData.unshift(
            {title: '考勤记录', icon: 'ios-stats', count: data.result.attendanceNum, color: '#2d8cf0'}
          )
        }else {
          this.inforCardData.unshift(
            {title: '考勤记录', icon: 'ios-stats', count: 0, color: '#2d8cf0'}
          )
        }
      },
      async queryKqBk() {
        const {status, data} = await queryKqBk({
          pageNum: 1, // 页码
          pageSize: 1000000, // 每页展示多少条
          month: '',
          deptId: '',
          applyerName: this.userInfo.userName
        })
        if (status === 200 && data.code === '0000') {
          if (data.result.list.length) {
            this.inforCardData.unshift(
              {title: '补卡申请', icon: 'md-card', count: data.result.list[0].bkCount, color: '#ff9900'}
            )
          }else {
            this.inforCardData.unshift(
              {title: '补卡申请', icon: 'md-card', count: 0, color: '#ff9900'}
            )
          }
        } else {
          this.inforCardData.unshift(
            {title: '补卡申请', icon: 'md-card', count: 0, color: '#ff9900'}
          )
        }
      },
      async getAttendCurrentMonthNum() {
        const {status, data} = await attendCurrentMonthNum()
        if (status === 200 && data.code === '0000') {
          this.attendanceData.push(
            {value: data.result.factNum, name: '实际打卡'},
            {value: data.result.outside, name: '外勤打卡'}
          )
        }
      },
      async getAttendByYear() {
        const {status, data} = await attendByYear()
        if (status === 200 && data.code === '0000') {
          this.yearData = data.result
        }
      },
    }
  }
</script>

<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>
