<template>
  <div class="hero">
      Рейтинг
      Уровень авторитета
      <Achivements />
      <button class="btn secondary-btn hero__btn" @click="goToPage('profile.holl')">Играть</button>
      <button class="btn secondary-btn hero__btn" @click="goToPage('profile.rules')">Правила</button>
      <button class="btn secondary-btn hero__btn" @click="goToPage('profile.statistics')">Статистика</button>
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
            padding: 12px 30px
            min-width: 250px
            margin-bottom: 12px
</style>