<template>
    <div class="holl">
        <div class="holl__header">
            <button class="btn secondary-btn holl__add-btn" @click="$router.push({name: 'profile.create'})">
                Добавить комнату
                <PlusIcon class="holl__add-icon" />
            </button>
        </div>
        <table class="table table-no-spacing">
            <tr class="table__row">
                <th width="30%">Название комнаты</th>
                <th width="15%">Количество игроков</th>
                <th width="20%">Мин/Макс игроков</th>
                <th width="35%">Дополнительные роли</th>
            </tr>
            <tr v-for="room in currentPageArray" :key="room.id">
                <td>{{room.name}}</td>
                <td>{{room.currentPersons}}</td>
                <td>{{room.minPersons}} / {{room.maxPersons}}</td>
                <td class="holl__rolles-list">
                    <div class="holl__role" v-for="(role, i) in room.roles" :key="i">
                        <img :src="getImageUrl('short-cards', role.role ,'png')" :alt="role.role"><span>x{{role.count}}</span>
                    </div>
                </td>
            </tr>
        </table>
        <Pagination v-if="roomsList?.length > perPage"
            v-model="currentPage"
            :arrayLength="roomsList.length"
            :perPage="perPage"
        />
    </div>
</template>

<script>
import PlusIcon from '@/components/icons/PlusIcon.vue'
import { getImageUrl } from '@/use/imgLinks.js'
import Pagination from '@/components/UIKit/Pagination.vue'

export default {
    components:{
        PlusIcon,
        Pagination
    },
    data(){
        return{
            currentPage: 1,
            perPage: 5,
            roomsList: [
                {
                    id: 0,
                    name: 'Крутая комната',
                    maxPersons: 10,
                    minPersons: 8,
                    currentPersons: 10,
                    roles: [
                        {role: 'lover', count: 1},
                        {role: 'reporter', count: 1},
                        {role: 'barmen', count: 1},
                        {role: 'doctor', count: 1},
                        {role: 'bodyguard', count: 1},
                        {role: 'terrorist', count: 1}
                    ]
                },
                {
                    id: 1,
                    name: 'Крутая комната 2',
                    maxPersons: 16,
                    minPersons: 8,
                    currentPersons: 10,
                    roles: []
                },
                {
                    id: 2,
                    name: 'Крутая комната 3',
                    maxPersons: 12,
                    minPersons: 6,
                    currentPersons: 6,
                    roles: [
                        {role: 'lover', count: 1}
                    ]
                },
                {
                    id: 3,
                    name: 'Крутая комната 4',
                    maxPersons: 10,
                    minPersons: 8,
                    currentPersons: 10,
                    roles: [
                        {role: 'lover', count: 1},
                        {role: 'reporter', count: 1},
                        {role: 'barmen', count: 1},
                        {role: 'doctor', count: 1},
                        {role: 'bodyguard', count: 1},
                        {role: 'terrorist', count: 1}
                    ]
                },
                {
                    id: 4,
                    name: 'Крутая комната 4',
                    maxPersons: 10,
                    minPersons: 8,
                    currentPersons: 10,
                    roles: [
                        {role: 'lover', count: 1},
                        {role: 'reporter', count: 1},
                        {role: 'barmen', count: 1},
                        {role: 'doctor', count: 1},
                        {role: 'bodyguard', count: 1},
                        {role: 'terrorist', count: 1}
                    ]
                },
                {
                    id: 5,
                    name: 'Крутая комната 4',
                    maxPersons: 10,
                    minPersons: 8,
                    currentPersons: 10,
                    roles: [
                        {role: 'lover', count: 1},
                        {role: 'reporter', count: 1},
                        {role: 'barmen', count: 1},
                        {role: 'doctor', count: 1},
                        {role: 'bodyguard', count: 1},
                        {role: 'terrorist', count: 1}
                    ]
                }
            ]
        }
    },
    methods:{
        getImageUrl
    },
    computed:{
        currentPageArray(){
            return this.roomsList.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
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
</style>