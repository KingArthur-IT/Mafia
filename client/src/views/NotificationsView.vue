<template>
  <ul v-if="notificationsList.length" class="notifications">
      <li 
        v-for="(notification, i) in notificationsList" :key="i" 
        class="notifications__item" 
        :class="{'new': !notification.isread}"
      >
        <div class="notifications__title md-font">
            <div>{{ notification.title }}</div>
        </div>
        <p class="notifications__msg" v-html="notification.message"></p>
        <div class="notifications__date">{{ notification.date }}</div>
      </li>
  </ul>
  <p v-else>Уведомлений нет</p>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters('user', ['notificationsList'])
    },
    mounted() {
        setTimeout(() => {
            this.setAllNotificationsRead()
        }, 3000);
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