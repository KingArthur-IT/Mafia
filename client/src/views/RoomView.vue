<template>
  <div class="room">
      <!-- sidebar -->
      <div class="sidebar-wrap">
          <p>Игроки:</p>
          <div class="hero sidebar custom-scrollbar">
              <div v-for="(player, i) in gamePlayers.filter(pl => pl.id !== userData.id)" :key="i">
                  <CardRole 
                    :nickname="player.nickname"
                    :gender="player.gender"
                    :role="player.role"
                    :targetName="activeTargetName(player.id)"
                    :isAlive="player.isLive"
                    :votesCount="gameVoicesCount[player.id] || 0"
                    :gameActionSended="gameActionSended"
                    @click="sendAction(player.id, player.isLive)"
                  />
              </div>
          </div>
      </div>
      <!-- main -->
      <div class="room__main">
          <!-- head -->
          <div class="room__head">
            <div class="head-col">
                <p>
                    <span>Вы </span>
                    <span v-if="userData.id" class="sm-font">({{ userData.nickname }})</span>
                    <span v-if="gameRole != 'unknown'">: {{ rolesInfo[gameRole].name[userData.gender] }}</span>
                </p>
                <div class="head__card">
                    <div style="margin-right: 5px">
                        <CardRole 
                            :nickname="userData.nickname"
                            :gender="userData.gender"
                            :role="gameRole"
                            :showNick="false"
                            :isAlive="gamePlayerIsAlive"
                            :votesCount="gameVoicesCount[userData.id] || 0"
                            :gameActionSended="true"
                        />
                    </div>
                    <div class="head__labels">
                        <img src="@/assets/sheriff-badge.png" alt="sheriff" class="label-badge" :class="{ 'badge-visible': gameLabels.includes('sheriff') }">
                        <img src="@/assets/tablet.png" alt="heal" class="label-badge" :class="{ 'badge-visible': gameLabels.includes('doctor') }">
                        <img src="@/assets/heart.png" alt="heal" class="label-badge" :class="{ 'badge-visible': gameLabels.includes('lover') }">
                        <img src="@/assets/barmen.png" alt="heal" class="label-badge" :class="{ 'badge-visible': gameLabels.includes('barmen') }">
                        <img src="@/assets/shield.png" alt="heal" class="label-badge" :class="{ 'badge-visible': gameLabels.includes('bodyguard') }">
                    </div>
                </div>
            </div>
            <div class="stage head-col">
                <div class="stage__title">
                    <p>{{gameStatus}}</p>
                    <div class="timer" v-if="gameTimer > 0"><strong>{{gameTimer}} cек</strong></div>
                </div>
                <div v-if="this.gameStage" class="stage__count">
                    Мафия: {{ gameMafiaPlayersCount }} Мирные: {{ gamePlayers?.filter(pl => pl.isLive).length -  gameMafiaPlayersCount}}
                </div>
            </div>
            <div class="leave head-col" @click="$router.push({name: 'profile.holl'})">
                <QuiteIcon />
                <p>В холл</p>
            </div>
          </div>
          <!-- chat -->
          <div class="chat-wrapper">
              <div class="dialog custom-scrollbar">
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
                    class="btn" 
                    :class="{'disable': !isChatEnable}"
                    @click="sendMsg"
                  >
                    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.33 3.66996C20.1408 3.48213 19.9035 3.35008 19.6442 3.28833C19.3849 3.22659 19.1135 3.23753 18.86 3.31996L4.23 8.19996C3.95867 8.28593 3.71891 8.45039 3.54099 8.67255C3.36307 8.89471 3.25498 9.16462 3.23037 9.44818C3.20576 9.73174 3.26573 10.0162 3.40271 10.2657C3.5397 10.5152 3.74754 10.7185 4 10.85L10.07 13.85L13.07 19.94C13.1906 20.1783 13.3751 20.3785 13.6029 20.518C13.8307 20.6575 14.0929 20.7309 14.36 20.73H14.46C14.7461 20.7089 15.0192 20.6023 15.2439 20.4239C15.4686 20.2456 15.6345 20.0038 15.72 19.73L20.67 5.13996C20.7584 4.88789 20.7734 4.6159 20.7132 4.35565C20.653 4.09541 20.5201 3.85762 20.33 3.66996ZM4.85 9.57996L17.62 5.31996L10.53 12.41L4.85 9.57996ZM14.43 19.15L11.59 13.47L18.68 6.37996L14.43 19.15Z" fill="#fff"/>
                    </svg>
                  </button>
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
  <ModalWrapper v-model="isEndGameModalOpened" :title="'Игра окончена'">
    <p class="modal-text">
        <span class="md-font">
            <strong v-if="(isInMafiaTeam && gameRezult.winnerTeam === 'mafia') || (!isInMafiaTeam && gameRezult.winnerTeam !== 'mafia')">Поздравляем!</strong>
            <strong v-else>Вы проиграли</strong>
        </span>
        <br>
        <span>Победила команда
            <span v-if="gameRezult.winnerTeam === 'mafia'"> мафии</span>
            <span v-else> мирных жителей</span>
        </span> <br>
        <span>Вы получили +{{ gameWinnerScore }} очков рейтинга</span>
    </p>
  </ModalWrapper>
</template>

<script>
import SocketioService from '@/services/socketio.service.js';
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
            isEndGameModalOpened: false,
            rolesInfo,
            inputMsgText: '',
            reporterIds: []
        }
    },
    computed: {
        ...mapGetters('game', ['gameChat', 'gameChatEnable', 'gamePlayers', 'gameRole', 'gameTimer', 'gameStatus', 'gameStage', 'gamePlayerIsAlive', 'gameLabels', 'gameVoicesCount', 'gameActionSended', 'gameMafiaPlayersCount', 'gameRezult', 'gameWinnerScore']),
        ...mapGetters('user', ['userData']),
        isChatEnable() {
            const chatEnable = this.gameStage === 1 ? this.gameRole === 'mafia' : true
            return this.gameChatEnable && chatEnable
        },
        isInMafiaTeam() {
            return ['barmen', 'mafia', 'terrorist'].includes(this.gameRole)
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
        gameVoicesCount() {
            console.log(this.gameVoicesCount);
        },
        gameRezult() {
            this.isEndGameModalOpened = true
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
                SocketioService.socket.emit('leaveRoom', { userId: this.userData.id, nickname: this.userData.nickname, roomId: this.roomId }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Ошибка при выходе из комнаты', type: 'error'})
                })
            }
        },
        activeTargetName(playerId) {
            if (!this.gamePlayerIsAlive) return ''
            if (this.gameLabels.includes('lover')) return ''
            if (!this.gameActionSended) {
                if (this.gameStage === 1 && this.gameRole === 'lover') return 'lover'
                if (this.gameStage === 4 && this.gameRole === 'terrorist') return 'terrorist'
                if (this.gameStage === 4 && !this.gameLabels.includes('barmen') || this.gameStage === 2 && this.gameRole === 'mafia') return 'kill'
                if (this.gameStage === 2 && this.gameRole === 'sheriff' && !this.gamePlayers.find(pl => pl.id === playerId).labels.includes('sheriff')) return 'sheriff'
                if (this.gameStage === 2 && this.gameRole === 'doctor') return 'doctor'
                if (this.gameStage === 2 && this.gameRole === 'barmen') return 'barmen'
                if (this.gameStage === 3 && this.gameRole === 'bodyguard') return 'bodyguard'
                if (this.gameStage === 2 && this.gameRole === 'reporter' && 
                    this.reporterIds.length < 2 && !this.reporterIds.includes(playerId) &&
                    this.gamePlayers.find(pl => pl.id === playerId).role === 'unknown' &&
                    !this.gamePlayers.find(pl => pl.id === playerId).labels.includes('reporter') &&
                    this.gamePlayers.filter(pl => !pl.labels.includes('reporter')).length > 2
                ) return 'reporter'
            } else return ''
        },
        sendMsg() {
            if (this.userData?.id && this.inputMsgText){
                SocketioService.socket.emit('sendMsg', { userId: this.userData.id, nickname: this.userData.nickname, roomId: this.roomId, msgText: this.inputMsgText }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Отправка сообщения не удалась', type: 'error'})
                    else this.inputMsgText = ''
                })
            }
        },
        sendAction(playerId, isAlive) {
            //add user nick to chat
            if (!this.activeTargetName(playerId) || this.gameActionSended)
                this.inputMsgText += this.gamePlayers.find(pl => pl.id === playerId).nickname + ' '

            //actions
            if (!isAlive && this.gameActionSended) return
            // if (this.gameLabels.includes('lover')) return
            //убить
            if (this.activeTargetName(playerId) === 'kill') {
                SocketioService.socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //исследовать шерифом
            if (this.activeTargetName(playerId) === 'sheriff') {
                SocketioService.socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //reporter
            if (this.activeTargetName(playerId) === 'reporter') {
                if (!this.reporterIds.includes(playerId) && this.gamePlayers.find(pl => pl.id === playerId).role === 'unknown')
                    this.reporterIds.push(playerId)

                if (this.reporterIds.length > 1) {
                    SocketioService.socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: this.reporterIds }, response => {
                        if (response?.status !== 'ok')
                            this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                        this.reporterIds = []
                    })
                }
            }
            //doctor
            if (this.activeTargetName(playerId) === 'doctor') {
                SocketioService.socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //lover
            if (this.activeTargetName(playerId) === 'lover') {
                SocketioService.socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //lover
            if (this.activeTargetName(playerId) === 'bodyguard') {
                SocketioService.socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //barmen
            if (this.activeTargetName(playerId) === 'barmen') {
                SocketioService.socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
                    if (response?.status !== 'ok')
                        this.showToast({text: response.text || 'Действие не удалось', type: 'error'})
                })
            }
            //terrorist
            if (this.activeTargetName(playerId) === 'terrorist') {
                SocketioService.socket.emit('gameAction', { userId: this.userData.id, roomId: this.roomId, actionIds: [playerId] }, response => {
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
        height: 100%
        width: 100%
        padding: 30px
    .room
        display: flex
        justify-content: space-between
        align-items: stretch
        background-color: var(--color-background)
        min-height: 100vh
        overflow: hidden
        &__main
            width: 100%
            display: flex
            flex-direction: column
            padding: 20px 20px 20px 0
        &__head
            width: 100%
            padding-bottom: 20px
            display: flex
            justify-content: space-between
            align-items: center
    .head-col
        flex-basis: 33.33%
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
        min-width: 210px
        max-width: 210px
        padding: 20px 10px
        & p
            padding-left: 12px
    .sidebar
        max-height: calc(100vh - 65px)
        overflow-y: auto
        display: flex
        justify-content: space-between
        align-items: stretch
        align-content: flex-start
        flex-wrap: wrap
        padding: 0px 12px
    .dialog
        width: 100%
        height: calc(100vh - 210px)
        max-height: calc(100vh - 210px)
        overflow: auto
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
            background: transparent
            color: #fff
            caret-color: var(--color-primary)
            &.disable
                color: var(--color-background-soft)
                border: 1px solid darken(#fff, 40%)
        & button
            width: 60px
            background: transparent
            border: 1px solid #fff
            border-radius: 5px
            display: flex
            justify-content: center
            align-items: center
            transition: background .3s ease
            & svg
                width: 30px
                height: 30px
            &.disable
                background-color: transparent
                border-color: darken(#fff, 40%)
                & svg path
                    fill: darken(#fff, 40%)
                &:hover
                    background-color: transparent
                    & svg path
                        fill: darken(#fff, 40%)
            &:hover
                background-color: #fff
                & svg path
                    fill: var(--color-background)
    .chat-wrapper
        height: 100%
        width: 100%
    .chat-msg
        text-align: left
        padding: 5px 0
    .server-msg
        text-align: center
        color: #fff
        font-style: italic
    .own-msg
        text-align: right
    .author-name
        display: block
        font-style: italic
    .leave
        cursor: pointer
        display: flex
        align-items: center
        justify-content: flex-end
        & p
            padding-left: 2px
    .stage
        text-align: center
        &__title
            font-weight: 600
            font-size: 22px
            margin-bottom: 5px
    .modal-img
        width: 200px
        display: block
        margin: 0 auto
        margin-bottom: 10px
        mix-blend-mode: hard-light
    .modal-text
        text-align: center
        & .md-font
            color: var(--color-primary)


@media screen and (max-width: 1024px)
    .sidebar-wrap
        min-width: 170px
        max-width: 170px
        padding: 20px 0
    .label-badge
        &.badge-visible
            width: 40px
            height: 40px
    
@media screen and (max-width: 800px)
    .label-badge
        margin-bottom: 0
        &.badge-visible
            width: 25px
            height: 25px
    .head__labels
        position: absolute
        z-index: 2
        top: -3px
        left: 75px
        flex-direction: column
        display: flex
    .room__head
        padding-bottom: 10px

@media screen and (max-width: 680px)
    .head-col
        flex-basis: 20%
    .stage.head-col
        flex-basis: 60%
    .leave
        & p
            display: none

@media screen and (max-width: 600px)
    .sidebar-wrap
        min-width: 150px
        max-width: 150px
        padding: 10px 0
    .room
        &__main
            padding: 10px 10px 10px 0
        &__head
            padding-bottom: 10px
    .sidebar
        max-height: calc(100vh - 85px)
    .dialog
        height: calc(100vh - 170px)
        max-height: calc(100vh - 170px)
    .stage
        &__title
            font-size: 18px
        &__count
            font-size: 16px
    .label-badge
        &.badge-visible
            width: 20px
            height: 20px
    .head__labels
        top: 0
        left: 63px

@media screen and (max-width: 540px)
    .sidebar-wrap
        min-width: 115px
        max-width: 115px
        & p
            font-size: 14px
    .sidebar
        padding: 0 6px
    .stage
        &__title
            font-size: 16px
        &__count
            font-size: 12px
    .room__head div p
        font-size: 14px
    .head__labels
        left: 53px

@media screen and (max-width: 375px)
    .head-col
        flex-basis: 33.33%
    .stage.head-col
        flex-basis: 40%
</style>