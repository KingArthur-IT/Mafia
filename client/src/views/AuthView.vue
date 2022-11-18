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
                  <small v-if="!loginData.isEmailValid" class="auth__error sm-font">Не валидный email</small>
              </div>
              <div class="auth__input-wrapper">
                  <label class="auth__label">Пароль</label>
                  <div>
                      <input :type="isLoginPasswordVisible ? 'text' : 'password'" class="auth__input" v-model="loginData.password">
                      <OpenedEyeIcon v-if="!isLoginPasswordVisible" class="eye" @click="isLoginPasswordVisible = !isLoginPasswordVisible"/>
                      <ClosedEyeIcon v-else class="eye" @click="isLoginPasswordVisible = !isLoginPasswordVisible"/>
                  </div>
                    <small v-if="!loginData.isPasswordValid" class="auth__error sm-font">
                        Пароль должен содержать:
                        <ul class="error-list">
                            <li class="error-item">латинские буквы;</li>
                            <li class="error-item">хотя бы одну цифру;</li>
                            <li class="error-item">хотя бы одну букву в верхнем и нижнем регистре;</li>
                            <li class="error-item">не менее 8 символов;</li>
                            <li class="error-item">не содержать пробелов.</li>
                        </ul>
                    </small>
              </div>
              <button :class="{'disable': !isLoginAvailable}" class="btn primary-btn auth__btn" @click.prevent="loginEvent">Войти</button>
          </form>
          <!-- register form  -->
          <form class="auth__login" v-else>
              <div class="auth__input-wrapper">
                  <label class="auth__label">Никнейм</label>
                  <input type="text" class="auth__input" v-model="regData.nickname">
                  <small v-if="!regData.isNicknameValid" class="auth__error sm-font">Никнейм должен быть не короче 6 символов</small>
              </div>
              <div class="auth__input-wrapper">
                  <label class="auth__label">Email</label>
                  <input type="email" class="auth__input" v-model="regData.email">
                  <small v-if="!regData.isEmailValid" class="auth__error sm-font">Не валидный email</small>
              </div>
              <div class="auth__input-wrapper">
                  <div>
                        <label class="auth__label">Пароль</label>
                        <input :type="isRegPasswordVisible ? 'text' : 'password'" class="auth__input" v-model="regData.password">
                        <OpenedEyeIcon v-if="!isRegPasswordVisible" class="eye" @click="isRegPasswordVisible = !isRegPasswordVisible"/>
                        <ClosedEyeIcon v-else class="eye" @click="isRegPasswordVisible = !isRegPasswordVisible"/>
                  </div>
                  <small v-if="!regData.isPasswordValid" class="auth__error sm-font">
                        Пароль должен содержать:
                        <ul class="error-list">
                            <li class="error-item">только латинские символы;</li>
                            <li class="error-item">хотя бы одну цифру;</li>
                            <li class="error-item">хотя бы одну букву в верхнем и нижнем регистре;</li>
                            <li class="error-item">не менее 8 символов и не более 32;</li>
                            <li class="error-item">не содержать пробелов.</li>
                        </ul>
                    </small>
              </div>
              <div class="auth__input-wrapper">
                  <label class="auth__label">Повторите пароль</label>
                  <div>
                        <input :type="isRegConfirmPasswordVisible ? 'text' : 'password'" class="auth__input" v-model="regData.confirmPassword">
                        <OpenedEyeIcon v-if="!isRegConfirmPasswordVisible" class="eye" @click="isRegConfirmPasswordVisible = !isRegConfirmPasswordVisible"/>
                        <ClosedEyeIcon v-else class="eye" @click="isRegConfirmPasswordVisible = !isRegConfirmPasswordVisible"/>
                  </div>
                  <small v-if="!regData.isConfirmPasswordValid" class="auth__error sm-font">Пароли не совпадают</small>
              </div>
              <button :class="{'disable': !isRegAvailable}" class="btn primary-btn auth__btn" @click.prevent="regEvent">Зарегистрироваться</button>
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
                password: '',
                isEmailValid: true,
                isPasswordValid: true
            },
            regData: {
                nickname: '',
                email: '',
                password: '',
                confirmPassword: '',
                isNicknameValid: true,
                isEmailValid: true,
                isPasswordValid: true,
                isConfirmPasswordValid: true,
            }
        }
    },
    methods:{
        goToMainPage(){
            this.$router.push({name: 'home'})
        },
        regEvent(){
            if (!this.isRegAvailable) return;
            this.regData.isNicknameValid = this.regData.nickname.length > 5;
            this.regData.isEmailValid = this.validateEmail(this.regData.email);
            this.regData.isConfirmPasswordValid = this.regData.password === this.regData.confirmPassword && this.regData.password.length
            this.regData.isPasswordValid = this.validatePassword(this.regData.password);
        },
        loginEvent(){
            if (!this.isLoginAvailable) return;
            this.loginData.isEmailValid = this.validateEmail(this.loginData.email);
            this.loginData.isPasswordValid = this.validatePassword(this.loginData.password);
        },
        validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validatePassword(password){
            const withoutSpaces = /\s/;
            const uppers = /[A-Z]/; // Есть хотя бы одна буква в верхнем регистре
            const lowers = /[a-z]/; // Есть хотя бы одна буква в нижнем регистре
            const numbers = /\d/; // Есть хотя бы одна цифра
            const special = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/; 
            const minMaxLength = /^[\s\S]{8,32}$/;

            return  !withoutSpaces.test(password) && 
                    uppers.test(password) && 
                    lowers.test(password) && 
                    numbers.test(password) && 
                    // special.test(password) && 
                    minMaxLength.test(password);
        },
    },
    computed:{
        isLoginAvailable: function(){
            return this.loginData.email && this.loginData.password
        },
        isRegAvailable: function(){
            return this.regData.nickname && this.regData.email && this.regData.password && this.regData.confirmPassword
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
        min-height: 100vh
        padding: 100px 0
        background: var(--color-background)
        display: flex
        align-items: center
        justify-content: center
        &__hero
            min-width: 520px
            padding: 100px 30px
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
        &__error
            color: var(--color-primary)
            margin-top: 5px
    .error-list
        list-style: square
        padding-left: 15px
</style>