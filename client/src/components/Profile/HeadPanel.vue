<template>
  <div class="panel">
    <div class="panel__item">
      <p class="panel__title">{{$route.meta.pageName}}</p>
    </div>
    <div class="panel__icons">
      <!-- <div class="panel__item" @click="$router.push({name: 'profile.message'})">
        <LetterIcon class="panel__icon"/>
        <div class="panel__badge">{{messagesCount}}</div>
      </div> -->
      <div class="panel__item" @click="$router.push({ name: 'profile.notifications' })">
        <BellIcon class="panel__icon panel__bell"/>
        <div v-if="newNotificationsCount" class="panel__badge">{{ newNotificationsCount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import BellIcon from '@/components/icons/BellIcon.vue'
import LetterIcon from '@/components/icons/LetterIcon.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components:{
    BellIcon,
    LetterIcon
  },
  data() {
    return {

    }
  },
  mounted() {
    this.getNotificationsData()
  },
  computed: {
    ...mapGetters('user', ['notificationsList']),
    newNotificationsCount() {
      return this.notificationsList.filter(n => !n.isRead).length
    }
  },
  methods: {
    ...mapActions('user', ['getNotificationsData'])
  }
}
</script>

<style scoped lang="sass">
  .panel
    background: var(--color-background-soft)
    width: 100%
    border-radius: 15px
    padding: 30px
    display: flex
    justify-content: space-between
    align-items: center
    &__icons
      display: flex
      align-items: center
      justify-content: flex-end
    &__icon
      width: 30px
      height: 30px
      margin-left: 30px
    &__bell
      width: 26px
      height: 26px
    &__item
      position: relative
    &__badge
      position: absolute
      background-color: var(--color-primary)
      color: #fff
      display: flex
      justify-content: center
      align-items: center
      text-align: center
      font-size: 14px
      width: 20px
      height: 20px
      border-radius: 50%
      bottom: 0
      right: 0
      transform: translate(50%, 0)
    &__title
      color: #fff
      text-transform: uppercase
      font-weight: 600
</style>