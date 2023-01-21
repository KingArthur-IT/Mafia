<template>
  <div class="sidebar">
    <div>
      <div class="sidebar__logo lg-font">MafiaWorld</div>
      <div class="profile-section">
        <div class="profile-section__icon md-font">{{userData?.nickname[0]}}</div>
        <div class="profile-section__nick">{{userData?.nickname}}</div>
      </div>
    </div>
    <div>
      <div class="sidebar__item" @click="goToPage('profile.main')">
        <HomeIcon class="sidebar__icon" />
        <div class="sidebar__item-name">Домой</div>
      </div>
      <div class="sidebar__item" @click="goToPage('profile.settings')">
        <SettingsIcon class="sidebar__icon" />
        <div class="sidebar__item-name">Настройки</div>
      </div>
      <div class="sidebar__item" @click="goToPage('profile.support')">
        <SupportIcon class="sidebar__icon" />
        <div class="sidebar__item-name">Поддержка</div>
      </div>
      <div class="sidebar__item" @click="goToPage('profile.market')">
        <MarketIcon class="sidebar__icon" />
        <div class="sidebar__item-name">Магазин</div>
      </div>
    </div>
    <div class="sidebar__information">
      <p>Information</p>
      <a href="#" target="_blank">Game Rules</a>
      <a href="#" target="_blank">Terms and conditions</a>
      <a href="#" target="_blank">Private Policy</a>
    </div>
    <div class="sidebar__item">
      <LogoutIcon class="sidebar__icon" />
      <div class="sidebar__item-name">Выйти</div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import SupportIcon from '@/components/icons/SupportIcon.vue'
import MarketIcon from '@/components/icons/MarketIcon.vue'

export default {
  components:{
    LogoutIcon,
    SettingsIcon,
    HomeIcon,
    SupportIcon,
    MarketIcon
  },
  methods:{
    goToPage(pageName){
      this.$router.push({name: pageName})
    },
  },
  computed:{
    ...mapGetters('user', ['userData'])
  }
}
</script>

<style scoped lang="sass">
  .sidebar
    background-color: var(--color-background-soft)
    height: 100%
    width: 100%
    border-radius: 30px
    display: flex
    flex-direction: column
    justify-content: space-between
    padding: 15px 30px 30px
    &__logo
      color: var(--color-text)
      font-family: 'Kaushan Script', cursive
      text-align: center
      margin-bottom: 15px
    &__item
      display: flex
      justify-content: flex-start
      align-items: center
      cursor: pointer
      font-weight: 500
      padding: 6px 0
    &__icon
      width: 30px
      height: 30px
      margin-right: 10px
    &__information
      font-weight: 500
      & p
        margin-bottom: 15px
      & a
        font-size: 16px
        color: #3e4047
        display: block
        margin-bottom: 5px
  .profile-section
      width: 100%
      background: var(--color-background-soft)
      margin-bottom: 15px
      cursor: pointer
      &__icon
        height: 100px
        width: 100px
        color: #fff
        border-radius: 50%
        background-color: #ff0000
        border: 3px solid #fff
        display: flex
        justify-content: center
        align-items: center
        margin: 0 auto
        text-align: center
        font-weight: 700
        margin-bottom: 5px
      &__nick
        text-align: center
        font-weight: 500
</style>