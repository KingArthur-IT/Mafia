<template>
  <ul class="notifications">
      <li 
        v-for="(notification, i) in notificationsList" :key="i" 
        class="notifications__item" 
        :class="{'new': !notification.isRead}"
      >
        <div class="notifications__title md-font">
            <div>{{ notification.title }}</div>
        </div>
        <p class="notifications__msg">
            {{ notification.msg }}
        </p>
        <div class="notifications__date">{{ notification.date }}</div>
      </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters('user', ['notificationsList'])
    },
    mounted() {
        this.setAllNotificationsRead()
    },
    methods: {
        ...mapActions('user', ['setAllNotificationsRead'])
    }
}
</script>

<style scoped lang="sass">
.notifications
    &__item
        padding: 12px
        border: 1px solid var(--color-background-soft)
        border-radius: 12px
        margin-bottom: 12px
        color: darken(#fff, 20%)
        &.new
            color: #fff
            border-color: #fff
    &__title
        display: flex
        align-items: center
        justify-content: space-between
        margin-bottom: 12px
    &__msg
        margin-bottom: 5px
    &__date
        font-style: italic
</style>