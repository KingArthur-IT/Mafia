<template>
  <button class="btn save-btn button">
      <SaveIcon class="button__icon" />
      <span>{{text}}</span>
  </button>
</template>

<script>
import SaveIcon from '@/components/icons/SaveIcon.vue'

export default {
    components:{
        SaveIcon
    },
    props:{
        text:{
            type: String,
            default: 'Сохранить'
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
            fill: var(--color-save)
        &:active svg
            fill: #fff
</style>