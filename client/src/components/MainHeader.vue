<template>
  <header class="container header">
    <div class="header__logo" @click="goToMainPage">MafiaWorld</div>
    <button class="btn header__btn" @click="goToAuthPage">Войти</button>
  </header>
</template>

<script>
export default {
  methods:{
    goToMainPage(){
      this.$router.push({name: 'home'})
    },
    goToAuthPage(){
      this.$router.push({name: 'auth'})
    }
  }
}
</script>

<style scoped>
.header{
  padding-top: 15px;
  padding-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header__logo{
  color: var(--color-text);
  font-family: 'Kaushan Script', cursive;
  font-size: 60px;
  cursor: pointer;
}
.header__btn{
  padding: 10px 15px;
  background: transparent;
  border: 1px solid var(--color-text);
}
</style>