<template>
    <div>
        <label v-if="label" class="label">{{label}}</label>
        <input 
            class="input" 
            :type="inputType" 
            :value="modelValue"
            @input="(event) => $emit('update:modelValue', event.target.value)"
        >
        <OpenedEyeIcon v-if="isOpenEyeVisible" class="eye" @click="isPasswordVisible = !isPasswordVisible"/>
        <ClosedEyeIcon v-if="isClosedEyeVisible" class="eye" @click="isPasswordVisible = !isPasswordVisible"/>
    </div>
    <small v-if="!isValid" class="error sm-font">
        <slot></slot>
    </small>
</template>

<script>
import OpenedEyeIcon from '@/components/icons/OpenedEyeIcon.vue'
import ClosedEyeIcon from '@/components/icons/ClosedEyeIcon.vue'

export default {
    components:{
        OpenedEyeIcon, ClosedEyeIcon
    },
    props:{
        modelValue: {
            type: String,
            default: ''
        },
        label:{
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        isValid:{
            type: Boolean,
            default: true
        }
    },
    data(){
        return{
            isPasswordVisible: false
        }
    },
    computed:{
        inputType: function(){
            return this.type === 'password' && this.isPasswordVisible ? 'text' : this.type
        },
        isOpenEyeVisible: function(){
            return this.type === 'password' && !this.isPasswordVisible
        },
        isClosedEyeVisible: function(){
            return this.type === 'password' && this.isPasswordVisible
        },
    }
}
</script>

<style scoped lang="sass">
    .eye
        position: absolute
        height: 30px
        width: 30px
        right: 15px
        bottom: 4px
        cursor: pointer
    .label
        display: block
        color: #fff
        margin-bottom: 5px
    .input
        width: 100%
        background: var(--color-background-soft)
        border: 1px solid #ffffff88
        padding: 10px 15px
        outline: none
        caret-color: var(--color-primary)
        color: #fff
        &:focus
            border: 1px solid #fff
    .error
        color: var(--color-primary)
        margin-top: 5px
</style>