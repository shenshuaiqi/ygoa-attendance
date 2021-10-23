<template>
<div class="box">
    <Card :bordered="false" dis-hover>
        <Form>
            <Row :gutter="16" style="margin-bottom:10px">
            <i-col span="8" style="text-align: left;">
               <h2>新增班组</h2>
            </i-col>
            <i-col span="4" push="8" style="text-align: right;">
                <DatePicker type="date" placeholder="选择日期" @on-change="search"></DatePicker>
            </i-col>
            <i-col span="4" push="8" style="text-align: right;">
                <router-link to="/check/team-check-edit" class="ivu-btn ivu-btn-info">
                添加班组
              </router-link>
            </i-col>
            </Row>
        </Form>
         <Table :border="showBorder" :columns="columns10" :data="data9">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
         </Table>
    </Card>
</div>
</template>
<script>
    import expandRow from './table-expand.vue';
    import {getNewPersonSignRecordGroup} from '@/api/attendanceGroup.js'
    export default {
        name: 'teamCheckList',
        components: { expandRow },
        data () {
            return {
                columns10: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '班组名称',
                        key: 'groupName'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
                data9: [
                    // {
                    //     groupName: '临时组1',
                    //     workingDate:'2021-07-21',
                    //     workingHours: '8:00',
                    //     OffHours: '17:00',
                    //     createTime: '2021-07-21 8:00',
                    //     userName:''
                    // },
                    // {
                    //     groupName: '临时组2',
                    //     workingDate:'2021-07-22',
                    //     workingHours: '8:00',
                    //     OffHours: '17:00',
                    //     createTime: '2021-07-21 8:00',
                    //     userName:''
                    // }
                    
                ],
                userList:[],
                showBorder: true
            }
        },
        mounted() {
            this.queryList();
        },
        methods: {
            remove (index) {
                this.data6.splice(index, 1);
            },
            async queryList() {
                let date = new Date()
                const year = date.getFullYear()
                const month = (date.getMonth()  + 1) < 10 ? "0" + (date.getMonth()+1) :(date.getMonth()+1)
                const day = date.getDate()  < 10 ? "0" + date.getDate() : date.getDate()
                var pbResultDate=this.nowDate = year + "-"+ month + "-" + day
                const {status, data} = await getNewPersonSignRecordGroup(pbResultDate)
                this.data9 = data.result;    
            },
            async search(val) {
                const pbResultDate = val
                const {status, data} = await getNewPersonSignRecordGroup(pbResultDate)
                this.data9 = data.result;
            },
        },
    }
</script>
