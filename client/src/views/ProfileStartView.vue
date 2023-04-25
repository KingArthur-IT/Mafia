<template>
  <div class="hero">
      <div class="hero__row">
          <p class="hero__text" @click="$router.push({ name: 'profile.market' })" >
              <span>Тип профиля:</span>
              <span class="type">{{ profileType }}</span> 
              <CrownIcon v-if="isCrownShown" />
              <UpIcon v-else />
          </p>
          <div @click="$router.push({ name: 'profile.statistics' })">
              <p class="hero__text">Рейтинг: {{ userData.rating }} (Горожанин) <StarIcon /> </p>
          </div>
      </div>
      <!-- <Achivements /> -->
      <!-- <div>
          <h3>Инфлюэнсеры проекта</h3>
      </div> -->
      <button class="btn secondary-btn hero__btn" @click="goToPage('profile.holl')">Играть</button>
      <button class="btn secondary-btn hero__btn" @click="goToPage('profile.rules')">Правила</button>
      <button class="btn secondary-btn hero__btn" @click="goToPage('profile.statistics')">Рейтинг и статистика</button>
  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'
import Achivements from '@/components/Profile/Achivements.vue'
import StarIcon from '@/components/icons/StarIcon.vue'
import CrownIcon from '@/components/icons/CrownIcon.vue'
import UpIcon from '@/components/icons/UpIcon.vue'

export default {
    components:{
        Achivements,
        StarIcon,
        CrownIcon,
        UpIcon
    },
    data(){
        return{
            
        }
    },
    methods:{
        goToPage(name){
            this.$router.push({ name: name })
        }
    },
    computed:{
        ...mapGetters('user', ['userData']),
        profileType: function(){
            return this.userData?.account_type === 'standart' ? 'Базовый' : 'premium';
        },
        isCrownShown: function(){
            return this.userData?.account_type === 'premium'
        }
    }
}
</script>

<style scoped lang="sass">
    .hero
        &__row
            display: flex
            justify-content: space-between
            align-items: flex-start
        &__text
            color: #fff
            margin-bottom: 12px
            font-weight: 700
            display: flex
            align-items: center
            cursor: pointer
            & svg
                width: 30px
                height: 30px
                margin-left: 6px
            & .type
                margin-left: 5px
                text-decoration: underline
                transition: color .2s ease-in-out
            & .up-icon
                fill: #fff
                transition: fill .3s ease
            &:hover
                & .type
                    color: var(--color-primary)
                & .up-icon
                    fill: var(--color-primary)
        &__btn
            padding: 12px 30px
            min-width: 250px
            margin-bottom: 12px
</style>