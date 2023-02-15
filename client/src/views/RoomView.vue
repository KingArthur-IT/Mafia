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
                    :targetName="activeTargetName(player.id)"
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
                  <div class="">
                      <div>
                          <p>
                              Вы <span class="sm-font">({{ userData.nickname }})</span>
                              <span v-if="gameRole != 'unknown'">: {{ rolesInfo[gameRole].name[userData.gender] }}</span>
                          </p>
                          <div class="head__card">
                              <CardRole 
                                :nickname="userData.nickname"
                                :gender="userData.gender"
                                :role="gameRole"
                                :showNick="false"
                                :isAlive="gamePlayerIsAlive"
                              />
                              <img src="@/assets/sheriff-badge.png" alt="sheriff" class="label-badge" :class="{ 'badge-visible': gameWasWatched }">
                              <img src="@/assets/tablet.png" alt="heal" class="label-badge" :class="{ 'badge-visible': gameLabels.includes('doctor') }">
                              <img src="@/assets/heart.png" alt="heal" class="label-badge" :class="{ 'badge-visible': gameLabels.includes('lover') }">
                              <img src="@/assets/barmen.png" alt="heal" class="label-badge" :class="{ 'badge-visible': gameLabels.includes('barmen') }">
                              <img src="@/assets/shield.png" alt="heal" class="label-badge" :class="{ 'badge-visible': gameLabels.includes('bodyguard') }">
                          </div>
                      </div>
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
    <img :src="getImageUrl('room-cards', getCardName(gameRole, userData.gender), 'png')" :alt="gameRole" class="modal-img">
    <p class="modal-text">
        <strong>{{ rolesInfo[gameRole]?.name[userData.gender] }}</strong> <br>
        {{ rolesInfo[gameRole]?.description }}
    </p>
  </ModalWrapper>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getImageUrl, getCardName } from '@/use/imgLinks.js'
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
        ...mapGetters('game', ['gameChat', 'gameChatEnable', 'gamePlayers', 'gameRole', 'gameTimer', 'gameStatus', 'gameStage', 'gameWasWatched', 'gamePlayerIsAlive', 'gameLabels']),
        ...mapGetters('user', ['userData']),
        isChatEnable() {
            const chatEnable = this.gameStage === 1 ? this.gameRole === 'mafia' : true
            return this.gameChatEnable && chatEnable
        },
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
        getImageUrl, getCardName,
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
        activeTargetName(playerId) {
            if (!this.gamePlayerIsAlive) return ''
            if (this.gameLabels.includes('lover')) return ''
            if (!this.actionSend) {
                if (this.gameStage === 1 && this.gameRole === 'lover') return 'lover'
                if (this.gameStage === 4 && this.gameRole === 'terrorist') return 'terrorist'
                if (this.gameStage === 4 && !this.gameLabels.includes('barmen') || this.gameStage === 2 && this.gameRole === 'mafia') return 'kill'
                if (this.gameStage === 2 && this.gameRole === 'sheriff') return 'sheriff'
                if (this.gameStage === 2 && this.gameRole === 'doctor') return 'doctor'
                if (this.gameStage === 2 && this.gameRole === 'barmen') return 'barmen'
                if (this.gameStage === 3 && this.gameRole === 'bodyguard') return 'bodyguard'
                if (this.gameStage === 2 && this.gameRole === 'reporter' && this.reporterIds.length < 2 && !this.reporterIds.includes(playerId)) return 'reporter'
            } else return ''
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
            if (!isAlive && this.actionSend) return
            if (this.gameLabels.includes('lover')) return
            //убить
            if (this.activeTargetName(playerId) === 'kill') {
                this.actionSend = true
                this.$socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //исследовать шерифом
            if (this.activeTargetName(playerId) === 'sheriff') {
                this.actionSend = true
                this.$socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //reporter
            if (this.activeTargetName(playerId) === 'reporter') {
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
            //doctor
            if (this.activeTargetName(playerId) === 'doctor') {
                this.actionSend = true
                this.$socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //lover
            if (this.activeTargetName(playerId) === 'lover') {
                this.actionSend = true
                this.$socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //lover
            if (this.activeTargetName(playerId) === 'bodyguard') {
                this.actionSend = true
                this.$socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //barmen
            if (this.activeTargetName(playerId) === 'barmen') {
                this.actionSend = true
                this.$socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //terrorist
            if (this.activeTargetName(playerId) === 'terrorist') {
                this.actionSend = true
                this.$socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
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
    .head__card
        display: flex
        align-items: flex-end
    .label-badge
        width: 0px
        height: 0px
        margin-bottom: 10px
        opacity: 0
        pointer-events: none
        transition: opacity 1s ease, transform 1s cubic-bezier(.31,2,.22,.51)
        transform: scale(0)
        &.badge-visible
            width: 60px
            height: 60px
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