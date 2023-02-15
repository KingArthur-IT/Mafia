<template>
    <div class="card" :class="{'no-nick': !showNick}">
        <div class="card__hero">
            <img :src="getImageUrl('room-cards', getCardName(role, gender) )" :alt="role">
            <img src="@/assets/target.png" class="target" :class="{'active': targetName === 'kill' && isAlive}">
            <img src="@/assets/search.png" class="target" :class="{'active': targetName === 'sheriff' && isAlive}">
            <img src="@/assets/camera.png" class="target" :class="{'active': targetName === 'reporter' && isAlive}">
            <img src="@/assets/tablet.png" class="target" :class="{'active': targetName === 'doctor' && isAlive}">
            <img src="@/assets/heart.png" class="target" :class="{'active': targetName === 'lover' && isAlive}">
            <img src="@/assets/barmen.png" class="target" :class="{'active': targetName === 'barmen' && isAlive}">
            <img src="@/assets/grenade.png" class="target" :class="{'active': targetName === 'terrorist' && isAlive}">
            <img src="@/assets/shield.png" class="target" :class="{'active': targetName === 'bodyguard' && isAlive}">
            <img v-if="!isAlive" src="@/assets/blood.png" class="blood">
        </div>
        <p v-if="showNick" class="card__nick">{{ nickname }}</p>
    </div>
</template>

<script>
import { getImageUrl } from '@/use/imgLinks.js'

export default {
    props: {
        nickname: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        gender:{
            type: String,
            required: true
        },
        showNick: {
            type: Boolean,
            default: true
        },
        targetName: {
            type: String,
            default: ''
        },
        isAlive: {
            type: Boolean,
            default: true
        }
    },
    methods:{
        getImageUrl,
        getCardName(role, gender){
            if (role === 'unknown') return role
            const prefix = gender === 'male' ? '-m' : '-w';
            return role + prefix
        }
    }
}
</script>

<style scoped lang="sass">
    .card
        flex-basis: 50%
        width: 80px
        max-width: 80px
        min-width: 80px
        height: 80px
        padding: 5px
        margin-bottom: 20px
        &.no-nick
            margin-bottom: 0
        &__hero
            position: relative
            border: 1px solid #fff
            border-radius: 5px
            height: 100%
            width: 100%
            overflow: hidden
            & img
                width: 100%
                height: 100%
        &__nick
            text-align: center
            word-break: break-all
            font-size: 12px
    .target
        position: absolute
        top: 0
        bottom: 0
        left: 0
        right: 0
        backdrop-filter: blur(7px)
        border-radius: 5px
        pointer-events: none
        opacity: 0
        transition: all .3s ease
        &.active
          opacity: 1
          pointer-events: all
          cursor: pointer  
        //   transition: none
        //   animation: pulsing 1s infinite ease alternate
    .blood
        position: absolute
        top: 0
        bottom: 0
        left: 0
        right: 0
        border-radius: 5px
        pointer-events: none

    // @keyframes pulsing
    //     0%
    //         transform: scale(1.1)
    //     100%
    //         transform: scale(1.03)
</style>