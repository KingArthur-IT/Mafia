<template>
  <button 
    class="btn button" 
    :class="{'save': modelValue}"
    @click="(event) => $emit('update:modelValue', !modelValue)"
  >
      <EditIcon v-if="!modelValue" />
      <SaveIcon v-else />
  </button>
</template>

<script>
import EditIcon from '@/components/icons/EditIcon.vue'
import SaveIcon from '@/components/icons/SaveIcon.vue'

export default {
    components:{
        EditIcon,
        SaveIcon
    },
    props:{
        modelValue: {
            type: Boolean,
            default: true
        },
    }
}
</script>

<style scoped lang="sass">
    .button
        width: 35px
        height: 39px
        padding: 0px 7px 2px
        background-color: transparent
        display: flex
        justify-content: center
        align-items: center
        // border: 1px solid rgba(255, 255, 255, 0.5333333333)
        margin-left: 6px
        border-radius: 5px
        transition: background-color .2s ease
        & svg
            fill: rgba(255, 255, 255, 0.5333333333)
            transition: all .2s ease
        &:hover
            background-color: var(--color-edit)
            & svg
                fill: #fff
    .save
        background-color: var(--color-save)
        &:hover
            background-color: var(--color-save)
        & svg
            fill: #fff
</style>