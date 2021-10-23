<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        {{userInfo.userName}}
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!--<DropdownItem name="message">
          消息中心
          <Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>-->
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import './user.less'
  import {mapActions, mapGetters} from 'vuex'
  import {localClear} from '@/libs/util'

  export default {
    name: 'User',
    props: {
      userAvatar: {
        type: String,
        default: ''
      },
      messageUnreadCount: {
        type: Number,
        default: 0
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      ...mapActions([
        'handleLogOut'
      ]),
      logout() {
        this.handleLogOut().then(() => {
          localClear()
          this.$router.push({
            name: 'login'
          })
          this.$router.go(0)
        })
      },
      message() {
        this.$router.push({
          name: 'message_page'
        })
      },
      handleClick(name) {
        switch (name) {
          case 'logout':
            this.logout()
            break
          case 'message':
            this.message()
            break
        }
      }
    }
  }
</script>
