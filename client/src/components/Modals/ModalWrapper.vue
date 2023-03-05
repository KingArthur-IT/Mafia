<template>
    <div class="modal" :class="{'show': isDisplay, 'visible': isVisible}">
        <div class="modal__wrapper">
            <div class="modal__hero">
                <div class="modal__header">
                    <h2 class="modal__title">{{title}}</h2>
                    <CloseIcon class="modal__close" @click="closeModal"/>
                </div>
                <div class="modal__content">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CloseIcon from '@/components/icons/CloseIcon.vue'

export default {
    components:{
        CloseIcon,
    },
    props:{
        title:{
            type: String,
            required: true
        },
        modelValue: {
            type: Boolean,
            default: false
        },
    },
    data(){
        return{
            isVisible: false,
            isDisplay: false
        }
    },
    mounted(){
        this.isDisplay = this.modelValue;
        this.isVisible = this.modelValue;
    },
    watch:{
        modelValue: function(){
            if (this.modelValue){
                document.querySelector('body').classList.add('overflow-hidden');
                this.isDisplay = this.modelValue;
                setTimeout(() => {
                    this.isVisible = this.modelValue;
                }, 100);
            }
            else {
                document.querySelector('body').classList.remove('overflow-hidden');
                this.isVisible = this.modelValue;
                setTimeout(() => {
                    this.isDisplay = this.modelValue;
                }, 100);
            }
        }
    },
    methods:{
        closeModal(){
            document.querySelector('body').classList.remove('overflow-hidden');
            this.$emit('update:modelValue', false);
        }
    }
}
</script>

<style scoped lang="sass">
.modal
    position: fixed
    width: 100%
    min-height: 100vh
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: #100923e8
    transition: opacity .2s ease-in-out
    display: none
    opacity: 0
    overflow-y: auto
    justify-content: center
    align-items: center
    z-index: 100
    &__wrapper
        padding: 30px
        max-width: 600px
        min-width: 300px
    &__hero
        border: 1px solid #fff
    &__header
        width: 100%
        min-height: 40px
        background: transparent
        padding: 10px 15px
    &__title
        font-style: normal
        font-weight: 700
        line-height: 116%
        color: #FFFFFF
        font-size: var(--text-size)
    &__close
        position: absolute
        top: 13px
        right: 15px
    &__content
        padding: 10px 15px
.visible
    opacity: 1
.show
    display: flex

</style>