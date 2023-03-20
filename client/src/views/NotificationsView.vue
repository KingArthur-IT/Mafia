<template>
  <ul>
      <li v-for="(notification, i) in list" :key="i">
        <div>{{ notification.title }}</div>
        <p>
            {{ notification.msg }}
        </p>
        <div>{{ notification.date }}</div>
      </li>
  </ul>
</template>

<script>
export default {
    data() {
        return {
            notificationList: [
                {
                    title: 'Очень важное уведомление',
                    msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                    date: '20.03.2023',
                    isRead: false
                },
                {
                    title: 'Очень важное уведомление',
                    msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                    date: '21.03.2023',
                    isRead: false
                }
            ]
        }
    },
    computed: {
        list() {
            return this.notificationList.reverse()
        }
    }
}
</script>

<style>

</style>