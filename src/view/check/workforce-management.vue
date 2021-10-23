<template>
  <div class="box">
    <Card :bordered="false" dis-hover>
      <Form>
        <Row :gutter="16">
          <i-col span="12">
            <FormItem>
              <router-link to="/check/workforce-management-edit" class="ivu-btn ivu-btn-info">
                添加排班组
              </router-link>
            </FormItem>
          </i-col>
          <i-col span="4" push="8">
            <Input search placeholder="输入排班组名称" v-model="listQuery.groupName" @on-search="search"/>
          </i-col>
        </Row>
      </Form>
      <Table size="small" border :columns="columns1" :data="datas">

        <template slot-scope="{ row, index }" slot="action">
          <Button class="group-action" type="success" ghost icon="ios-create-outline" size="small"
                  @click="edit(row)"></Button>
          <Button class="group-action" type="error" ghost icon="ios-backspace-outline" size="small"
                  @click="deleteRow(row)"></Button>
        </template>
      </Table>
      <Page class-name="place-page" show-total :page-size="this.listQuery.pageSize" :total="total"
            @on-change="handleCurrentChange"/>
    </Card>
  </div>
</template>

<script>
  import {getGroupList, deleteGroup} from '@/api/attendanceGroup.js'

  export default {
    name: 'workforcemanagement',
    data() {
      return {
        total: 0,
        listQuery: { // 查询信息
          groupName: '',
          pageNum: 1, // 页码
          pageSize: 20 // 每页展示多少条
        },
        posiDialog: false,
        columns1: [
          {
            title: '序号',
            type: 'index',
            width: 80
          },
          {
            title: '排班组名称',
            key: 'groupName'
          },
          {
            title: '权限人员',
            key: 'userName',
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '创建人',
            key: 'creatorName'
          },
          {
            title: '操作',
            width: 150,
            slot: 'action',
            align: 'center'
          }
        ],
        datas: []
      }
    },
    filters: {},
    components: {},
    computed: {},
    mounted() {
      this.queryList()
    },
    methods: {
      queryList: async function () {
        const {status, data} = await getGroupList(this.listQuery)
        if (status === 200 && data.code === '0000') {
          this.datas = data.result.list
          this.total = data.result.total
        }
      },
      search() {
        this.listQuery.pageNum = 1
        this.queryList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.queryList()
      },
      edit(row) {
        this.$router.push({
          name: 'workforce-management-edit',
          params: {
            groupId: row.groupId
          }
        })
      },
      deleteRow: async function (row) {
        this.$Modal.confirm({
          title: '提示',
          content: `是否删除${row.groupName}？`,
          onOk: async () => {
            const {status, data} = await deleteGroup({groupId: row.groupId})
            if (status === 200 && data.code === '0000') {
              this.queryList()
              this.$Notice.success({
                title: '成功',
                desc: data.message
              })
            }
          }
        });
      }
    }
  }
</script>

<style scoped lang="less">
  .box {
    .position-alert {
      font-size: 13px;
      a {
        margin-left: 20px;
      }
      margin-bottom: 20px;
    }
    .radius {
      width: auto;
      font-size: 13px;
      margin-right: 10px;
    }
    .place-desc {
      font-size: 13px;
      margin-left: 20px;
    }
    .place-page {
      margin-top: 10px;
    }
    .group-action {
      margin-right: 5px;
    }
  }
</style>
