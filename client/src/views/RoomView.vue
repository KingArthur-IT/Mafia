<template>
  <div class="room">
      <!-- sidebar -->
      <div class="sidebar-wrap">
          <div class="hero sidebar">
              <div v-for="(player, i) in gamePlayers.filter(pl => pl.id !== userData.id)" :key="i">
                  <CardRole 
                    :nickname="player.nickname"
                    :gender="player.gender"
                    :role="player.role"
                    :killTarget="killTargetActive && !actionSend"
                    :detectTarget="sheriffDetectorActive || (reporterDetectorActive && !reporterIds.includes(player.id))"
                    :isAlive="player.isLive"
                    @click="sendAction(player.id, player.isLive)"
                  />
              </div>
          </div>
      </div>
      <!-- main -->
      <div class="room__main">
          <!-- head -->
          <div class="room__head">
              <div class="hero head">
                  <div class="head__card">
                      <div>
                          <p>
                              Вы <span class="sm-font">({{ userData.nickname }})</span>
                              <span v-if="gameRole != 'unknown'">: {{ rolesInfo[gameRole].name[userData.gender] }}</span>
                          </p>
                          <CardRole 
                            :nickname="userData.nickname"
                            :gender="userData.gender"
                            :role="gameRole"
                            :showNick="false"
                            :isAlive="gamePlayerIsAlive"
                          />
                      </div>
                      <img src="@/assets/sheriff-badge.png" alt="sheriff" class="sheriff-badge" :class="{'badge-visible': gameWasWatched}">
                  </div>
                  <div class="stage">
                      <p>{{gameStatus}}</p>
                      <div class="timer" v-if="gameTimer > 0"><strong>{{gameTimer}} cек</strong></div>
                  </div>
                  <QuiteIcon class="leave" @click="$router.push({name: 'profile.holl'})" />
              </div>
          </div>
          <!-- chat -->
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
                  <input 
                    v-model="inputMsgText" 
                    type="text"
                    :disabled="!isChatEnable" 
                    :class="{'disable': !isChatEnable}"
                    @keydown.enter="sendMsg"
                  >
                  <button 
                    class="btn secondary-btn" 
                    :class="{'disable': !isChatEnable}"
                    @click="sendMsg"
                  ></button>
              </div>
          </div>
      </div>
  </div>
  <ModalWrapper v-model="isModalOpened" :title="'ВАША ИГРОВАЯ РОЛЬ'">
    <img :src="getImageUrl('room-cards', `${gameRole}-${userData.gender[0]}`, 'png')" :alt="gameRole" class="modal-img">
    <p class="modal-text">
        <strong>{{ rolesInfo[gameRole]?.name[userData.gender] }}</strong> <br>
        {{ rolesInfo[gameRole]?.description }}
    </p>
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
            inputMsgText: '',
            actionSend: false,
            reporterIds: []
        }
    },
    computed: {
        ...mapGetters('game', ['gameChat', 'gameChatEnable', 'gamePlayers', 'gameRole', 'gameTimer', 'gameStatus', 'gameStage', 'gameWasWatched', 'gamePlayerIsAlive']),
        ...mapGetters('user', ['userData']),
        isChatEnable() {
            const chatEnable = this.gameStage === 1 ? this.gameRole === 'mafia' : true
            return this.gameChatEnable && chatEnable
        },
        killTargetActive() {
            return (this.gameStage === 4 || this.gameStage === 2 && this.gameRole === 'mafia') && this.gamePlayerIsAlive
        },
        sheriffDetectorActive() {
            return this.gameStage === 2 && this.gameRole === 'sheriff' && !this.actionSend && this.gamePlayerIsAlive
        },
        reporterDetectorActive() {
            return this.gameStage === 2 && this.gameRole === 'reporter' && this.reporterIds.length < 2 && !this.actionSend && this.gamePlayerIsAlive
        }
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
        },
        gameStage() {
            this.actionSend = false
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
            if (this.userData?.id && this.inputMsgText){
                this.$socket.emit('sendMsg', { userId: this.userData.id, nickname: this.userData.nickname, roomId: this.roomId, msgText: this.inputMsgText }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Отправка сообщения не удалась', type: 'error'})
                    else this.inputMsgText = ''
                })
            }
        },
        sendAction(playerId, isAlive) {
            if (!isAlive) return
            //убить
            if (this.killTargetActive && !this.actionSend) {
                this.actionSend = true
                this.$socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //исследовать шерифом
            if (this.sheriffDetectorActive) {
                this.actionSend = true
                this.$socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //reporter
            if (this.reporterDetectorActive) {
                if (!this.reporterIds.includes(playerId))
                    this.reporterIds.push(playerId)

                if (this.reporterIds.length > 1) {
                    this.actionSend = true
                    this.$socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: this.reporterIds }, response => {
                        if (response?.status !== 'ok')
                            this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                        this.reporterIds = []
                    })
                }
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
    .head__card
        display: flex
        align-items: flex-end
    .sheriff-badge
        width: 60px
        height: 60px
        margin-bottom: 10px
        opacity: 0
        pointer-events: none
        transition: opacity 1s ease, transform 1s cubic-bezier(.31,2,.22,.51)
        transform: scale(0)
        &.badge-visible
            opacity: 1
            transform: scale(1)
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
            &.disable
                color: var(--color-background-soft)
                border: 1px solid darken(#fff, 40%)
        & button
            width: 60px
            &.disable
                background-color: transparent
                border-color: darken(#fff, 40%)

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