<template>
    <section class="section section-screen interface">
        <div class="interface__hero">
            <h2 class="interface__title">
                MafiaWorld - специально создан для игры в мафию!
            </h2>
            <ul class="interface__list">
                <li class="interface__item">
                    <h3>Интуитивно понятный интерфейс</h3>
                    <p>
                        Интерфейс проработан для максимального удобства игроков любых возрастов.
                    </p>
                </li>
                <li class="interface__item">
                    <h3>Регулярные обновления функционала</h3>
                    <p>
                        Мы постоянно внедряем новые функции и улучшаем качество игры
                    </p>
                </li>
                <li class="interface__item">
                    <h3>Рейтинги и статистика игроков</h3>
                    <p>
                        Мы сохраняем статистику ваших игр и все ваши достижения учитываются для общего рейтинга 
                    </p>
                </li>
                <li class="interface__item">
                    <h3>Создание приватных комнат для друзей</h3>
                    <p>
                        Пригласите своих друзей на закрытую игру
                    </p>
                </li>
                <li class="interface__item">
                    <h3>Режим зрителя</h3>
                    <p>
                        После покидания игры, пользователь может остаться в игре в качестве зрителя и наблюдать за дальнейшим развитием
                    </p>
                </li>
                <li class="interface__item">
                    <h3>Выбор возможных игровых ролей</h3>
                    <p>
                        Вы можете создать игровую комнату и добавить возможные игровые роли
                    </p>
                </li>
            </ul>
        </div>
        <GunIcon class="interface__icon"/>
    </section>
</template>

<script>
import GunIcon from "@/components/icons/GunIcon.vue"

export default {
    components:{
        GunIcon
    }
}
</script>

<style scoped lang="sass">
.interface
    position: relative
    &::before
        position: absolute
        content: ''
        background: linear-gradient(103.66deg, #176DAE 6.84%, #82E1E2 94.52%)
        filter: blur(232px)
        border-radius: 20px
        transform: rotate(-20deg)
        width: 350px
        height: 350px
        top: -100px
        right: -100px
    &__title
        margin-bottom: 30px
        text-align: center
    &__list
        width: calc( 100% + 30px)
        transform: translateX(-15px)
        display: flex
        flex-wrap: wrap
    &__item
        flex-basis: calc(33% - 30px)
        padding: 30px
        background-color: var(--color-background-soft)
        margin: 0 15px 30px
        border-radius: 15px
        & h3
            margin-bottom: 25px
    &__icon
        position: absolute
        bottom: -120px
        right: 0
        width: 200px

@media screen and (max-width: 1024px)
    .interface
        &__list
            width: calc( 100% + 10px)
            transform: translateX(-5px)
        &__item
            flex-basis: calc(33% - 10px)
            padding: 30px
            margin: 0 5px 10px
        &__icon
            width: 150px

@media screen and (max-width: 768px)
    .interface
        &__item
            flex-basis: calc(50% - 10px)
            padding: 20px

@media screen and (max-width: 600px)
    .interface
        &::before
            filter: blur(100px)
            width: 150px
            height: 150px
            top: -50px
            right: -50px
        &__icon
            width: 100px
            bottom: -70px

@media screen and (max-width: 425px)
    .interface
        &__list
            width: 100%
            transform: translateX(0px)
        &__item
            flex-basis: 100%


@media screen and (max-width: 375px)
    .interface
        &__icon
            width: 75px
            bottom: -40px
</style>