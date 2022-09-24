<template>
    <div class="section head-section">
      <div class="head-section__hero">
        <h1 class="head-section__title">
          Играй в мафию прямо со своего ПК или телефона
        </h1>
        <p class="head-section__description">
          Регистрация аккаунта в пару кликов
        </p>
        <button class="btn primary-btn head-section__btn">Начать игру</button>
      </div>
      <img src="@/assets/main.jpg" alt="mafia" class="head-section__img">
    </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="sass">
.head-section
  min-height: calc(100vh - 111px)
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 70px
  &__hero
    margin-right: 30px
  &__title
    color: var(--color-text)
    margin-bottom: 12px
    font-size: 48px
    font-weight: 600
  &__description
    margin-bottom: 16px
    font-size: 24px
  &__img
    max-width: 40%
    max-height: calc(100vh - 200px)
    border-radius: 15px
  &__btn
    padding: 15px 30px
    font-size: 18px
</style>