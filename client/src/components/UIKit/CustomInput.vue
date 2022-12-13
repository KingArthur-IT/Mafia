<template>
    <div class="input-wrap">
        <label v-if="label" class="label">{{label}}</label>
        <div class="input-wrap d-flex">
            <input 
                class="input" 
                :class="{'disable': !isEditing && isWithEdit}"
                :type="inputType" 
                :value="modelValue"
                @input="(event) => $emit('update:modelValue', event.target.value)"
                :readonly="!isEditing && isWithEdit"
            >
            <SaveEditButton v-if="isWithEdit" v-model="isEditing" @click="save" class="edit-btn" />
            <OpenedEyeIcon v-if="isOpenEyeVisible" class="eye" @click="isPasswordVisible = !isPasswordVisible"/>
            <ClosedEyeIcon v-if="isClosedEyeVisible" class="eye" @click="isPasswordVisible = !isPasswordVisible"/>
        </div>
    </div>
    <small v-if="!isValid" class="error sm-font">
        <slot></slot>
    </small>
</template>

<script>
import OpenedEyeIcon from '@/components/icons/OpenedEyeIcon.vue'
import ClosedEyeIcon from '@/components/icons/ClosedEyeIcon.vue'
import SaveEditButton from '@/components/UIKit/SaveEditButton.vue'

export default {
    components:{
        OpenedEyeIcon, ClosedEyeIcon, SaveEditButton
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
        },
        isWithEdit:{
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue' , 'saveEvent'],
    data(){
        return{
            isPasswordVisible: false,
            isEditing: false
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
    },
    methods:{
        save(){
            if (!this.isEditing)
                this.$emit('saveEvent')
        }
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
    .input-wrap
        width: 100%
    .input
        width: 100%
        background: var(--color-background-soft)
        border: 1px solid #ffffff88
        padding: 10px 15px
        outline: none
        caret-color: var(--color-primary)
        color: #fff
        border-radius: 5px
        &:focus
            border: 1px solid #fff
        &:hover
            border: 1px solid #fff
    .error
        color: var(--color-primary)
        margin-top: 5px
    .disable
        user-select: none
        pointer-events: none
        color: #595c67
    .edit-btn
        position: absolute
        right: 0
</style>