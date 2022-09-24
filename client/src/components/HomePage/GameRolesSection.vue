<template>
    <section class="section section-screen roles">
        <SheriffIcon class="roles__icon" />
        <h2 class="roles__title">Разнообразие игровых ролей</h2>
        <Carousel 
            ref="cardsCarousel" 
            :wrap-around="true" 
            :breakpoints="breakpoints" 
            class="roles__slider"
            :autoplay="2000"
        >
            <Slide v-for="(slide, i) in cardsList" :key="i" class="roles__slide">
                <img :src="getImageUrl(slide)" alt="img" class="roles__img carousel__item">
            </Slide>
        </Carousel>
    </section>
</template>

<script lang="ts">
import SheriffIcon from "@/components/icons/SheriffIcon.vue"
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

export default {
    components: {
        Carousel,
        Slide,
        SheriffIcon
    },
    setup(){
        const cardsList : string[] = [
            'citizen-m',
            'barmen-w',
            'doctor-m',
            'reporter-w',
            'sheriff-m',
            'citizen-w',
            'bodyguard-m',
            'barmen',
            'bodyguard-w',
            'lover-m',
            'doctor-w',
            'mafia',
            'lover-w',
            'reporter-m',
            'terrorist'
        ]

        const breakpoints: object = {
                // 320:{
                //     itemsToShow: 1.15,
                // },
                // 425: {
                //     itemsToShow: 1.2,
                // },
                // 600: {
                //     itemsToShow: 1.5,
                // },
                // 860: {
                //     itemsToShow: 1.8,
                // },
                // 1024 and up
                1240: {
                    itemsToShow: 5.0,
                },
            }

        const getImageUrl = (imgName: string) => { return new URL(`../../assets/cards/${imgName}.jpg`, import.meta.url).href }

        return{
            cardsList, getImageUrl, breakpoints
        }
    }
}
</script>

<style scoped lang="sass">
    .roles
        &__title
            text-align: center
            margin-bottom: 30px
        &__slide
            padding: 0 30px
        &__img
            width: 100%
            border-radius: 10px
        &__icon
            position: absolute
            top: -50px
            left: 0
            width: 200px
            transform: rotate(5deg)

    .carousel__slide > .carousel__item
        transform: scale(1)
        opacity: 0.5
        transition: 0.5s
    .carousel__slide--visible > .carousel__item 
        opacity: 1
        transform: rotateY(0)
    .carousel__slide--next > .carousel__item 
        transform: scale(0.95) translate(-10px)
    .carousel__slide--prev > .carousel__item 
        transform: scale(0.95) translate(10px)
    .carousel__slide--active > .carousel__item 
        transform: scale(1.0)
</style>