<template>
  <footer class="container footer">
      <div class="footer__logo" @click="goToMainPage">MafiaWorld</div>
      <p class="footer__copyright">(c) copyright 2023</p>
      <a href="mailto:" class="footer__mail">mafiaworld@support.com</a>
  </footer>
</template>

<script>
export default {
  methods:{
    goToMainPage(){
      this.$router.push({name: 'home'})
    }
  }
}
</script>

<style scoped lang="sass">
.footer
    display: flex
    justify-content: space-between
    align-items: center
    padding-bottom: 15px
    &__logo
        color: var(--color-text)
        font-family: 'Kaushan Script', cursive
        font-size: 38px
        cursor: pointer
    &__copyright
      font-size: 14px
    &__mail
      font-size: 14px
</style>