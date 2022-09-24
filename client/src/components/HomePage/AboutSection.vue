<template>
    <section class="section section-screen about-section">
        <div class="section-hero about-section__head">
            <div class="about-section__hero">
                <h2 class="about-section__title">Мафия — отличный способ провести время и найти друзей</h2>
                <div class="about-section__description">Мафия это:</div>
                <ul class="about-section__list">
                    <li class="about-section__item">
                         <span>✓</span> Увлекательная командная игра;
                    </li>
                    <li class="about-section__item">
                        <span>✓</span> Общение и новые знакомства;
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
            <img src="@/assets/group-of-friends.jpg" alt="group-of-friends" class="about-section__img">
        </div>
    </section>
</template>

<script>
export default {

}
</script>

<style scoped lang="sass">
.about-section
    overflow: hidden
    border-radius: 15px
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
        margin-right: 15px
    &__title
        margin-bottom: 15px
    &__description
        margin-bottom: 15px
    &__list
        padding-left: 12px
    &__item
        & span
            margin-right: 4px
    &__img
        width: 40%
        z-index: 2
    &__icon
        position: absolute
        top: 0
        right: 0
</style>