<template>
    <div class="holl">
        <div class="holl__header">
            <button class="btn secondary-btn holl__add-btn" @click="$router.push({ name: 'profile.create' })">
                Добавить комнату
                <PlusIcon class="holl__add-icon" />
            </button>
        </div>
        <div v-if="this.roomsList.length">
            <div class="filter">
                <div class="filter-wrapper">
                    <input v-model="searchValue" class="search-input" type="text" placeholder="Поиск по названию">
                </div>

            </div>
            <table v-if="currentPageArray?.length" class="table table-no-spacing">
                <tr class="table__row">
                    <th width="20%">Название комнаты</th>
                    <th width="20%">Статус</th>
                    <th width="15%">Количество игроков</th>
                    <th width="20%">Мин/Макс игроков</th>
                    <th width="25%">Дополнительные роли</th>
                </tr>
                <tr v-for="room in currentPageArray" :key="room.id" @click="goToRoom(room.id)">
                    <td>{{ room.name }}</td>
                    <td>{{ statuses[room.status] }}</td>
                    <td>{{ room.users_count }}</td>
                    <td>{{ room.min_persons }} / {{ room.max_persons }}</td>
                    <td class="holl__rolles-list">
                        <div class="holl__role" v-for="(role, i) in room.roles" :key="i">
                            <div v-if="role.count">
                                <img :src="getImageUrl('short-cards', role.role ,'png')" :alt="role.role">
                                <span>x{{role.count}}</span>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <p v-else>Созданных комнат нет</p>
        <Pagination v-if="filteredArray?.length > perPage"
            v-model="currentPage"
            :arrayLength="roomsList.length"
            :perPage="perPage"
        />
    </div>
</template>

<script>
import SocketioService from '@/services/socketio.service.js';
import { mapActions, mapGetters } from 'vuex'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import { getImageUrl } from '@/use/imgLinks.js'
import Pagination from '@/components/UIKit/Pagination.vue'

export default {
    components: {
        PlusIcon,
        Pagination
    },
    data() {
        return {
            searchValue: '',
            currentPage: 1,
            perPage: 5,
            roomsListData: [],
            statuses: {
                collecting: 'Набор игроков',
                countdown: 'Скоро начнется', 
                playing: 'В процессе'
            }
        }
    },
    created() {
        SocketioService.setupSocketConnection();
    },
    mounted(){
        this.clearAllGameStates()
        //enterGameHall socket
        if (this.userData?.id){
            SocketioService.socket.emit('enterGameHall', { userId: this.userData.id }, response => {
                if (response?.status !== 'ok')
                    this.showToast({ text: response.text || 'Ошибка при получении списка комнат', type: 'error' })
            })
        } else this.showToast({ text: 'Не могу идентифицировать пользователя', type: 'error' })
    },
    methods: {
        ...mapActions('toast', ['showToast']),
        ...mapActions('game', ['clearAllGameStates']),
        getImageUrl,
        goToRoom(id){
            if (this.userData?.id){
                SocketioService.socket.emit('enterRoom', { userId: this.userData.id, roomId: id }, response => {
                    if (response?.status === 'ok') {
                        this.$router.push({ name: 'room', params: { id: id } })
                    }
                    else this.showToast({ text: response.text || 'Ошибка входа в комнату', type: 'error' })
                })
            }
        }
    },
    computed: {
        ...mapGetters('rooms', ['roomsList']),
        ...mapGetters('user', ['userData']),
        currentPageArray(){
            return this.filteredArray?.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
        },
        filteredArray() {
            return this.roomsList.filter(item => item.name.trim().toLowerCase().includes(this.searchValue.trim().toLowerCase()))
        }
    },
}
</script>

<style scoped lang="sass">
    .holl
        &__header
            width: 100%
            display: flex
            justify-content: flex-end
            margin-bottom: 24px
        &__add-btn
            display: flex
            justify-content: center
            align-items: center
            padding: 12px 30px
        &__add-icon
            margin-left: 12px
            width: 14px
            height: 14px
            fill: #fff
        &__rolles-list
            display: flex
            flex-wrap: wrap
            align-items: center
            margin-bottom: -0.5px
        &__role
            display: flex
            align-items: center
            margin-right: 12px
            & img
                width: 30px
                height: 30px
                margin-right: 5
    .filter
        margin-bottom: 12px
        display: flex
    .filter-wrapper
        width: 300px
    .search-input
        width: 100%
        background: transparent
        border: 1px solid #ffffff88
        padding: 10px 15px
        outline: none
        caret-color: var(--color-primary)
        color: #fff
        border-radius: 5px
        &:focus
            border: 1px solid #fff
        &:hover
            border: 1px solid #fff
</style>