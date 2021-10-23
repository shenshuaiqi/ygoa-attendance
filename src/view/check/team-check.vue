<template>
<div class="box">
    <Card :bordered="false" dis-hover>
         <Form>
            <Row :gutter="16" style="margin-bottom:10px">
            <i-col span="12" style="text-align: left;">
               <h2>{{ formItem.currentDep }}</h2>
            </i-col>
            <i-col span="4" push="8" style="text-align: right;">
                <DatePicker type="date" placeholder="选择日期"  @on-change="search"></DatePicker>
            </i-col>
            </Row>
        </Form>
        <Row :gutter="16">
            <Col span="6" v-for="(item,index) in formItem.data" :key="index">
                <Card class="card">
                    <p slot="title">{{ item.deptName }}</p>
                    <a href="#" slot="extra" @click="queryRecord(item)">
                        <Icon type="ios-loop-strong"></Icon>
                        详情
                    </a>
                    <p class="time">打卡时间：{{ item.date }}</p>
                    <i-circle
                        :size="165"
                        :trail-width="4"
                        :stroke-width="5"
                        :percent="75"
                        stroke-linecap="square"
                        stroke-color="#43a3fb"
                        class="num">
                        <div class="demo-Circle-custom">
                            <h1>{{ item.normalNum }}人</h1>
                            <p>打卡人数</p>
                            <span>
                                未打卡人数
                                <i>{{ item.notNormalNum }}人</i>
                            </span>
                        </div>
                    </i-circle>
                </Card>
            </Col>
        </Row>
    </Card>
    <Modal
        v-model="modal1"
        title="点名详情"
        width="1280">
         <Tabs value="name1">
            <TabPane label="所有人员" name="name1">
                <Table border :columns="columns12" :data="allList">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.name }}</strong>
                    </template>
                    <template  slot="action">
                        <img width="70" style="margin-top:5px" src="" alt="">
                    </template>
                </Table>
            </TabPane>
            <TabPane label="已打卡人员" name="name2">
                <Table border :columns="columns12" :data="normalList">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.name }}</strong>
                    </template>
                    <template  slot-scope="{ row }" slot="action">
                        <img width="70" style="margin-top:5px" :src="row.photo" alt="">
                    </template>
                </Table>
            </TabPane>
            <TabPane label="未打卡人员" name="name3">
                <Table border :columns="columns1" :data="notNormalList">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.name }}</strong>
                    </template>
                </Table>
            </TabPane>
        </Tabs>
    </Modal>
    </div>
</template>
<script>
  import {getAllPersonSignRecord} from '@/api/attendanceGroup.js'
       export default {
        name: 'teamCheck',
        data () {
            return {
                columns12: [
                    {
                        title: '打卡人',
                        slot: 'name'
                    },
                    {
                        title: '工号',
                        key: 'code'
                    },
                    {
                        title: '打卡日期',
                        key: 'signTime'
                    },
                    {
                        title: '打卡定位',
                        key: 'address'
                    },
                    {
                        title: '打卡实时照片',
                        slot: 'action',
                        width: 150,
                        align: 'center',
                        key:'photo'
                    }
                ],
                data6: [
                    {
                        name: '薛城',
                        num: '027984',
                        time:'2021-07-12 17:20',
                        address: '江苏永钢集团有限公司(15号门)'
                    },
                    {
                        name: '卢伟',
                        num: '033848',
                        time:'2021-07-12 17:20',
                        address: '江苏永钢集团有限公司(15号门)'
                    },
                    {
                        name: '张世杰',
                        num: '025984',
                        time:'2021-07-12 17:20',
                        address: '江苏永钢集团有限公司(15号门)'
                    },
                    {
                        name: '顾建伟',
                        num: '018952',
                        time:'2021-07-12 17:20',
                        address: '江苏永钢集团有限公司(15号门)'
                    }
                ],
                columns1: [
                    {
                        title: '打卡人',
                        slot: 'name'
                    },
                    {
                        title: '工号',
                        key: 'code'
                    },
                    {
                        title: '打卡日期',
                        key: 'signTime'
                    }
                ],
                data1: [
                    {
                        name: '刘青海',
                        num: '027984',
                        time:'2021-07-12'
                    },
                    {
                        name: '黄建',
                        num: '033848',
                        time:'2021-07-12'
                    },
                    {
                        name: '宋显起',
                        num: '025984',
                        time:'2021-07-12'
                    },
                    {
                        name: '陈兴',
                        num: '018952',
                        time:'2021-07-12'
                    }
                ],
                modal1: false,
                formItem: [],
                allList:[],
                normalList: [],
                notNormalList: []
            }
        },
        mounted() {
            this.queryList();
        },
        methods: {
            show (index) {
                this.$Modal.info({
                    title: 'User Info',
                    content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
                })
            },
            remove (index) {
                this.data6.splice(index, 1);
            },
            async queryList() {
                let date = new Date()
                const year = date.getFullYear()
                const month = (date.getMonth()  + 1) < 10 ? "0" + (date.getMonth()+1) :(date.getMonth()+1)
                const day = date.getDate()  < 10 ? "0" + date.getDate() : date.getDate()
                var signTime=this.nowDate = year + "-"+ month + "-" + day
                const {status, data} = await getAllPersonSignRecord(signTime)
                if (status === 200 && data.code === '0000') {
                    this.formItem = data.result;
                }
            },
            async queryRecord(item) {
                this.modal1 = true;
                this.normalList = item.normal;
                this.notNormalList = item.notNormal;
            },
            async search(val) {
                // debugger
                const signTime = val
                const {status, data} = await getAllPersonSignRecord(signTime)
                this.formItem = data.result;
            },
        }
    }
</script>
<style lang="less">
    .card{margin-bottom: 15px;}
    .ivu-card-body{
        text-align: center;
    }
    .ivu-card-body .time{
        text-align: left;
    }
    .time{
       margin-bottom: 10px;
    }
    .demo-Circle-custom{
        & h1{
            color: #3f414d;
            font-size: 28px;
            font-weight: normal;
        }
        & p{
            color: #657180;
            font-size: 14px;
            margin: 10px 0 15px;
        }
        & span{
            display: block;
            padding-top: 15px;
            color: #657180;
            font-size: 14px;
            &:before{
                content: '';
                display: block;
                width: 50px;
                height: 1px;
                margin: 0 auto;
                background: #e0e3e6;
                position: relative;
                top: -15px;
            };
        }
        & span i{
            font-style: normal;
            color: #3f414d;
        }
    }
</style>