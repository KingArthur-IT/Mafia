<template>
  <div class="market">
      <div class="market__wrap">
          <div class="market__item">
              <h2 class="market__title">Базовый аккаунт</h2>
              <ul class="market__list">
                  <li class="market__line">обычная скорость роста рейтинга</li>
                  <li class="market__line">только текст в чатах</li>
                  <li class="market__line">только открытые комнаты</li>
              </ul>
          </div>
      </div>
      <div class="market__wrap">
          <div class="market__item">
              <h2 class="market__title">Premium аккаунт <CrownIcon /></h2>
              <ul class="market__list">
                  <li class="market__line">+100% к игровому рейтингу</li>
                  <li class="market__line">крутые стикеры для чатов</li>
                  <li class="market__line">возможность создавать приватные комнаты для друзей</li>
              </ul>
          </div>
      </div>
  </div>
</template>

<script>
import CrownIcon from '@/components/icons/CrownIcon.vue'

export default {
    components:{
        CrownIcon
    }
}
</script>

<style scoped lang="sass">
    .market
        width: 100%
        display: flex
        align-items: stretch
        &__wrap
            flex-basis: 50%
            padding: 0 12px
        &__item
            border-radius: 5px
            border: 1px solid #fff
            padding: 12px
            height: 100%
        &__title
            text-align: center
            margin-bottom: 24px
            display: flex
            align-items: center
            justify-content: center
            & svg
                width: 40px
                margin-left: 12px
        &__line
            padding-left: 20px
            position: relative
            &::before
                content: ''
                position: absolute
                top: 9px
                left: 2px
                width: 8px
                height: 8px
                background: var(--color-primary)

</style>