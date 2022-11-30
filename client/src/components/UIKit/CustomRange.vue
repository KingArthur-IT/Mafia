<template>
    <div class="range">
        <div class="range__wrap">
            <input 
                class="range__input" 
                type="range" 
                :min="min" 
                :max="max" 
                step="1" 
                :value="modelValue"
                @input="onInput"
            >
            <div class="range__track">
                <div class="range__track-inner" :style="`width: ${rangePersent}%`"></div>
            </div>
            <div class="range__thumb" :data-value="modelValue" :style="`left: ${rangePersent}%; translate(-${rangePersent}%, -50%)`"></div>
        </div>
        <div class="range__labels">
            <div class="range__label">{{min}}</div>
            <div class="range__label">{{max}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        modelValue:{
            type: Number,
            default: 6
        },
        min: {
            type: Number,
            default: 6
        },
        max: {
            type: Number,
            default: 21
        },
    },
    methods:{
        onInput(e){
            this.$emit('update:modelValue', Number(e.target.value))
        }
    },
    computed:{
        rangePersent(){
            return 100.0 * (this.modelValue - this.min) / (this.max - this.min)
        }
    }
}
</script>

<style scoped lang="sass">
.range
    padding: 24px 0 24px
    &__wrap
        position: relative
    &__input
        width: 100%
        cursor: pointer
        opacity: 0
        &::-ms-tooltip
            display: none
    &__track
        width: 100%
        height: 2px
        background: #fff
        position: absolute
        top: 50%
        transform: translateY(-50%)
        pointer-events: none
    &__track-inner
        width: 0
        height: 8px
        transform: translateY(-3px)
        background: var(--color-primary)
        box-shadow: 0px 1px 14px rgba(241, 82, 32, 0.82), inset 0px 0px 31px var(--color-primary)
    &__thumb
        width: 22px
        height: 22px
        background: var(--color-primary)
        border-radius: 50%
        position: absolute
        top: 50%
        left: 0
        transform: translate(-50%, -50%)
        pointer-events: none
        box-shadow: 0px 1px 14px rgba(241, 82, 32, 0.82), inset 0px 0px 31px var(--color-primary)
        &::after
            content: attr(data-value)
            display: flex
            justify-content: center
            align-items: center
            position: absolute
            bottom: 30px
            left: 0px
            width: 20px
            height: 20px
            z-index: 10
            font-weight: 600
            font-size: 18px
            color: #FFFFFF
            text-align: center
    &__labels
        display: flex
        justify-content: space-between
        align-items: center
        
</style>