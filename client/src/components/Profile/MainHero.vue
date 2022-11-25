<template>
  <div class="hero">
      Рейтинг
      Уровень авторитета
      <Achivements />
      <button class="btn hero__btn" @click="goToPage('profile.holl')">Играть</button>
      <button class="btn hero__btn" @click="goToPage('profile.rules')">Правила</button>
      <button class="btn hero__btn" @click="goToPage('profile.statistics')">Статистика</button>
  </div>
  
</template>

<script>
import Achivements from '@/components/Profile/Achivements.vue'
export default {
    components:{
        Achivements
    },
    methods:{
        goToPage(name){
            this.$router.push({name: name})
        }
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