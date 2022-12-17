<template>
  <div class="room">
      <div class="sidebar-wrap">
          <div class="hero sidebar">
              <div v-for="(player, i) in players" :key="i">
                  <CardRole 
                    :nickname="player.nickname"
                    :gender="player.gender"
                    :role="player.role"
                  />
              </div>
          </div>
      </div>
      <div class="room__main">
          <div class="room__head">
              <div class="hero">
                  <p>Вы: {{myInfo.role}}</p>
                  <CardRole 
                    :nickname="myInfo.nickname"
                    :gender="myInfo.gender"
                    :role="myInfo.role"
                  />
              </div>
          </div>
          <div class="hero">
              <div class="dialog">

              </div>
              <div class="dialog-inputs">
                  <input type="text">
                  <button class="btn secondary-btn"></button>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import CardRole from '@/components/UIKit/CardRole.vue'

export default {
    components:{
        CardRole
    },
    sockets: {
        connect: function () {
            console.log('socket connected')
        },
        customEmit: function (data) {
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
    },
    methods: {
        clickButton: function (data) {
            // $socket is socket.io-client instance
            this.$socket.emit('emit_method', data)
        }
    },
    data(){
        return{
            myInfo:{
                nickname: 'KingArthur-99',
                role: 'sheriff',
                gender: 'male'
            },
            players: [
                {
                    nickname: 'nick',
                    gender: 'male',
                    role: 'unknown' 
                },
                {
                    nickname: 'nick',
                    gender: 'female',
                    role: 'citizen' 
                },
                {
                    nickname: 'nick',
                    gender: 'male',
                    role: 'mafia' 
                },
                {
                    nickname: 'nick',
                    gender: 'male',
                    role: 'reporter' 
                },
                {
                    nickname: 'nick',
                    gender: 'male',
                    role: 'barmen' 
                },
                {
                    nickname: 'nick',
                    gender: 'male',
                    role: 'doctor' 
                },
                {
                    nickname: 'nick',
                    gender: 'male',
                    role: 'bodyguard' 
                },
                {
                    nickname: 'nick',
                    gender: 'male',
                    role: 'terrorist' 
                },
                {
                    nickname: 'nick',
                    gender: 'male',
                    role: 'sheriff' 
                },
                {
                    nickname: 'nick',
                    gender: 'male',
                    role: 'lover' 
                },
            ]
        }
    },
}
</script>

<style scoped lang="sass">
    .hero
        background: var(--color-background-soft)
        height: 100%
        width: 100%
        border-radius: 30px
        padding: 30px
    .room
        display: flex
        justify-content: space-between
        align-items: stretch
        background-color: var(--color-background)
        min-height: 100vh
        &__main
            width: 100%
            display: flex
            flex-direction: column
            padding: 20px 20px 20px 0
        &__head
            width: 100%
            padding-bottom: 20px
    .sidebar-wrap
        width: 280px
        padding: 20px
    .sidebar
        display: flex
        justify-content: space-between
        align-items: stretch
        align-content: flex-start
        flex-wrap: wrap
        padding: 20px 15px
    .dialog
        width: 100%
        height: 90%
        border: 1px solid #fff
        padding: 10px
        border-radius: 5px
        margin-bottom: 10px
    .dialog-inputs
        display: flex
        justify-content: space-between
        align-items: stretch
        & input
            outline: none
            width: 100%
            border: 1px solid #fff
            padding: 10px
            border-radius: 5px
            margin-right: 10px
            background: var(--color-background-soft)
            color: #fff
        & button
            width: 60px
</style>