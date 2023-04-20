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
            <div v-if="votesCount > 0" class="card__votes" :class="{'backdrop': gameActionSended}">
                <div class="card__votes-hero">
                    {{ votesCount }}
                </div>
            </div>
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
        },
        votesCount: {
            type: Number, 
            default: 0
        },
        gameActionSended: {
            type: Boolean,
            default: false
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
        &__votes
            position: absolute
            top: 0
            bottom: 0
            left: 0
            right: 0
            border-radius: 5px
            pointer-events: none
            &.backdrop
                backdrop-filter: blur(2px)
            &-hero
                position: absolute
                top: 50%
                left: 50%
                transform: translate(-55%, -55%)
                width: 20px
                height: 20px
                border-radius: 50%
                background: var(--color-primary)
                display: flex
                justify-content: center
                align-items: center
                font-size: 14px
                font-weight: 600
                &::before
                    content: ''
                    position: absolute
                    top: 50%
                    left: 50%
                    transform: translate(-55%, -52%)
                    width: 1px
                    height: 30px
                    background: var(--color-primary)
                    z-index: -1
                &::after
                    content: ''
                    position: absolute
                    top: 50%
                    left: 50%
                    transform: translate(-51%, -55%)
                    height: 1px
                    width: 30px
                    background: var(--color-primary)
                    z-index: -1

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

@media screen and (max-width: 1024px)
    .card
        width: 70px
        max-width: 70px
        min-width: 70px
        height: 70px

@media screen and (max-width: 600px)
    .card
        width: 60px
        max-width: 60px
        min-width: 60px
        height: 60px

@media screen and (max-width: 540px)
    .card
        width: 50px
        max-width: 50px
        min-width: 50px
        height: 50px
</style>