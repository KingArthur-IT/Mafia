<template>
  <div class="room">
      <div class="sidebar-wrap">
          <div class="hero sidebar">
              <div v-for="(player, i) in gamePlayers" :key="i">
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
              <div class="hero head">
                  <div class="head__card">
                      <p>Вы<span v-if="gameRole != 'unknown'">: {{gameRole}}</span></p>
                      <CardRole 
                        :nickname="userData.nickname"
                        :gender="userData.gender"
                        :role="gameRole"
                        :showNick="false"
                      />
                  </div>
                  <div class="stage">
                      <p>{{gameStatus}}</p>
                      <div class="timer" v-if="gameTimer > 0"><strong>{{gameTimer}} c</strong></div>
                  </div>
                  <QuiteIcon class="leave" @click="$router.push({name: 'profile.holl'})" />
              </div>
          </div>
          <div class="hero">
              <div class="dialog">
                  <p v-for="(msg, i) in gameChat" :key="i" class="chat-msg" :class="{'server-msg': msg.author === 'server'}">{{msg.text}}</p>
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
import { mapGetters, mapActions } from 'vuex'
import QuiteIcon from '@/components/icons/LogoutIcon.vue'

export default {
    components:{
        CardRole,
        QuiteIcon
    },
    data() {
        return {
            roomId: -1
        }
    },
    computed:{
        ...mapGetters('game', ['gameChat', 'gamePlayers', 'gameRole', 'gameTimer', 'gameStatus']),
        ...mapGetters('user', ['userData']),
    },
    mounted() {
        this.roomId = Number(this.$route.params.id)
    },
    beforeUnmount(){
        this.leaveTheRoom()
    },
    methods: {
        ...mapActions('toast', ['showToast']),
        leaveTheRoom() {
            if (this.userData?.id){
                this.$socket.emit('leaveRoom', {userId: this.userData.id, nickname: this.userData.nickname, roomId: this.roomId}, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Ошибка при выходе из комнаты', type: 'error'})
                })
            }
        }
    }
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

    .chat-msg
        text-align: right
    .server-msg
        text-align: center
        color: #d8ff00
    .head
        display: flex
        justify-content: space-between
        align-items: center
    .leave
        cursor: pointer
        width: 35px
        height: 35px
        fill: #fff
    .stage
        text-align: center
</style>