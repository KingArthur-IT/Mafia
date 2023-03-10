<template>
  <div class="section head-section">
    <div class="head-section__hero">
      <h1 class="head-section__title">
        Готовы к настоящему вызову? <br> Присоединяйтесь к игрокам мафии!
      </h1>
      <p class="head-section__description">
        Откройте для себя мир интриг с нашей онлайн-игрой в мафию. Создайте настоящее противостояние другим игрокам, используя все свои навыки и тактику.
        <br>
        Регистрация аккаунта в пару кликов!
      </p>
      <button class="btn primary-btn head-section__btn" @click="$router.push({ name: 'auth' })">Начать игру</button>
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
  min-height: calc(100vh - 110px)
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 70px
  position: relative
  &__hero
    margin-right: 60px
  &__title
    color: var(--color-text)
    margin-bottom: 15px
    font-size: 48px
    font-weight: 600
    line-height: 1.25
  &__description
    margin-bottom: 20px
    font-size: 24px
  &__img
    max-width: 40%
    max-height: calc(100vh - 200px)
    border-radius: 15px
  &__btn
    padding: 15px 30px
    font-size: 18px

@media screen and (max-width: 1240px)
  .head-section
    &__title
      color: var(--color-text)
      margin-bottom: 10px
      font-size: 36px
    &__description
      margin-bottom: 15px
      font-size: 18px
    &__btn
      padding: 12px 26px
      font-size: 18px

@media screen and (max-width: 768px)
  .head-section
    margin-bottom: 10px
    &__hero
      margin-right: 0
    &__img
      display: none

@media screen and (max-width: 475px)
  .head-section
    &__title
      font-size: 30px
    &__description
      font-size: 16px
    &__btn
      padding: 10px 24px

@media screen and (max-width: 375px)
  .head-section
    &__title
      font-size: 28px
    &__description
      font-size: 14px
    &__btn
      padding: 8px 22px
      font-size: 16px
</style>