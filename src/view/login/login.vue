<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <img :src="logo" alt="">

      <Card class="login-con-card" icon="log-in" :bordered="false">
        <div class="form-con">
          <p v-show="!userValid" class="login-txt">用户认证失败，请<a href="javascript:window.opener=null;window.open('','_self');window.close();">关闭</a>重新打开！</p>
          <p v-show="userValid" class="login-txt">加载中，请稍后！</p>
          <p class="login-tip">江苏恒创软件 技术支持</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import loginImg from '@/assets/images/login-logo.png'
  import LoginForm from '_c/login-form'
  import {mapActions} from 'vuex'
  import {insertRouter} from '@/libs/router-util'
  import {getUrlParam, uncompileStr} from '@/libs/util'

  export default {
    data() {
      return {
        logo: loginImg,
        userValid: true
      }
    },
    components: {
      LoginForm
    },
    mounted() {
      this.loginNoPass()
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo',
        'loginNoPassword'
      ]),
      /* handleSubmit({userName, password}) {
         this.handleLogin({userName}).then(res => {
           insertRouter()
           this.getUserInfo().then(res => {
             this.$router.push({
               name: this.$config.homeName
             })
             this.$router.go(0)
           })
         })
       },*/
      loginNoPass() {
        if (getUrlParam("privacy")) {
          const userCode = uncompileStr(getUrlParam("privacy"))
          this.loginNoPassword(userCode).then(() => {
            this.userValid = true
            this.$router.push({
              name: this.$config.homeName
            })
            this.$router.go(0)
          }).catch(() => {
            this.userValid = false
            this.$Message.error('获取用户信息失败');
          });
        } else {
          this.userValid = false
        }
      }
    }

  }
</script>

<style>

</style>
