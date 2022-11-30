<template>
  <button class="btn save-btn button" :class="{'pad': isAdd}">
      <SaveIcon v-if="!isAdd" class="button__icon" />
      <PlusIcon v-else class="button__icon add" />
      <span>{{text}}</span>
  </button>
</template>

<script>
import SaveIcon from '@/components/icons/SaveIcon.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'

export default {
    components:{
        SaveIcon, PlusIcon
    },
    props:{
        text:{
            type: String,
            default: 'Сохранить'
        },
        isAdd:{
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped lang="sass">
    .button
        width: 100%
        display: flex
        align-items: center
        justify-content: center
        padding: 5px
        &__icon
            width: 30px
            height: 30px
            margin-right: 12px
            fill: #fff
        &:hover svg
            fill: var(--color-save) !important
        &:active svg
            fill: #fff !important
    .add
        width: 15px
        height: 15px
    .pad
        padding: 10px 0
</style>