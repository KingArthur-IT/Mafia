<template>
  <div class="hero">
    <div class="hero__input-wrapper">
      <CustomInput 
          :id="'nickname-input'"
          :label="'Никнейм'"  
          v-model="nickname.value"
          :isWithEdit="true"
          @saveEvent="updateUserData"
        >Никнейм должен быть не короче 5 символов</CustomInput>
    </div>

    <div class="hero__input-wrapper">
      <CustomInput 
          :id="'age-input'"
          :label="'Возраст'"  
          v-model="age.value"
          :isWithEdit="true"
          :isAgeValue="true"
          @saveEvent="updateUserData"
        >Не корректный возраст</CustomInput>
    </div>

    <div class="hero__input-wrapper">
      <CustomInput 
          :id="'country-input'"
          :label="'Страна'"  
          v-model="country.value"
          :isWithEdit="true"
          @saveEvent="updateUserData"
        >Не корректная страна</CustomInput>
    </div>

    <div class="hero__input-wrapper">
      <div class="hero__row">
        <p class="hero__text">Пол</p>
        <CustomRadio
          v-model="gender.value"
          :isWithEdit="true"
          @saveEvent="updateUserData"
        />
      </div>
    </div>

    <div class="hero__line"></div>

    <div class="hero__input-wrapper">
      <CustomInput 
        :id="'email-input'"
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
        @saveEvent="updateUserData"
        :colorScheme="'save'"
        :hasSaveAction="true"
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
          :id="'old-password-input'"
          :label="'Старый пароль'" 
          :type="'password'"
          :isValid="password.isOldValid"
          v-model="password.old" 
        >Не верный пароль</CustomInput>
      </div>
      <div class="hero__input-wrapper">
        <CustomInput 
          :id="'new-password-input'"
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
          :id="'repeat-new-password-input'"
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
      this.gender.value = this.userData.gender;
      this.country.value = this.userData.country;
      this.age.value = this.userData.age;
    }
  },
  data() {
    return {
      nickname: {
        value: '',
      },
      age: {
        value: '',
      },
      country: {
        value: '',
      },
      email: {
        value: '',
        isNotification: false
      },
      gender: {
        value: 'male',
      },
      password: {
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
  methods: {
    ...mapActions('user', ['updateUserInfo', 'updateUserPassword']),
    ...mapActions('toast', ['showToast']),
    savePasswordEvent(){
      this.password.isOldValid = this.password.old !== '';
      this.password.isNewValid = validatePassword(this.password.new);
      this.password.isRepeatValid = this.password.new === this.password.repeatNew && this.password.new !== '';

      if (this.password.isOldValid && this.password.isNewValid && this.password.isRepeatValid) {
        const rez = this.updateUserPassword({
          id: this.userData.id,
          oldPassword: this.password.old,
          newPassword: this.password.new
        })
        if (rez) {
          this.password.old = ''
          this.password.new = ''
          this.password.repeatNew = ''
        }
      }
    },
    updateUserData(){
      if (this.nickname.value.length < 5){
        this.showToast({ text: 'Никнейм должен быть не короче 5 символов', type: 'error' });
        return
      }
      if (!validateEmail(this.email.value)){
        this.showToast({ text: 'Не валидный email', type: 'error' });
        return
      }

      if (this.smthWasChanged)
        this.updateUserInfo({
          id: this.userData.id,
          nickname: this.nickname.value,
          age: this.age.value,
          country: this.country.value,
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
            this.userData.gender !== this.gender.value ||
            this.userData.age !== this.age.value ||
            this.userData.country !== this.country.value
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