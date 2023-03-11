<template>
  <div class="auth">
      <div class="auth__logo" @click="$router.push({ name: 'home' })">
        <Logo />
      </div>
      <div class="auth__hero">
          <div class="auth__tabs" :class="{'register': !isLoginTab}">
              <button class="btn auth__tab-btn" @click="isLoginTab = true">Войти</button>
              <button class="btn auth__tab-btn" @click="isLoginTab = false">Зарегистрироваться</button>
          </div>
          <!-- login form -->
          <div class="auth__forms-wrapper">
              <form class="auth__login login-form" :class="{'active': isLoginTab}">
                  <div class="auth__input-wrapper">
                      <CustomInput 
                        :id="'loginEmailInput'"
                        :label="'Email'"  
                        :type="'email'"
                        :isValid="loginData.isEmailValid"
                        v-model="loginData.email"
                      >Не валидный email</CustomInput>
                  </div>
                  <div class="auth__input-wrapper">
                      <CustomInput 
                      :id="'loginPasswordInput'"
                        :label="'Пароль'"  
                        :type="'password'"
                        :isValid="loginData.isPasswordValid"
                        v-model="loginData.password"
                      >
                        Пароль должен содержать:
                        <ul class="error-list">
                            <li class="error-item">латинские буквы;</li>
                            <li class="error-item">хотя бы одну цифру;</li>
                            <li class="error-item">хотя бы одну букву в верхнем и нижнем регистре;</li>
                            <li class="error-item">не менее 8 символов;</li>
                            <li class="error-item">не содержать пробелов.</li>
                        </ul>
                      </CustomInput>
                  </div>
                  <button :class="{'disable': !isLoginAvailable}" class="btn primary-btn auth__btn" @click.prevent="loginEvent">Войти</button>
              </form>
              <!-- register form  -->
              <form class="auth__login register-form" :class="{'active': !isLoginTab}">
                  <div class="auth__input-wrapper">
                      <CustomInput 
                        :id="'registerNickInput'"
                        :label="'Никнейм'"  
                        :isValid="regData.isNicknameValid"
                        v-model="regData.nickname"
                      >Никнейм должен быть не короче 6 символов</CustomInput>
                  </div>
                  <div class="auth__input-wrapper">
                      <CustomInput 
                        :id="'registerEmailInput'"
                        :label="'Email'"  
                        :type="'email'"
                        :isValid="regData.isEmailValid"
                        v-model="regData.email"
                      >Не валидный email</CustomInput>
                  </div>
                  <div class="auth__input-wrapper">
                      <CustomInput 
                        :id="'registerPasswordInput'"
                        :label="'Пароль'"  
                        :type="'password'"
                        :isValid="regData.isPasswordValid"
                        v-model="regData.password"
                      >
                            Пароль должен содержать:
                            <ul class="error-list">
                                <li class="error-item">только латинские символы;</li>
                                <li class="error-item">хотя бы одну цифру;</li>
                                <li class="error-item">хотя бы одну букву в верхнем и нижнем регистре;</li>
                                <li class="error-item">не менее 8 символов и не более 32;</li>
                                <li class="error-item">не содержать пробелов.</li>
                            </ul>
                      </CustomInput>
                  </div>
                  <div class="auth__input-wrapper">
                    <CustomInput 
                        :id="'registerRepeatPasswordInput'"
                        :label="'Повторите пароль'"  
                        :type="'password'"
                        :isValid="regData.isConfirmPasswordValid"
                        v-model="regData.confirmPassword"
                    >Пароли не совпадают</CustomInput>
                  </div>
                  <button :class="{'disable': !isRegAvailable}" class="btn primary-btn auth__btn" @click.prevent="regEvent">Зарегистрироваться</button>
              </form>
          </div>
      </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { validatePassword, validateEmail } from '@/use/validation.js'
import CustomInput from '@/components/UIKit/CustomInput.vue'
import Logo from '@/components/icons/ProjectLogo.vue'

export default {
    components:{
        CustomInput,
        Logo,
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
    mounted() {
        document.querySelector('#loginEmailInput')?.focus()
    },
    methods:{
        ...mapActions('user', ['getUserData']),
        goToMainPage(){
            this.$router.push({ name: 'home' })
        },
        regEvent(){
            if (!this.isRegAvailable) return;
            this.regData.isNicknameValid = this.regData.nickname.length > 5;
            this.regData.isEmailValid = validateEmail(this.regData.email);
            this.regData.isConfirmPasswordValid = this.regData.password === this.regData.confirmPassword && !!this.regData.password.length
            this.regData.isPasswordValid = validatePassword(this.regData.password);
        },
        async loginEvent(){
            if (!this.isLoginAvailable) return;
            this.loginData.isEmailValid = validateEmail(this.loginData.email);
            // this.loginData.isPasswordValid = validatePassword(this.loginData.password);

            if (!this.loginData.isEmailValid) return;

            const rez = await this.getUserData({
                email: this.loginData.email,
                password: this.loginData.password
            });

            if (rez) this.$router.push({name: 'profile.main'})
        },
    },
    computed:{
        isLoginAvailable: function(){
            return this.loginData.email && this.loginData.password
        },
        isRegAvailable: function(){
            return this.regData.nickname && this.regData.email && this.regData.password && this.regData.confirmPassword
        }
    },
    watch: {
        isLoginTab() {
            if (this.isLoginTab)
                document.querySelector('#loginEmailInput')?.focus()
            else
                document.querySelector('#registerNickInput')?.focus()
        }
    }
}
</script>

<style scoped lang="sass">
    .auth
        position: relative
        width: 100%
        min-height: 100vh
        padding: 0px 0
        background: var(--color-background)
        display: flex
        align-items: center
        justify-content: center
        z-index: 0
        &__logo
            cursor: pointer
            position: absolute
            top: 20px
            left: 30px
            & svg
                width: 240px
        &__hero
            min-width: 520px
            padding: 150px 30px 30px
        &__tabs
            display: flex
            justify-content: space-between
            align-items: stretch
            position: relative
            &::before
                position: absolute
                content: ''
                left: 0
                bottom: 0
                width: 50%
                height: 1px
                background: #fff
                transition: left .3s ease
            &.register::before
                left: 50%
        &__tab-btn
            width: 100%
            padding: 10px 15px
            background: transparent
            color: #fff
            font-size: var(--text-size)
        &__forms-wrapper
            position: relative
            display: flex
            width: 100%
        &__login
            width: 100%
            padding: 24px 0
        &__input-wrapper
            position: relative
            width: 100%
            margin-bottom: 12px
        &__btn
            padding: 15px 40px
            margin: auto
            margin-top: 24px
            font-size: 16px

.login-form
    position: absolute
    transform: translate(-50px)
    transition: transform .3s ease, opacity .15s ease
    transform-origin: left
    opacity: 0
    &.active
        opacity: 1
        transform: translate(0px)
.register-form
    transform: translate(50px)
    transition: transform .3s ease, opacity .15s ease
    transform-origin: right
    opacity: 0
    &.active
        opacity: 1
        transform: translate(0)

@media screen and (max-width: 768px)
    .auth
        &__hero
            padding: 50px 20px 20px
        &__logo
            & svg
                width: 180px
    .login-form
        position: absolute
        transform: translate(-20px)
    .register-form
        transform: translate(10px)

@media screen and (max-width: 520px)
    .auth
        &__hero
            min-width: 0
            width: 100%
        &__logo
            left: 20px

@media screen and (max-width: 475px)
    .auth
        &__btn
            padding: 13px 40px
            font-size: 14px
        &__logo
            & svg
                width: 140px

@media screen and (max-width: 425px)
    .auth
        &__hero
            padding: 0px 15px
        &__logo
            left: 15px

@media screen and (max-width: 350px)
    .auth
        &__hero
            padding: 0px 10px
</style>