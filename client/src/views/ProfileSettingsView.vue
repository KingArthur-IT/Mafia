<template>
  <div class="hero">
    <div class="hero__input-wrapper">
      <CustomInput 
          :label="'Никнейм'"  
          v-model="nickname.value"
          :isWithEdit="true"
          @saveEvent="updateUserData"
        >Никнейм должен быть не короче 6 символов</CustomInput>
    </div>

    <div class="hero__row">
      <p class="hero__text">Пол</p>
      <CustomRadio
        v-model="gender.value"
        :isWithEdit="true"
      />
    </div>

    <div class="hero__line"></div>

    <div class="hero__input-wrapper">
      <CustomInput 
        :label="'Email'" 
        v-model="email.value" 
        :isWithEdit="true"
        @saveEvent="updateUserData"
      >Не валидный email</CustomInput>
    </div>

    <div class="hero__row hero__notifications">
      <p class="hero__text">Оповещение о новинках в игре</p>
      <CustomSwitch
        v-model="email.isNotification"
        :colorScheme="'save'"
      />
    </div>

    <div class="hero__line"></div>

    <div class="hero__row hero__notifications">
      <p class="hero__text">Изменить пароль</p>
      <CustomSwitch
        v-model="password.isChanging"
        :colorScheme="'edit'"
      />
    </div>

    <div v-if="password.isChanging">
      <div class="hero__input-wrapper">
        <CustomInput 
          :label="'Старый пароль'" 
          :type="'password'"
          :isValid="password.isOldValid"
          v-model="password.old" 
        >Не верный пароль</CustomInput>
      </div>
      <div class="hero__input-wrapper">
        <CustomInput 
          :label="'Новый пароль'"  
          :type="'password'"
          :isValid="password.isNewValid"
          v-model="password.new"
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
      <div class="hero__input-wrapper">
        <CustomInput 
          :label="'Повторите новый пароль'" 
          :type="'password'"
          :isValid="password.isRepeatValid"
          v-model="password.repeatNew" 
        >Пароли не совпадают</CustomInput>
      </div>
      <div class="hero__input-wrapper">
        <SaveButton @click="savePasswordEvent" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex' 
import { validatePassword, validateEmail } from '@/use/validation.js'
import CustomInput from '@/components/UIKit/CustomInput.vue'
import CustomRadio from '@/components/UIKit/CustomRadio.vue'
import CustomSwitch from '@/components/UIKit/CustomSwitch.vue'
import SaveButton from '@/components/UIKit/SaveButton.vue'

export default {
  components:{
    CustomInput,
    CustomRadio,
    CustomSwitch,
    SaveButton
  },
  mounted(){
    if (this.userData){
      this.nickname.value = this.userData.nickname;
      this.email.value = this.userData.email;
      this.email.isNotification = this.userData.emailNotification;
      this.gender = this.userData.gender;
    }
  },
  data(){
    return{
      nickname:{
        value: '',
      },
      email:{
        value: '',
        isNotification: false
      },
      gender:{
        value: 'male',
      },
      password:{
        isChanging: false,
        old: '',
        new: '',
        repeatNew: '',
        isOldValid: true,
        isNewValid: true,
        isRepeatValid: true
      }
    }
  },
  methods:{
    ...mapActions('user', ['updateUserInfo']),
    ...mapActions('toast', ['showToast']),
    savePasswordEvent(){
      this.password.isOldValid = this.password.old !== '';
      this.password.isNewValid = validatePassword(this.password.new);
      this.password.isRepeatValid = this.password.new === this.password.repeatNew && this.password.new !== '';

      // const data = await sendRequest('/auth/password', 'PUT', newPassword);
    },
    updateUserData(){
      if (this.nickname.value.length < 6){
        this.showToast({text: 'Никнейм должен быть не короче 6 символов', type: 'error'});
        return
      }
      if (!validateEmail(this.email.value)){
        this.showToast({text: 'Не валидный email', type: 'error'});
        return
      }

      if (this.smthWasChanged)
        this.updateUserInfo({
          nickname: this.nickname.value,
          gender: this.gender.value,
          email: this.email.value,
          emailNotification: this.email.isNotification
        })
    }
  },
  computed:{
    ...mapGetters('user', ['userData']),
    smthWasChanged(){
      return this.userData.nickname !== this.nickname.value ||
            this.userData.email !== this.email.value ||
            this.userData.emailNotification !== this.email.isNotification ||
            this.userData.gender !== this.gender.value
    }
  }
}
</script>

<style scoped lang="sass">
  .hero
    &__line
      width: 100%
      height: 1px
      margin: 24px 0
      background-color: #4a4d55
      max-width: 300px
    &__input-wrapper
      max-width: 300px
      margin-bottom: 12px
    &__row
      margin-bottom: 12px
    &__text
      color: #fff
    &__notifications
      display: flex
      align-items: center
      & p
        margin-right: 12px
</style>