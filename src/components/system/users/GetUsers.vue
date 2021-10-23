<template>
  <Modal class="user-box" :value="dialog" draggable scrollable title="选择人员" width="1000" @on-cancel="cancle"
         @on-ok="chose">
    <Form :label-width="80">
      <Row :gutter="16">
        <i-col span="9">
          <FormItem label="部门名称">
            <Checkbox v-model="recursion" true-value="1" false-value="0">筛选部门下所有人员</Checkbox>
          </FormItem>
          <Tree :data="treeData" :load-data="loadData" @on-select-change="handleSelected"
                style="height: 300px;overflow: auto"></Tree>
        </i-col>
        <i-col span="9">
          <FormItem label="用户列表">
            <Input search placeholder="请输入姓名或工号检索" v-model="keyValue" @on-search="keyup"/>
          </FormItem>
          <div class="demo-spin-container" v-if="spinShow">
            <Spin fix size="large"></Spin>
          </div>

          <List v-if="!spinShow" size="small" style="height: 300px;overflow: auto">
            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
              <Checkbox v-for="(item,index) in choseData" :key="index" :label="JSON.stringify(item)">
                <ListItem style="display: inline-block">
                  {{item.empName}}【{{item.empNo}}】{{item.primaryPositionName}}
                </ListItem>
              </Checkbox>
            </CheckboxGroup>
          </List>
          <div>
            <Checkbox
              :disabled="!(choseData&&choseData.length)"
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll">{{checkAll|checkallFilter}}
            </Checkbox>
          </div>
        </i-col>
        <i-col span="6">
          <FormItem label="已选用户">
          </FormItem>
          <div style="height: 300px;overflow: auto">
            <Tag v-for="(item,index) in userList" :key="index" closable @on-close="handleClose(JSON.parse(item))">
              {{JSON.parse(item).empName}}【{{JSON.parse(item).empNo}}】
            </Tag>
          </div>
        </i-col>
      </Row>
    </Form>
  </Modal>
</template>

<script>
  import {unique} from '@/libs/tools'
  import {getDepts, getUserByDeptID, queryUserBycodeAndName} from '@/api/user.js'

  export default {
    name: 'get-users',
    props: {
      dialog: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        modal12: this.dialog,
        spinShow: false,
        treeData: [],
        dept: '',
        indeterminate: false,
        checkAll: false,
        checkTxt: '全选',
        checkAllGroup: [],
        choseData: [],
        userList: [],
        keyValue: '',
        recursion: '0'
      }
    },
    mounted() {
      this.treeInit('00000000-0000-0000-0000-000000000000CCE7AED4')
    },
    filters: {
      checkallFilter: value => {
        return value === true ? '全不选' : '全选'
      }

    },
    methods: {
      chose() {
        this.$emit('diachose', {data: JSON.stringify(this.userList), type: this.type})
        this.indeterminate = false
        this.checkAll = false
        this.checkTxt = '全选'
        this.checkAllGroup = []
        this.choseData = []
        this.userList = []
        this.keyValue = ''
      },
      cancle() {
        this.$emit('discancle', this.type)
        this.indeterminate = false
        this.checkAll = false
        this.checkTxt = '全选'
        this.checkAllGroup = []
        this.choseData = []
        this.userList = []
        this.keyValue = ''
      },
      loadData: async function (item, callback) {
        const {data, status} = await getDepts(item.id)
        if (status === 200 && data.code === '0000') {
          callback(this.getTree(data.result))
        }
      },
      treeInit: async function (orgAdminId) {
        const {data, status} = await getDepts(orgAdminId)
        if (status === 200 && data.code === '0000') {
          this.treeData = this.getTree(data.result)
        }
      },
      /*getDepts: async function () {
        const {data, status} = await getDepts()
        if (status === 200 && data) {
          // this.treeData = this.getTree(data)
          this.treeData = data
        }
      },*/
      getTree(tree = []) {
        let arr = []
        if (tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj.title = item.orgAdminName
            obj.id = item.orgAdminId
            obj.expand = false
            obj.selected = false
            if (item.isLeaf === '0') {
              obj.children = [] // 递归调用
              obj.loading = false
            }
            arr.push(obj)
          })
        }
        return arr
      },
      handleSelected(arr, items) { // arr 选择的节点
        this.spinShow = true
        this.checkAll = false
        this.indeterminate = false
        this.checkAllGroup = []
        if (items && items.selected) {
          this.choseData = []
          arr.forEach(item => {
            getUserByDeptID({orgAdminId: item.id, recursion: this.recursion}).then(res => {
              if (res.status === 200 && res.data.code === '0000') {
                this.spinShow = false
                res.data.result.forEach(val => {
                  this.choseData.push(val)
                })
              }
            })
          })
        } else {
          this.choseData = []
          this.spinShow = false
        }
      },
      handleCheckAll() {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false
        if (this.checkAll) {
          this.choseData.forEach(item => {
            this.checkAllGroup.push(JSON.stringify(item))
            this.userList.push(JSON.stringify(item))
          })
          this.userList = unique(this.userList)
        } else {
          this.checkAllGroup = []
        }
      },
      checkAllGroupChange(data) {
        if (data.length === this.choseData.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        }
        data.forEach(item => {
          this.userList.push(item)
        })
        this.userList = unique(this.userList)
      },
      handleClose(item) {
        this.userList.forEach((val, index) => {
          if (JSON.parse(val).empNo === item.empNo) {
            this.userList.splice(index, 1)
          }
        })
      },
      keyup: async function () {
        if (this.keyValue) {
          this.spinShow = true
          setTimeout(async () => {
            const {data, status} = await queryUserBycodeAndName(this.keyValue)
            if (status === 200 && data.code === '0000') {
              this.spinShow = false
              this.choseData = data.result
            }
          }, 2000)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .user-box {
    overflow: hidden;
    .demo-spin-container {
      width: 100%;
      height: 300px;
      position: relative;
      overflow: auto;
    }
  }

</style>
