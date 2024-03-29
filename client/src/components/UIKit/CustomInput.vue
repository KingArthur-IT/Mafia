<template>
    <div class="input-wrap">
        <label v-if="label" class="label">{{ label }}</label>
        <div class="input-wrap d-flex">
            <input 
                :id="id"
                class="input" 
                :class="{'disable': !isEditing && isWithEdit}"
                :type="inputType" 
                v-model="value"
                @input="onInput"
                :readonly="!isEditing && isWithEdit"
            />
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
    props: {
        id: {
            type: String,
            default: ''
        },
        modelValue: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        isValid: {
            type: Boolean,
            default: true
        },
        isWithEdit: {
            type: Boolean,
            default: false
        },
        isAgeValue: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue' , 'saveEvent'],
    data() {
        return {
            value: '',
            isPasswordVisible: false,
            isEditing: false
        }
    },
    computed: {
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
    methods: {
        save(){
            if (!this.isEditing)
                this.$emit('saveEvent')
        },
        onInput(event) {
            this.$emit('update:modelValue', event.target.value)
        }
    },
    watch: {
        modelValue() {
            this.value = this.modelValue
        },
        value() {
            if (this.isAgeValue) {
                this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1')
                if (Number(this.value) > 70) 
                    this.value = this.value.substring(this.value.length, 1)
            }
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
        position: relative
    .input
        width: 100%
        background: transparent
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