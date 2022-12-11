<template>
  <div class="toast" v-if="isShown">
      {{text}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed:{
        ...mapGetters({
            isShown: 'toast/isShown',
            text: 'toast/text',
        })
    }
}
</script>

<style scoped lang="sass">
    .toast
        width: fit-content
        max-width: 80%
        padding: 10px 20px
        color: #fff
        background: red
        position: absolute
        bottom: 5%
        left: 50%
        transform: translateX(-50%)
        pointer-events: none

</style>