<template>
  <div class="auth">
      <div class="auth__logo" @click="$router.push({name: 'home'})">MafiaWorld</div>
      <div class="auth__hero">
          <div class="auth__tabs">
              <button class="btn auth__tab-btn" :class="{'active': isLoginTab}" @click="isLoginTab = true">Войти</button>
              <button class="btn auth__tab-btn" :class="{'active': !isLoginTab}" @click="isLoginTab = false">Зарегистрироваться</button>
          </div>
          <!-- login form -->
          <form class="auth__login" v-if="isLoginTab">
              <div class="auth__input-wrapper">
                  <CustomInput 
                    :label="'Email'"  
                    :type="'email'"
                    :isValid="loginData.isEmailValid"
                    v-model="loginData.email"
                  >Не валидный email</CustomInput>
              </div>
              <div class="auth__input-wrapper">
                  <CustomInput 
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
              <button :class="{'disable': !isLoginAvailable}" class="btn sm-font primary-btn auth__btn" @click.prevent="loginEvent">Войти</button>
          </form>
          <!-- register form  -->
          <form class="auth__login" v-else>
              <div class="auth__input-wrapper">
                  <CustomInput 
                    :label="'Никнейм'"  
                    :isValid="regData.isNicknameValid"
                    v-model="regData.nickname"
                  >Никнейм должен быть не короче 6 символов</CustomInput>
              </div>
              <div class="auth__input-wrapper">
                  <CustomInput 
                    :label="'Email'"  
                    :type="'email'"
                    :isValid="regData.isEmailValid"
                    v-model="regData.email"
                  >Не валидный email</CustomInput>
              </div>
              <div class="auth__input-wrapper">
                  <CustomInput 
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
                    :label="'Повторите пароль'"  
                    :type="'password'"
                    :isValid="regData.isConfirmPasswordValid"
                    v-model="regData.confirmPassword"
                >Пароли не совпадают</CustomInput>
              </div>
              <button :class="{'disable': !isRegAvailable}" class="btn sm-font primary-btn auth__btn" @click.prevent="regEvent">Зарегистрироваться</button>
          </form>
      </div>
  </div>
</template>

<script>
import CustomInput from '@/components/UIKit/CustomInput.vue'

export default {
    components:{
        CustomInput
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
            this.regData.isConfirmPasswordValid = this.regData.password === this.regData.confirmPassword && !!this.regData.password.length
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
    .auth
        width: 100%
        min-height: 100vh
        padding: 100px 0
        background: var(--color-background)
        display: flex
        align-items: center
        justify-content: center
        &__logo
            color: var(--color-text)
            font-family: 'Kaushan Script', cursive
            font-size: 60px
            cursor: pointer
            position: absolute
            top: 20px
            left: 30px
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
            font-size: var(--text-size)
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
        &__btn
            padding: 15px 40px
            margin: auto
            margin-top: 24px
    .error-list
        list-style: square
        padding-left: 15px

@media screen and (max-width: 768px)
    .auth
        &__logo
            font-size: 48px

@media screen and (max-width: 520px)
    .auth
        &__hero
            min-width: 0
            width: 100%
        &__logo
            left: 20px

@media screen and (max-width: 425px)
    .auth
        &__hero
            padding: 0px 20px
        &__logo
            font-size: 32px
            left: 15px
</style>