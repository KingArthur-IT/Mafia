<template>
    <div class="card">
        <div class="card__hero">
            <img :src="getImageUrl('room-cards', getCardName(role, gender) )" :alt="role">
        </div>
        <p class="sm-font card__nick">{{nickname}}</p>
    </div>
</template>

<script>
import { getImageUrl } from '@/use/imgLinks.js'

export default {
    props:{
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
        }
    },
    methods:{
        getImageUrl,
        getCardName(role, gender){
            const prefix = gender === 'male' ? '-m' : '-w';
            return role !== 'unknown' ? role + prefix : role
        }
    }
}
</script>

<style scoped lang="sass">
    .card
        flex-basis: 50%
        width: 80px
        height: 80px
        padding: 5px
        margin-bottom: 20px
        &__hero
            border: 1px solid #fff
            border-radius: 5px
            height: 100%
            & img
                width: 100%
                height: 100%
        &__nick
            text-align: center
</style>