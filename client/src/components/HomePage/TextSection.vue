<template>
  <section class="section section-screen text-section">
    <slot></slot>
    <p class="text-section__text">
        {{ text }}
    </p>
  </section>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="sass">
.text-section
    &__title
        text-align: center
        margin-bottom: 10px
        font-size: 48px
        line-height: 1.25
    &__text
        padding: 0 20px
        text-align: center
        margin-bottom: 25px
        font-size: 24px
        border-left: 3px solid var(--color-primary)
    &__btn
        margin: auto
        padding: 15px 30px
        font-size: 18px

@media screen and (max-width: 1240px)
  .text-section
    &__title
      font-size: 36px
    &__text
      margin-bottom: 15px
      font-size: 18px

@media screen and (max-width: 475px)
  .text-section
    &__title
      font-size: 30px
    &__text
      font-size: 16px

@media screen and (max-width: 375px)
  .text-section
    &__title
      font-size: 28px
    &__text
      font-size: 14px
</style>