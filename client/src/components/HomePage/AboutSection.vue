<template>
    <div class="about-wrapper">
        <img src="@/assets/game.jpg" alt="group-of-friends" class="about-wrapper__img">
        <section class="section section-screen about-section" style="overflow: hidden; position: relative;">
            <div class="section-hero about-section__head">
                <div class="about-section__hero">
                    <h2 class="about-section__title">
                        <strong>THEMafia</strong> это:
                    </h2>
                    <!-- <div class="about-section__description"><strong>THEMafia</strong> это:</div> -->
                    <ul class="about-section__list">
                        <li class="about-section__item">
                             <span>✓</span> Отличный способ провести время в компании людей со всего мира;
                        </li>
                        <li class="about-section__item">
                            <span>✓</span> Увлекательная командная игра - находи союзников и побеждай противников;
                        </li>
                        <li class="about-section__item">
                            <span>✓</span> Захватывающий детективный сюжет, полный неожиданных поворотов;
                        </li>
                        <li class="about-section__item">
                            <span>✓</span> Возможность строить альянсы и замышлять интриги;
                        </li>
                        <li class="about-section__item">
                            <span>✓</span> Возможность быть кем угодно и раскрыться в роли выбранного персонажа;
                        </li>
                        <li class="about-section__item">
                            <span>✓</span> Возможность играть в любое время и в любом месте - все, что нужно это доступ к интернету и желание побеждать.
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
    &__img
        display: none
        border-radius: 15px
.about-section
    position: relative
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
        margin-bottom: 5px
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