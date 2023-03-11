<template>
    <section class="section section-screen roles">
        <SheriffIcon class="roles__icon" />
        <h2 class="roles__title">Разнообразие игровых ролей - <br> создай свои стратегии для победы</h2>
        <Carousel 
            ref="cardsCarousel" 
            :wrap-around="true" 
            :breakpoints="breakpoints" 
            class="roles__slider"
            :autoplay="2000"
            :transition="2000"
            :pauseAutoplayOnHover="true"
        >
            <Slide v-for="(slide) in cardsList" :key="slide.id" class="roles__slide">
                <div class="roles__card carousel__item">
                    <img :src="getImageUrl(slide.img)" alt="img" class="roles__img">
                    <div class="roles__name">{{ slide.name }}</div>
                </div>
            </Slide>
        </Carousel>
        <LightPoint :isLeft="true" />
    </section>
</template>

<script lang="ts">
import LightPoint from '@/components/UIKit/Design/LightPoint.vue'
import SheriffIcon from "@/components/icons/SheriffIcon.vue"
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

export default {
    components: {
        Carousel,
        Slide,
        SheriffIcon,
        LightPoint
    },
    setup(){
        const cardsList = [
            {
                id: 0,
                img: 'citizen-m',
                name: 'Горожанин'
            },
            {
                id: 1,
                img: 'barmen-w',
                name: 'Барменша'
            },
            {
                id: 2,
                img: 'doctor-m',
                name: 'Доктор'
            },
            {
                id: 3,
                img: 'reporter-w',
                name: 'Репортерша'
            },
            {
                id: 4,
                img: 'sheriff-m',
                name: 'Шериф'
            },
            {
                id: 5,
                img: 'citizen-w',
                name: 'Горожанка'
            },
            {
                id: 6,
                img: 'bodyguard-m',
                name: 'Телохранитель'
            },
            {
                id: 7,
                img: 'barmen-m',
                name: 'Бармен'
            },
            {
                id: 8,
                img: 'bodyguard-w',
                name: 'Телохранительница'
            },
            {
                id: 9,
                img: 'lover-m',
                name: 'Любовник'
            },
            {
                id: 10,
                img: 'doctor-w',
                name: 'Докторша'
            },
            {
                id: 11,
                img: 'mafia-m',
                name: 'Мафиози'
            },
            {
                id: 12,
                img: 'lover-w',
                name: 'Любовница'
            },
            {
                id: 13,
                img: 'terrorist-m',
                name: 'Террорист'
            }
        ]

        const breakpoints: object = {
            0: {
                itemsToShow: 2,
            },
            650: {
                itemsToShow: 3,
            },
            768: {
                itemsToShow: 4,
            },
            // 1024 and up
            1240: {
                itemsToShow: 5.0,
            },
        }

        const getImageUrl = (imgName: string) => { return new URL(`../../assets/cards/${imgName}.png`, import.meta.url).href }

        return{
            cardsList, getImageUrl, breakpoints
        }
    }
}
</script>

<style scoped lang="sass">
    .roles
        position: relative
        &__title
            text-align: center
            margin-bottom: 30px
        &__slide
            padding: 0 30px
        &__card
            padding: 15px
            backdrop-filter: blur(5px)
            border-radius: 15px
            user-select: none
        &__img
            width: 100%
            border-radius: 10px
        &__name
            font-weight: 600
            padding: 5px
            font-size: 22px
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

@media screen and (max-width: 1024px)
    .roles
        &__icon
            width: 110px

@media screen and (max-width: 600px)
    .roles
        &__icon
            width: 80px
            top: 80px

@media screen and (max-width: 425px)
    .roles
        &__title
            margin-bottom: 0

@media screen and (max-width: 375px)
    .roles
        &__icon
            width: 60px
</style>