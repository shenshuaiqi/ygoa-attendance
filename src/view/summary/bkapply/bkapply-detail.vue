<template>
  <div class="box">
    <Table  size="small" border max-height="450" :columns="columns" :data="data">
    </Table>
  </div>
</template>

<script>

  import {mapActions, mapGetters} from 'vuex'
  import {queryKqBkDetail} from '@/api/oaapprove.js'

  export default {
    name: "bkapply-detail",
    props: {
      data:{
        type:Array
      }
    },
    watch: {
      data(val, oldVal) {
        this.data = val
      }
    },
    data() {
      return {
        loading: false,
        datas: [],
        listQuery: { // 查询信息
          pageNum: 1, // 页码
          pageSize: 100000, // 每页展示多少条
          month: '',
          applyCode: ''
        },
        columns: [
          {
            title: '部门',
            key: 'deptName'
          },
          {
            title: '工号',
            key: 'empCode'
          },
          {
            title: '姓名',
            key: 'empName'
          },
          {
            title: '补卡日期',
            key: 'bkDate'
          },
          {
            title: '补卡时间',
            key: 'bkTime'
          },
          {
            title: '补卡原因',
            key: 'remark'
          }
        ]
      }
    },
    methods: {

    }
  }

</script>

<style scoped>

</style>
