<template>
  <div class="sidebar">
    <div>
      <div class="sidebar__logo">
        <Logo />
      </div>
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
      <div class="sidebar__item" @click="goToPage('profile.about')">
        <AboutIcon />
        <div class="sidebar__item-name">О проекте</div>
      </div>
      <div class="sidebar__item" @click="goToPage('profile.market')">
        <MarketIcon class="sidebar__icon" />
        <div class="sidebar__item-name">Магазин</div>
      </div>
    </div>
    <div class="sidebar__information">
      <div class="sidebar__information-name">Условия использования</div>
      <div class="sidebar__information-name">Политика конфиденциальности</div>
    </div>
    <div class="sidebar__item" @click="logout">
      <LogoutIcon class="sidebar__icon" />
      <div class="sidebar__item-name">Выйти</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from '@/components/icons/ProjectLogo.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import AboutIcon from '@/components/icons/AboutIcon.vue'
import MarketIcon from '@/components/icons/MarketIcon.vue'

export default {
  components: {
    Logo,
    LogoutIcon,
    SettingsIcon,
    HomeIcon,
    AboutIcon,
    MarketIcon
  },
  methods: {
    goToPage(pageName) {
      this.$router.push({ name: pageName })
    },
    logout() {
      this.$router.push({ path: '/' })
    }
  },
  computed: {
    ...mapGetters('user', ['userData'])
  }
}
</script>

<style scoped lang="sass">
  .sidebar
    background-color: var(--color-background-soft)
    height: 100%
    width: 100%
    border-radius: 15px
    display: flex
    flex-direction: column
    justify-content: space-between
    padding: 15px 30px 30px
    &__logo
      margin-bottom: 15px
      & svg
        width: 180px
    &__icon
      transition: stroke .3s ease
    &__item
      display: flex
      justify-content: flex-start
      align-items: center
      cursor: pointer
      font-weight: 500
      padding: 6px 0
      &-name
        color: #fff
        transition: color .3s ease
        padding-top: 5px
      &:hover
        & .sidebar__item-name
          color: var(--color-primary)
        & .sidebar__icon
          stroke: var(--color-primary)
    &__icon
      width: 30px
      height: 30px
      margin-right: 10px
    &__information
      font-weight: 500
      margin-top: 60px
      &-name
        cursor: pointer
        font-size: 16px
        margin-bottom: 10px
        line-height: 1
        transition: color .3s ease
        &:hover
          color: var(--color-primary)
  .profile-section
      width: 100%
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