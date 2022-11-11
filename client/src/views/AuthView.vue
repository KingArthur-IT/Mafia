<template>
  <div class="auth">
      <div class="auth__hero">
          <div class="auth__tabs">
              <button class="btn auth__tab-btn" :class="{'active': isLoginTab}" @click="isLoginTab = true">Войти</button>
              <button class="btn auth__tab-btn" :class="{'active': !isLoginTab}" @click="isLoginTab = false">Зарегистрироваться</button>
          </div>
          <!-- login form -->
          <form class="auth__login" v-if="isLoginTab">
              <div class="auth__input-wrapper">
                  <label class="auth__label">Email</label>
                  <input type="email" class="auth__input" v-model="loginData.email">
              </div>
              <div class="auth__input-wrapper">
                  <label class="auth__label">Пароль</label>
                  <input :type="isLoginPasswordVisible ? 'text' : 'password'" class="auth__input" v-model="loginData.password">
                  <OpenedEyeIcon v-if="!isLoginPasswordVisible" class="eye" @click="isLoginPasswordVisible = !isLoginPasswordVisible"/>
                  <ClosedEyeIcon v-else class="eye" @click="isLoginPasswordVisible = !isLoginPasswordVisible"/>
              </div>
              <button class="btn primary-btn auth__btn" @click.prevent="loginEvent">Войти</button>
          </form>
          <!-- register form  -->
          <form class="auth__login" v-else>
              <div class="auth__input-wrapper">
                  <label class="auth__label">Никнейм</label>
                  <input type="text" class="auth__input" v-model="regData.nickname">
              </div>
              <div class="auth__input-wrapper">
                  <label class="auth__label">Email</label>
                  <input type="email" class="auth__input" v-model="regData.email">
              </div>
              <div class="auth__input-wrapper">
                  <label class="auth__label">Пароль</label>
                  <input :type="isRegPasswordVisible ? 'text' : 'password'" class="auth__input" v-model="regData.password">
                  <OpenedEyeIcon v-if="!isRegPasswordVisible" class="eye" @click="isRegPasswordVisible = !isRegPasswordVisible"/>
                  <ClosedEyeIcon v-else class="eye" @click="isRegPasswordVisible = !isRegPasswordVisible"/>
              </div>
              <div class="auth__input-wrapper">
                  <label class="auth__label">Повторите пароль</label>
                  <input :type="isRegConfirmPasswordVisible ? 'text' : 'password'" class="auth__input" v-model="regData.confirmPassword">
                  <OpenedEyeIcon v-if="!isRegConfirmPasswordVisible" class="eye" @click="isRegConfirmPasswordVisible = !isRegConfirmPasswordVisible"/>
                  <ClosedEyeIcon v-else class="eye" @click="isRegConfirmPasswordVisible = !isRegConfirmPasswordVisible"/>
              </div>
              <button class="btn primary-btn auth__btn" @click.prevent="regEvent">Зарегистрироваться</button>
          </form>
      </div>
  </div>
</template>

<script>
import OpenedEyeIcon from '@/components/icons/OpenedEyeIcon.vue'
import ClosedEyeIcon from '@/components/icons/ClosedEyeIcon.vue'

export default {
    components:{
        OpenedEyeIcon, ClosedEyeIcon
    },
    data: () => {
        return{
            isLoginPasswordVisible: false,
            isRegPasswordVisible: false,
            isRegConfirmPasswordVisible: false,
            isLoginTab: true,
            loginData: {
                email: '',
                password: ''
            },
            regData: {
                nickname: '',
                email: '',
                password: '',
                confirmPassword: ''
            }
        }
    },
    methods:{
        goToMainPage(){
            this.$router.push({name: 'home'})
        },
        regEvent(){

        },
        loginEvent(){
            
        }
    }
}
</script>

<style scoped lang="sass">
    .eye
        position: absolute
        height: 30px
        width: 30px
        right: 15px
        bottom: 4px
        cursor: pointer
    .auth
        width: 100%
        padding: 100px 0
        background: var(--color-background)
        display: flex
        align-items: center
        justify-content: center
        &__hero
            min-width: 520px
            padding: 0 30px
        &__tabs
            display: flex
            justify-content: space-between
            align-items: stretch
        &__tab-btn
            width: 100%
            padding: 10px 15px
            background: var(--color-background)
            color: #fff
            font-size: 18px
            border-bottom: 1px solid var(--color-background)
            &.active
                border-bottom: 1px solid #fff
        &__login
            width: 100%
            padding: 24px 0
        &__input-wrapper
            position: relative
            width: 100%
            margin-bottom: 12px
        &__label
            display: block
            color: #fff
            margin-bottom: 5px
        &__input
            width: 100%
            background: var(--color-background-soft)
            border: 1px solid #ffffff88
            padding: 10px 15px
            outline: none
            caret-color: var(--color-primary)
            color: #fff
            &:focus
                border: 1px solid #fff
        &__btn
            padding: 15px 40px
            margin: auto
            margin-top: 24px
</style>