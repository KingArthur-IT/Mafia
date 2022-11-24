<template>
  <div class="hero">
      <p class="hero__text">Достижения</p>
      <div class="hero__achivments">
          <img src="../../assets/achievements/sheriff.png" alt="achivements" class="hero__achivments-item">
          <img src="../../assets/achievements/sheriff.png" alt="achivements" class="hero__achivments-item">
          <img src="../../assets/achievements/sheriff.png" alt="achivements" class="hero__achivments-item">
      </div>
      <button class="btn hero__btn">Играть</button>
      <button class="btn hero__btn">Правила</button>
      <button class="btn hero__btn">Статистика</button>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="sass">
    .hero
        &__text
            color: #fff
            margin-bottom: 12px
            font-weight: 700
        &__btn
            display: block
            background: transparent
            border: 1px solid var(--color-primary)
            font-weight: 600
            border-radius: 5px
            padding: 12px 30px
            transition: color .2s ease, background-color .2s ease
            min-width: 250px
            margin-bottom: 12px
            &:hover
                background-color: var(--color-primary)
            &::active  
                background-color: transparent
        &__achivments
            display: flex
            align-items: center
            margin-bottom: 24px
        &__achivments-item
            width: 100px
            height: 100px
            margin-right: 12px
</style>