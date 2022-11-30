<template>
  <div class="num">
      <label class="num__label" v-if="label">{{label}}</label>
      <button class="btn primary-btn num__btn num__minus" @click="minusEvent">-</button>
      <span>{{modelValue}}</span>
      <button class="btn primary-btn num__btn" @click="plusEvent">+</button>
      <span>(max: {{max}})</span>
  </div>
</template>

<script>
export default {
    props:{
        modelValue: {
            type: Number,
            default: 0
        },
        label: {
            type: String,
            default: ''
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 2
        },
    },
    methods:{
        minusEvent(){
            if (this.modelValue - 1 >= this.min)
                this.$emit('update:modelValue', this.modelValue - 1)
        },
        plusEvent(){
            if (this.modelValue + 1 <= this.max)
                this.$emit('update:modelValue', this.modelValue + 1)
        }
    }
}
</script>

<style scoped lang="sass">
    .num
        display: flex
        align-items: center
        &__label
            margin-right: 12px
            display: block
            min-width: 140px
        &__btn
            width: 30px
            height: 30px
            display: flex
            justify-content: center
            align-items: center
            color: #fff
            background-color: var(--color-primary)
            font-size: 24px
        &__minus
            padding-bottom: 3px
        & span
            font-weight: 700
            margin: 0 12px
            min-width: 12px
            text-align: center
</style>