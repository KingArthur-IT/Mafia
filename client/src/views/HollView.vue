<template>
    <div class="holl">
        <div class="holl__header">
            <button class="btn secondary-btn holl__add-btn">
                Добавить комнату
                <PlusIcon class="holl__add-icon" />
            </button>
        </div>
        <table class="table table-no-spacing">
            <tr class="table__row">
                <th width="50%">Название комнаты</th>
                <th width="25%">Количество игроков</th>
                <th width="25%">Доступные роли</th>
            </tr>
            <tr>
                <td>Крутая комната</td>
                <td>5/10</td>
                <td></td>
            </tr>
            <tr>
                <td>Крутая комната</td>
                <td>5/10</td>
                <td></td>
            </tr>
        </table>
    </div>
</template>

<script>
import PlusIcon from '@/components/icons/PlusIcon.vue'

export default {
    components:{
        PlusIcon
    }
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
</style>