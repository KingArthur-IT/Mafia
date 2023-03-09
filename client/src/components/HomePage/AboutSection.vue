<template>
    <div class="about-wrapper">
        <img src="@/assets/game.jpg" alt="group-of-friends" class="about-wrapper__img">
        <section class="section section-screen about-section" style="overflow: hidden">
            <div class="section-hero about-section__head">
                <div class="about-section__hero">
                    <h2 class="about-section__title">
                        Стратегия, тактика, интриги - все это ждет вас в мафии онлайн!
                    </h2>
                    <div class="about-section__description">THEMafia это:</div>
                    <ul class="about-section__list">
                        <li class="about-section__item">
                             <span>✓</span> Отличный способ провести время и найти друзей;
                        </li>
                        <li class="about-section__item">
                            <span>✓</span> Увлекательная командная игра;
                        </li>
                        <li class="about-section__item">
                            <span>✓</span> Детективный сюжет;
                        </li>
                        <li class="about-section__item">
                            <span>✓</span> Интриги и альянсы;
                        </li>
                        <li class="about-section__item">
                            <span>✓</span> Возможность быть кем-угодно.
                        </li>
                    </ul>
                </div>
                <img src="@/assets/game.jpg" alt="group-of-friends" class="about-section__img">
            </div>
        </section>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="sass">
.about-wrapper
    position: relative
    &::before
        position: absolute
        content: ''
        background: linear-gradient(103.66deg, #176DAE 6.84%, #82E1E2 94.52%)
        filter: blur(232px)
        border-radius: 20px
        transform: rotate(-20deg)
        width: 200px
        height: 200px
        top: 0px
        left: -50px
        pointer-events: none
    &__img
        display: none
        border-radius: 15px
.about-section
    overflow: hidden
    border-radius: 15px
    z-index: 2
    &::after
        content: ""
        position: absolute
        top: -200px
        right: -90%
        bottom: -200px
        left: 0
        background: var(--color-primary)
        transform: rotate(-45deg)
    &__head
        display: flex
        justify-content: center
    &__hero
        margin-right: 60px
        z-index: 1
    &__title
        margin-bottom: 15px
    &__description
        margin-bottom: 5px
    &__list
        padding-left: 12px
    &__item
        & span
            margin-right: 4px
    &__img
        width: 40%
        height: 40%
        z-index: 2
        border-radius: 15px
    &__icon
        position: absolute
        top: 0
        right: 0

@media screen and (max-width: 1024px)
    .about-section
        &::after
            right: -120%
        &__head
            padding: 40px
        &__hero
            margin-right: 30px

@media screen and (max-width: 768px)
    .about-wrapper
        &__img
            display: block
            width: 100%
            transform: translateY(30px)
    .about-section
        &::after
            top: -20px
            bottom: 0
        &__img
            display: none

@media screen and (max-width: 600px)
    .about-section
        &::after
            top: 0px

@media screen and (max-width: 475px)
    .about-section
        &::after
            top: 20vw
        &__head
            padding: 20px

@media screen and (max-width: 375px)
    .about-section
        &__head
            padding: 15px
</style>