<template>
  <div class="room">
      <div class="sidebar-wrap">
          <div class="hero sidebar">
              <div v-for="(player, i) in gamePlayers.filter(pl => pl.id !== userData.id)" :key="i">
                  <CardRole 
                    :nickname="player.nickname"
                    :gender="player.gender"
                    :role="player.role"
                    @click="sendAction(player.id)"
                  />
              </div>
          </div>
      </div>
      <div class="room__main">
          <div class="room__head">
              <div class="hero head">
                  <div class="head__card">
                      <p>Вы ({{userData.nickname}})<span v-if="gameRole != 'unknown'">: {{gameRole}}</span></p>
                      <CardRole 
                        :nickname="userData.nickname"
                        :gender="userData.gender"
                        :role="gameRole"
                        :showNick="false"
                      />
                  </div>
                  <div class="stage">
                      <p>{{gameStatus}}</p>
                      <div class="timer" v-if="gameTimer > 0"><strong>{{gameTimer}} cек</strong></div>
                  </div>
                  <QuiteIcon class="leave" @click="$router.push({name: 'profile.holl'})" />
              </div>
          </div>
          <div class="hero">
              <div class="dialog">
                  <div 
                    v-for="(msg, i) in gameChat" 
                    :key="i" class="chat-msg" 
                    :class="{'server-msg': msg.author === 'server', 'own-msg': msg.author === userData.nickname}"
                  >
                    <div v-if="msg.author === 'server'">{{ msg.text }}</div>
                    <div v-else>
                        <span v-if="isOtherPlayerMsg(msg)" class="sm-font author-name">{{ msg.author }}:</span>
                        <span>{{ msg.text }}</span>
                    </div>
                  </div>
              </div>
              <div class="dialog-inputs">
                  <input v-model="inputMsgText" type="text">
                  <button class="btn secondary-btn" @click="sendMsg"></button>
              </div>
          </div>
      </div>
  </div>
  <ModalWrapper v-model="isModalOpened" :title="'ВАША ИГРОВАЯ РОЛЬ'">
    <img :src="getImageUrl('room-cards', `${gameRole}-${userData.gender[0]}`, 'png')" :alt="gameRole" class="modal-img">
    <p class="modal-text">{{ rolesInfo[gameRole]?.description }}</p>
  </ModalWrapper>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getImageUrl } from '@/use/imgLinks.js'
import { rolesInfo } from '@/data/data'
import CardRole from '@/components/UIKit/CardRole.vue'
import QuiteIcon from '@/components/icons/LogoutIcon.vue'
import ModalWrapper from '@/components/Modals/ModalWrapper.vue'

export default {
    components:{
        CardRole,
        QuiteIcon,
        ModalWrapper
    },
    data() {
        return {
            roomId: -1,
            isModalOpened: false,
            rolesInfo,
            inputMsgText: ''
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
    watch: {
        gameRole() {
            this.isModalOpened = true
        }
    },
    methods: {
        ...mapActions('toast', ['showToast']),
        getImageUrl,
        isOtherPlayerMsg(msg) { //msg.text, msg.author
            return msg.author !== 'server' && msg.author !== this.userData.nickname
        },
        leaveTheRoom() {
            if (this.userData?.id){
                this.$socket.emit('leaveRoom', { userId: this.userData.id, nickname: this.userData.nickname, roomId: this.roomId }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Ошибка при выходе из комнаты', type: 'error'})
                })
            }
        },
        sendMsg() {
            if (this.userData?.id){
                this.$socket.emit('sendMsg', { userId: this.userData.id, nickname: this.userData.nickname, roomId: this.roomId, msgText: this.inputMsgText }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Отправка сообщения не удалась', type: 'error'})
                })
            }
        },
        sendAction(playerId) {
            this.$socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                if (response?.status !== 'ok')
                    this.showToast({text: response.text || 'Отправка сообщения не удалась', type: 'error'})
            })
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
        text-align: left
        padding: 5px 0
    .server-msg
        text-align: center
        color: #fff// #d8ff00
        font-style: italic
    .own-msg
        text-align: right
    .author-name
        display: block
        font-style: italic
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
    .modal-img
        width: 200px
        display: block
        margin: 0 auto
        margin-bottom: 10px
        mix-blend-mode: hard-light
    .modal-text
        max-width: 300px
        text-align: center
</style>