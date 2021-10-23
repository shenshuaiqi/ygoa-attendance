// table-expand.vue

<template>
    <Table class="table-expand" :border="showBorder" v-model="showIndex" :columns="columns1" :data="pbsDate" size="small"></Table>
</template>
<script>
    export default {
        props: {
            row: Object
        },
        data () {
            return {   
                columns1: [
                    {
                        title: '姓名',
                        key: 'userName'
                    },
                    {
                        title: '工号',
                        key: 'userCode'
                    },
                    {
                        title: '日期',
                        key: 'date'
                    },
                    {
                        title: '上班时间',
                        key: 'preTime'
                    },
                    {
                        title: '下班时间',
                        key: 'nextTime'
                    }
                ],
                pbsDate:[],
                // data1:this.row.kqSignRecordGroupDetailList[0].pbs,
                showBorder: true,
                showStripe: true,
                showHeader: true,
                showIndex: true,
            }
        },
        mounted() {
            this.queryPbs();
        },
        methods: {
            async queryPbs(){
                for(let obj of this.row.kqSignRecordGroupDetailList){
                    if(obj.pbs[0].pbResult.length>0){
                        obj["date"] = obj.pbs[0].pbResult[0].date;  
                    }
                    if(obj.pbs[0].pbworkTime.length>0){
                        obj["preTime"] = obj.pbs[0].pbworkTime[0].preTime;
                        obj["nextTime"] = obj.pbs[0].pbworkTime[0].nextTime;
                    }
                    this.pbsDate.push(obj);
                }
                  console.log(this.pbsDate)
                // this.pbsDate=this.row.kqSignRecordGroupDetailList
            }
        },
    }
</script>
<style>
  .table-expand .ivu-table-header th{
    font-weight: bold;
    background-color: #e6effb;
  }
</style>