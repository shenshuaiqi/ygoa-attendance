<template>
  <div class="box">
    <Card :bordered="false" dis-hover>
      <Form :label-width="80">
        <Row :gutter="16">
          <i-col span="4">
            <FormItem label="工号">
              <Input v-model="listQuery.userCode" placeholder="请输入工号" clearable/>
            </FormItem>
          </i-col>
          <i-col span="4">
            <FormItem label="姓名">
              <Input v-model="listQuery.userName" placeholder="请输入姓名" clearable/>
            </FormItem>
          </i-col>
          <i-col span="4">
            <FormItem label="shr状态">
              <Select v-model="listQuery.syncStatus">
                <Option value="sync">已同步</Option>
                <Option value="unSync">未同步</Option>
                <Option value="duplicate">同步多次</Option>
                <Option value="notExist">同步失败</Option>
                <Option value="formatError">同步失败</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="4">
            <FormItem label="开始时间">
              <DatePicker type="date" placeholder="选择日期" v-model="listQuery.startDate"></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="4">
            <FormItem label="结束时间">
              <DatePicker type="date" placeholder="选择日期" v-model="listQuery.endDate"></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="3">
            <Button type="info" @click="search">查询</Button>
          </i-col>
        </Row>
      </Form>
      <Table :loading="loading" size="small" border :columns="columns1" :data="datas">
        <template slot-scope="{ row, index }" slot="isEnter">
          <Tag v-if="row.isEnter" :color="row.isEnter | colorFormater">{{row.isEnter | enterFormater}}</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="isSyncShr">
          <Tag v-if="row.isSyncShr" :color="row.isSyncShr | isSyncShrColor">{{row.isSyncShr | isSyncShrFormater}}</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="isComDevice">
          <Tag v-if="row.isComDevice" :color="row.isComDevice | isComDeviceColor">{{row.isComDevice |
            isComDeviceFormater}}
          </Tag>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button class="group-action" type="success" ghost icon="ios-search" size="small"
                  @click="viewResult(row)"></Button>
        </template>
      </Table>
      <Page class-name="place-page" show-total :page-size="listQuery.pageSize" :total="total"
            @on-change="handleCurrentChange"/>
      <attendance-view :positions="positions" :type="'chosePlace'" :dialog="posiDialogView"
                       @closeposi="closePosiView"/>
    </Card>


  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {queryResult, queryPointListByUsercode} from '@/api/attendanceGroup.js'
  import AttendanceView from '@/view/components/gdmap/attendanceView.vue'

  export default {
    name: 'perresult',
    data() {
      return {
        total: 0,
        listQuery: { // 查询信息
          pageNum: 1, // 页码
          pageSize: 20, // 每页展示多少条
          userCode: '',
          userName: '',
          syncStatus: 'sync',
          startDate: '',
          endDate: ''
        },

        columns1: [
          {
            title: '打卡时间',
            key: 'signTime',
            width: 150
          },
          {
            title: '姓名',
            key: 'userName',
            width: 80
          },
          {
            title: '工号',
            key: 'userCode',
            width: 80
          },
          {
            title: '打卡地址',
            key: 'address'
          },
          /*{
            title: '经度',
            key: 'longitude'
          },
          {
            title: '纬度',
            key: 'latitude'
          },*/
          {
            title: '打卡状态',
            slot: 'isEnter',
            width: 100
          },
          {
            title: 'shr状态',
            slot: 'isSyncShr',
            width: 120
          },
          {
            title: '常用设备',
            slot: 'isComDevice',
            width: 100
          },
          {
            title: '操作',
            width: 80,
            align: 'center',
            slot: 'action'
          }
        ],
        datas: [],
        configPoint: [],
        dialog: false,
        formItem: {
          rowGuid: '',
          empName: '',
          districtId: '',
          userCode: ''
        },
        positions: '',
        posiDialogView: false,
        loading: false
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    components: {
      AttendanceView
    },
    mounted() {
      //this.queryList()
    },
    methods: {
      queryList: async function () {
        if (!(this.listQuery.startDate && this.listQuery.endDate)) {
          this.$Message.warning("开始时间或结束时间不允许为空！")
          return;
        }
        this.loading = true
        const {status, data} = await queryResult(this.listQuery)
        if (status === 200 && data.code === '0000') {
          this.loading = false
          if (data.result.list) {
            this.total = data.result.total
            this.datas = data.result.list
          }
          //this.configPoint = data.result.configPoint
        }
      },
      search() {
        this.listQuery.pageNum = 1;
        this.queryList()
      },
      async viewResult(item) {
        if (item.latitude && item.longitude) {
          const {status, data} = await queryPointListByUsercode({userCode: item.userCode});
          if (status === 200 && data.code === '0000') {
            this.configPoint = data.result
          }
          this.positions = JSON.stringify({
            configPoint: this.configPoint,
            attendRecords: item
          })
          this.posiDialogView = true
        }
      },
      closePosiView() {
        this.posiDialogView = false
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.queryList()
      },
    },
    filters: {
      enterFormater: item => {
        const state = {
          "Y": '正常',
          'N': '外勤',
          'BK': '补卡'
        }
        return state[item]
      },
      colorFormater: item => {
        const state = {
          "Y": 'primary',
          'N': 'success',
          'BK': 'warning'
        }
        return state[item]
      },
      isSyncShrFormater: item => {
        const state = {
          'sync': '已同步',
          'unSync': '未同步',
          'duplicate': '同步多次',
          'notExist': '同步失败',
          'formatError': '同步失败'
        }
        return state[item]
      },
      isComDeviceFormater: item => {
        const state = {
          'Y': '是',
          'N': '否'
        }
        return state[item]
      },
      isSyncShrColor: item => {
        const state = {
          'sync': 'success',
          'unSync': 'warning',
          'duplicate': 'success',
          'notExist': 'error',
          'formatError': 'error'
        }
        return state[item]
      },
      isComDeviceColor: item => {
        const state = {
          'Y': 'success',
          'N': 'error'
        }
        return state[item]
      }
    }
  }
</script>

<style scoped lang="less">
  .box {
    .place-page {
      margin-top: 10px;
    }
    .group-action {
      margin-right: 5px;
    }
  }
</style>
