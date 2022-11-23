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
        padding: 5px
        background-color: var(--color-edit)
        display: flex
        justify-content: center
        align-items: center
        border: 1px solid rgba(255, 255, 255, 0.5333333333)
        margin-left: 6px
        border-radius: 5px
        & svg
            fill: #fff
    .save
        background-color: var(--color-save)
</style>