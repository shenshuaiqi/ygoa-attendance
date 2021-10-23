<template>
  <div class="box">
    <Card :bordered="false" dis-hover>
      <Alert closable show-icon class="position-alert">权限人员设置：只需勾选有权限人员，未勾选人员没有权限编辑</Alert>
      <Form :label-width="120" ref="groupForm" :model="formItem" :rules="ruleValidate">
        <Row :gutter="16">
          <i-col span="9">
            <FormItem label="排班组名称:" prop="groupName">
              <Input placeholder="请输入排班组名称" v-model="formItem.groupName"/>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col span="18">
            <FormItem label="部门:">
              <treeselect noChildrenText="暂无数据" noOptionsText="加载中。。。" :default-expand-level="level" placeholder="请选择部门"
                          :multiple="true" :flat="true"
                          :load-options="loadOptions" @open="openOptions"
                          v-model="formItem.deptIds" :options="treeData"/>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col span="9">
            <FormItem label="包含下级组织:">
              <i-switch v-model="formItem.isRecursion" :true-value="'Y'" :false-value="'N'">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col span="9">
            <FormItem label="排班组人员:">
              <Input @on-click="searchUsers" v-model="users.val" icon="ios-search" class="peoList" readonly
                     placeholder="请选择"/>
            </FormItem>
          </i-col>
        </Row>

        <Row :gutter="16">
          <i-col span="9">
            <FormItem label="权限人员:" prop="userCode">
              <Input @on-click="searchPeo" v-model="formItem.userName" icon="ios-search"
                     class="peoList" readonly placeholder="请选择"/>
            </FormItem>
          </i-col>
        </Row>

        <Row :gutter="16">
          <i-col span="18">
            <FormItem label="备注:">
              <Input v-model="formItem.remark"/>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col span="12" push="4">
            <FormItem>
              <Button type="info" @click="save(editType)" :loading="loading">保存设置</Button>
              <Button type="default" class="close-btn" @click="goBack">取消</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>

      <get-user ref="dialogUser" :type="type" :dialog="selfdialog" @diachose="choseDialog" @discancle="closeDialog"/>
      <get-users ref="dialogUsers" :type="type" :dialog="usersdialog" @diachose="choseUsers" @discancle="closeUsers"/>
    </Card>
  </div>
</template>

<script>
  import GetUser from '@/components/system/users/getUser'
  import GetUsers from '@/components/system/users/GetUsers'
  import {queryDept, getUserByDeptID, queryUserBycodeAndName} from '@/api/user'
  import {
    saveGroup,
    editGroup,
    getGroup,
    getDept,
    getChild
  } from '@/api/attendanceGroup.js'
  import ICol from "iview/src/components/grid/col";
  import {mapMutations} from 'vuex'

  import Treeselect from '@riophae/vue-treeselect'
  import {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'workforcemanagementEdit',
    data() {
      return {
        level: 0,
        editType: 'add',
        listQuery: { // 查询信息
          districtId: '',
          name: '',
          address: '',
          pageNum: 1, // 页码
          pageSize: 1000000 // 每页展示多少条
        },
        selfdialog: false,
        usersdialog: false,
        type: '',
        users: {
          type: 'users',
          val: '',
          data: {}
        },
        checkAdmin: {
          type: 'checkAdmin',
          val: '',
          userList: []
        },
        formItem: {
          groupId: '',
          groupName: '',
          userCode: '',
          userName: '',
          deptId: '00000000-0000-0000-0000-000000000000CCE7AED4',
          deptIds: [],
          userList: [],
          isRecursion: 'N',
          remark: ''
        },
        ruleValidate: {
          groupName: [
            {required: true, message: '排班组名称不能为空', trigger: 'blur'}
          ],
          userCode: [
            {required: true, message: '人员不能为空', trigger: 'change'}
          ],
          deptIds: [
            {
              validator: (rule, value, callback) => {
                if (!(value && value.length > 0)) {
                  callback(new Error('部门不能为空'));
                } else {
                  callback();
                }
              },
              trigger: 'blur'
            }
          ]
        },
        loading: false,
        treeData: [],
      }
    },
    mounted() {
      this.queryDetail()
      //this.treeInit('00000000-0000-0000-0000-000000000000CCE7AED4')
    },
    components: {
      ICol,
      GetUser,
      GetUsers,
      Treeselect
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      async queryDetail() {
        const groupId = this.$route.params.groupId
        if (groupId) {
          this.level = 0
          this.editType = 'edit'

          const {status, data} = await getGroup({groupId: groupId})
          if (status === 200 && data.code === '0000') {
            Object.keys(this.formItem).forEach(key => this.formItem[key] = data.result[key])
            let usersarr = [];
            let userList = data.result.userList
            userList.forEach(item => {
              usersarr.push(JSON.stringify(item))
            })
            this.formItem.userList = usersarr
            if (this.formItem.userList && this.formItem.userList.length > 0) {
              this.users.val = `共${this.formItem.userList.length}人，点击查看`
            } else {
              this.users.val = ''
            }
            let arr = []
            for (let item of data.result.deptIds) {
              const {data: data1, status: status1} = await getChild(item)
              if (status1 === 200 && data1.code === '0000') {
                arr.push(this.getTree(data1.result))
              }
            }
            this.treeData = [].concat.apply([], arr)
          }
        }
      },
      searchPeo() {
        this.type = 'user'
        this.selfdialog = true
      },
      searchUsers() {
        this.type = this.users.type
        this.usersdialog = true
        this.$refs.dialogUsers.userList = JSON.parse(JSON.stringify(this.formItem.userList))
      },
      choseDialog(list) {
        if (list.type === 'user') {
          this.formItem.userName = JSON.parse(list.data).empName
          this.formItem.userCode = JSON.parse(list.data).empNo
        }
        this.selfdialog = false
      },
      closeDialog() {
        this.selfdialog = false
      },
      closeUsers() {
        this.usersdialog = false
      },
      choseUsers(list) {
        if (list.type === 'users') {
          this.formItem.userList = JSON.parse(list.data)
          if (this.formItem.userList && this.formItem.userList.length > 0) {
            this.users.val = `共${this.formItem.userList.length}人，点击查看`
          } else {
            this.users.val = ''
          }
        }
        this.usersdialog = false
      },
      save: async function () {
        this.$refs['groupForm'].validate(async (valid) => {
          if (!valid) {
            this.$Message.error('请将信息填写完整！');
          } else {
            if (this.formItem.userList && this.formItem.userList.length && typeof this.formItem.userList[0] != 'object') {
              let arr = [];
              let userList = this.formItem.userList
              userList.forEach(item => {
                arr.push(JSON.parse(item))
              })
              this.formItem.userList = arr
            }

            let res = null
            if (this.editType === 'add') {
              res = await saveGroup(this.formItem)
            } else {
              res = await editGroup(this.formItem)
            }
            const {status, data} = res
            if (status === 200 && data.code === '0000') {
              this.$refs['groupForm'].resetFields();
              Object.keys(this.formItem).forEach(key => this.formItem[key] = '')
              this.$router.push({
                name: 'workforce-management'
              })
            } else {
              let usersarr = [];
              let userList = this.formItem.userList
              userList.forEach(item => {
                usersarr.push(JSON.stringify(item))
              })
              this.formItem.userList = usersarr
            }
          }
        })
      },
      goBack() {
        this.$router.push({
          name: 'workforce-management'
        })
      },
      treeInit: async function (orgAdminId) {
        const {data, status} = await getDept(orgAdminId)
        if (status === 200 && data.code === '0000') {
          this.treeData = this.getTree(data.result)
        }
      },

      getTree(tree = []) {
        let arr = []
        if (tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj.label = item.orgAdminName
            obj.id = item.orgAdminId
            obj.pid = item.depFatherPK
            obj.open = false
            obj.checked = true
            obj.isDisabled = item.isMyScheduleDept === '0' ? true : false
            if (item.isLeaf === '0') {
              obj.children = null // 递归调用
              obj.loading = false
            }
            arr.push(obj)
          })
        }
        return arr
      },
      async loadOptions({action, parentNode, callback}) {
        // Typically, do the AJAX stuff here.
        // Once the server has responded,
        // assign children options to the parent node & call the callback.
        if (action === 'LOAD_CHILDREN_OPTIONS') {
          const {data, status} = await getDept(parentNode.id)
          if (status === 200 && data.code === '0000') {
            parentNode.children = this.getTree(data.result)
            callback()
          }
        }
      },
      async openOptions() {
        this.treeInit('00000000-0000-0000-0000-000000000000CCE7AED4')
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
    .peoList {
      &:hover {
        cursor: pointer;
      }
    }
    .place-desc {
      font-size: 13px;
      margin-left: 20px;
    }
    .outtime {
      width: auto;
      margin: 0 5px;
    }
    .close-btn {
      margin-left: 10px;
    }
    .radius {
      width: auto;
      font-size: 13px;
      margin-right: 10px;
    }
    .item-hover:hover {
      background: #eff9ff;
      cursor: pointer;
    }

  }

</style>
