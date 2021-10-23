<template>
  <div class="box">
    <Card :bordered="false" dis-hover>
      <Form :label-width="80">
        <Row :gutter="16">
          <i-col span="6">
            <FormItem label="部门">
              <Select v-model="listQuery.deptId" filterable clearable >
                <Option v-for="item in shrDepts" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="4">
            <FormItem label="员工姓名">
              <Input v-model="listQuery.applyerName" placeholder="员工姓名" clearable/>
            </FormItem>
          </i-col>
          <i-col span="4">
            <FormItem label="补卡月份">
              <DatePicker type="month" placeholder="选择月份" @on-change="formatMonth" format="yyyy-MM"></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="6">
            <Button type="info" @click="search">查询</Button>&nbsp;
            <Button type="info" @click="exportDatas">导出数据</Button>
          </i-col>
        </Row>
      </Form>
      <Table :loading="loading" size="small" border :columns="columns1" :data="datas">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="success" ghost icon="ios-search" size="small" @click="openBkapply(row)"></Button>
        </template>
      </Table>
      <Page class-name="place-page" :page-size-opts="[20,50,100,500,1000]" show-total show-sizer
            :page-size="listQuery.pageSize" :total="total"
            @on-change="handleCurrentChange" @on-page-size-change="handleCurrentSize"/>

    </Card>
    <Modal :value="dialog" scrollable title="补卡明细" width="900" :mask-closable="false" :closable="false">
      <div slot="footer">
        <Button @click="dialog = false">关闭</Button>
      </div>
      <bk-apply :data="dialogProp.datas"></bk-apply>
    </Modal>

  </div>
</template>

<script>
  import BkApply from '@/view/summary/bkapply/bkapply-detail.vue'
  import {mapActions, mapGetters} from 'vuex'
  import {queryKqBk, downKqBk, queryKqBkDetail, getShrDept} from '@/api/oaapprove.js'
  import {downloadFile} from '@/libs/util'

  export default {
    name: 'cardrecords',
    data() {
      return {
        total: 0,
        listQuery: { // 查询信息
          pageNum: 1, // 页码
          pageSize: 20, // 每页展示多少条
          month: '',
          deptId: '',
          applyerName: ''
        },

        columns1: [
          {
            title: '部门',
            key: 'deptName'
          },
          {
            title: '工号',
            key: 'empCode'
          },
          {
            title: '员工姓名',
            key: 'empName'
          },
          {
            title: '补卡月份',
            key: 'bkMonth'
          },
          {
            title: '补卡次数',
            key: 'bkCount'
          },
          {
            title: '操作',
            width: 80,
            align: 'center',
            slot: 'action'
          }
        ],
        datas: [],
        loading: false,
        dialog: false,
        dialogProp: {
          datas: []
        },
        shrDepts:[]
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    components: {
      BkApply
    },
    mounted() {
      this.queryList()
      this.getShrDept()
    },
    methods: {
      queryList: async function () {
        this.loading = true
        const {status, data} = await queryKqBk(this.listQuery)
        if (status === 200 && data.code === '0000') {
          this.loading = false
          if (data.result.list) {
            this.total = data.result.total
            this.datas = data.result.list
          }
        }
      },
      getShrDept: async function () {
        const {status, data} = await getShrDept()
        if (status === 200 && data.code === '0000') {
         this.shrDepts = data.result
        }
      },
      search() {
        this.listQuery.pageNum = 1;
        this.queryList()
      },
      exportDatas() {
        downloadFile(this.listQuery, downKqBk)
      },
      closePosiView() {
        this.posiDialogView = false
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.queryList()
      },
      handleCurrentSize(val) {
        this.listQuery.pageSize = val
        this.queryList()
      },
      formatMonth(e) {
        this.listQuery.month = e
      },
      async openBkapply(row) {
        const {status, data} = await queryKqBkDetail({
          pageNum: 1, // 页码
          pageSize: 100000, // 每页展示多少条
          month: row.bkMonth,
          applyCode: row.empCode
        })
        if (status === 200 && data.code === '0000') {
          if (data.result.list) {
            //this.total = data.result.total
            this.dialogProp.datas = data.result.list
            this.dialog = true
          }
        }
      }
    },
    filters: {}
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
