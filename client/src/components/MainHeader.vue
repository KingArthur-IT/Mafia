<template>
  <header class="container header">
    <div class="header__logo" @click="goToMainPage">
      <Logo />
    </div>
    <button class="btn header__btn" @click="goToAuthPage">Войти</button>
  </header>
</template>

<script>
import Logo from '@/components/icons/ProjectLogo.vue'

export default {
  components: {
    Logo
  },
  methods:{
    goToMainPage() {
      this.$router.push({ name: 'home' })
    },
    goToAuthPage() {
      this.$router.push({ name: 'auth' })
    }
  }
}
</script>

<style scoped lang="sass">
.header
  position: relative
  padding-top: 20px
  padding-bottom: 15px
  display: flex
  justify-content: space-between
  align-items: center
  &::before
    position: absolute
    content: ''
    background: linear-gradient(103.66deg, #176DAE 6.84%, #82E1E2 94.52%)
    filter: blur(232px)
    border-radius: 20px
    transform: rotate(-20deg)
    width: 350px
    height: 350px
    top: -100px
    right: -100px
    pointer-events: none
  &__logo
    cursor: pointer
    & svg
      width: 240px
  &__btn
    border-radius: 5px
    font-weight: 600
    font-size: 16px
    padding: 10px 20px
    background: transparent
    border: 1px solid var(--color-text)
    transition: background .3s ease, color .3s ease
    &:hover
      background: #fff
      color: #100923

@media screen and (max-width: 768px)
  .header
    padding-top: 15px
    &__logo
      & svg
        width: 180px
    &__btn
      font-size: 14px

@media screen and (max-width: 475px)
  .header
    &__btn
      padding: 6px 15px
    &__logo
      & svg
        width: 140px

@media screen and (max-width: 425px)
  .header
    &__btn
      padding: 6px 15px
      font-size: 12px
</style>