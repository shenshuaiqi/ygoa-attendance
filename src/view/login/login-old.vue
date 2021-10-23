<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <img :src="logo" alt="">

      <Card class="login-con-card" icon="log-in" title="用户登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">江苏恒创软件技术支持</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import loginImg from '@/assets/images/login-logo.png'
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { insertRouter } from '@/libs/router-util'

export default {
  data () {
    return {
      logo: loginImg
    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        insertRouter()
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
          this.$router.go(0)
        })
      })
    }
  }
}
</script>

<style>

</style>
