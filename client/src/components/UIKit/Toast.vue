<template>
  <div class="toast" :type="type" :class="{'display': display, 'visible' : visible}">
      {{text}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data(){
        return{
            display: false,
            visible: false
        }
    },
    computed:{
        ...mapGetters({
            isShown: 'toast/isShown',
            text: 'toast/text',
            type: 'toast/type',
        })
    },
    watch:{
        isShown: function(){
            if (this.isShown){
                this.display = true;
                setTimeout(() => {
                    this.visible = true;
                }, 300);
            } else {
                this.visible = false;
                setTimeout(() => {
                    this.display = false;
                }, 1000);
            }
        }
    }
}
</script>

<style scoped lang="sass">
    .toast
        width: fit-content
        max-width: 80%
        padding: 10px 20px
        color: #fff
        background: #757B8C
        position: absolute
        bottom: 5%
        left: 50%
        transform: translateX(-50%)
        pointer-events: none
        display: none
        opacity: 0
        transition: opacity .6s ease
        border-radius: 5px
        &[type="info"]
            background: var(--color-info)
        &[type="error"]
            background: var(--color-error)
        &[type="warning"]
            background: var(--color-warning)
        &[type="ok"]
            background: var(--color-save)
    .display
        display: block
    .visible
        opacity: 1

</style>