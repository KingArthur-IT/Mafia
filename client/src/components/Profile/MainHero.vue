<template>
  <div class="hero">
      <Achivements />
      <button class="btn hero__btn">Играть</button>
      <button class="btn hero__btn">Правила</button>
      <button class="btn hero__btn">Статистика</button>
  </div>
  
</template>

<script>
import Achivements from '@/components/Profile/Achivements.vue'
export default {
    components:{
        Achivements
    }
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
</style>