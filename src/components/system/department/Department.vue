<template>
  <Modal :value="dialog" draggable scrollable title="选择部门" width="600"  :closable="false">
    <div slot="footer">
      <Button type="default" @click="cancle">取消</Button>
    </div>
    <Form :label-width="80">
      <Row :gutter="16">
        <i-col span="24">
       <!-- <FormItem label="部门名称"></FormItem>-->
        <Tree :data="treeData" :load-data="loadData" @on-select-change="handleSelected"
              style="height: 300px;overflow: auto"></Tree>
        </i-col>
      </Row>
    </Form>
  </Modal>
</template>

<script>
  import {unique} from '@/libs/tools'
  import {getDepts, getUserByDeptID, queryUserBycodeAndName} from '@/api/user.js'
  import ICol from "iview/src/components/grid/col";

  export default {
    components: {ICol},
    name: 'department',
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
        treeData: [],
        choseData: []
      }
    },
    mounted() {
      this.treeInit('00000000-0000-0000-0000-000000000000CCE7AED4')
    },

    methods: {
      chose() {
        this.$emit('diachose', {data: JSON.stringify(this.userList), type: this.type})
        this.choseData = []

      },
      cancle() {
        this.$emit('discancle', this.type)
        this.choseData = []
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
        if (items && items.selected) {
          this.choseData = items
          this.$emit('diachose', {data: JSON.stringify(this.choseData), type: this.type})
        } else {
          this.choseData = []
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
