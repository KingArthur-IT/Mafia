<template>
  <section class="section section-screen call-to-action">
    <h2 class="call-to-action__title">
        Заходи и играй в одну из самых популярных командных игр
    </h2>
    <p class="call-to-action__text">
        Регистрация аккаунта в два клика
    </p>
    <button class="btn primary-btn call-to-action__btn">Начать игру</button>
  </section>
</template>

<script>
export default {

}
</script>

<style lang="sass">
.call-to-action
    &__title
        text-align: center
        margin-bottom: 10px
        font-size: 48px
        line-height: 1.25
    &__text
        text-align: center
        margin-bottom: 25px
        font-size: 24px
    &__btn
        margin: auto
        padding: 15px 30px
        font-size: 18px

@media screen and (max-width: 1240px)
  .call-to-action
    &__title
      font-size: 36px
    &__text
      margin-bottom: 15px
      font-size: 18px
    &__btn
      padding: 12px 26px
      font-size: 18px

@media screen and (max-width: 475px)
  .call-to-action
    &__title
      font-size: 30px
    &__text
      font-size: 16px
    &__btn
      padding: 10px 24px

@media screen and (max-width: 375px)
  .call-to-action
    &__title
      font-size: 28px
    &__text
      font-size: 14px
    &__btn
      padding: 8px 22px
      font-size: 16px
</style>