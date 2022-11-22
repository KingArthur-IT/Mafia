<template>
  <div class="hero">
    <div class="hero__input-wrapper">
      <CustomInput 
          :label="'Никнейм'"  
          v-model="nickname.value"
          :isWithEdit="true"
        >Никнейм должен быть не короче 6 символов</CustomInput>
    </div>

    <div class="hero__row">
      <p class="hero__text">Пол</p>
      <CustomRadio
        v-model="gender.value"
      />
    </div>

    <div class="hero__input-wrapper">
      <CustomInput 
        :label="'Email'" 
        v-model="email.value" 
        :isWithEdit="true"
      >Не валидный email</CustomInput>
    </div>

    <div class="hero__row hero__notifications">
      <p class="hero__text">Оповещение о новинках</p>
      <CustomSwitch
        v-model="email.isNotification"
      />
    </div>

    <div class="hero__input-wrapper">
      <CustomInput 
        :label="'Пароль'"  
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
        :label="'Повторите пароль'"  
      >Пароли не совпадают</CustomInput>
    </div>
  </div>
</template>

<script>
import CustomInput from '@/components/UIKit/CustomInput.vue'
import CustomRadio from '@/components/UIKit/CustomRadio.vue'
import CustomSwitch from '@/components/UIKit/CustomSwitch.vue'

export default {
  components:{
    CustomInput,
    CustomRadio,
    CustomSwitch,
  },
  data(){
    return{
      nickname:{
        value: 'KingArthur-99',
      },
      email:{
        value: 'ostapenko@gmail.com',
        isNotification: true
      },
      gender:{
        value: '1',
      },
    }
  }
}
</script>

<style scoped lang="sass">
  .hero
    background: var(--color-background-soft)
    height: 100%
    width: 100%
    border-radius: 30px
    padding: 30px
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