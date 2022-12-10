<template>
  <div class="hero">
      <div class="hero__row">
          <p class="hero__text">
              Тип профиля: <span @click="$router.push({name: 'profile.market'})">{{profileType}}</span> <CrownIcon v-if="profileData.type === 'vip'" />
          </p>
          <p class="hero__text">Рейтинг: {{profileData.level}} <StarIcon /> </p>
      </div>
      <Achivements />
      <button class="btn secondary-btn hero__btn" @click="goToPage('profile.holl')">Играть</button>
      <button class="btn secondary-btn hero__btn" @click="goToPage('profile.rules')">Правила</button>
      <button class="btn secondary-btn hero__btn" @click="goToPage('profile.statistics')">Статистика</button>
  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'
import Achivements from '@/components/Profile/Achivements.vue'
import StarIcon from '@/components/icons/StarIcon.vue'
import CrownIcon from '@/components/icons/CrownIcon.vue'

export default {
    components:{
        Achivements,
        StarIcon,
        CrownIcon
    },
    data(){
        return{
            profileData:{
                type: 'standart',
                level: 100
            }
        }
    },
    methods:{
        goToPage(name){
            this.$router.push({name: name})
        }
    },
    computed:{
        ...mapGetters(['userData']),
        profileType: function(){
            return this.profileData.type === 'standart' ? 'Базовый' : 'VIP';
        }
    }
}
</script>

<style scoped lang="sass">
    .hero
        &__row
            display: flex
            justify-content: space-between
            align-items: center
        &__text
            color: #fff
            margin-bottom: 12px
            font-weight: 700
            display: flex
            align-items: center
            & svg
                width: 30px
                height: 30px
                margin-left: 12px
            & span
                cursor: pointer
                margin-left: 5px
                text-decoration: underline
                transition: color .2s ease-in-out
                &:hover
                    color: var(--color-primary)
        &__btn
            padding: 12px 30px
            min-width: 250px
            margin-bottom: 12px
</style>