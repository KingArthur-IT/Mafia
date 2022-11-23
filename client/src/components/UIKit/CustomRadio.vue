<template>
    <div class="wrapper">
        <div class="radio-group">
            <div v-for="item in radioList" :key="item.id"  class="radio-item">
                <input  type="radio" 
                        :class="{'disable': !isEditing && isWithEdit}"
                        :id="item.id" 
                        :value="item.value" 
                        name="radio-male-group"
                        v-model="modelValue"
                        :disabled="!isEditing && isWithEdit"
                        @input="(event) => $emit('update:modelValue', item.value)"
                >
                <label :for="item.id" class="label">{{item.value == 'male' ? 'Мужской' : 'Женский'}}</label>
            </div>
        </div>
        <SaveEditButton v-if="isWithEdit" v-model="isEditing" />
    </div>
</template>

<script>
import SaveEditButton from '@/components/UIKit/SaveEditButton.vue'
import { ref } from '@vue/reactivity'

export default {
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: String,
            default: 'male'
        },
        isWithEdit:{
            type: Boolean,
            default: false
        }
    },
    components:{
        SaveEditButton
    },
    setup(){
        const radioList = [
            { id: 'male', value: 'male' },
            { id: 'femail', value: 'female' },
        ]

        const isEditing = ref(false)

        return {
            radioList, isEditing
        }
    }
}
</script>

<style scoped>
.wrapper{
    display: flex;
    align-items: center;
}
.radio-group{
    display: flex;
}
.radio-item{
    margin-right: 34px;
}
[type="radio"]:checked,
[type="radio"]:not(:checked) {
    position: absolute;
    left: -9999px;
}
[type="radio"]:checked + label,
[type="radio"]:not(:checked) + label
{
    position: relative;
    padding-left: 28px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    line-height: 120%;
    color: #fff;
}
[type="radio"]:checked.disable + label,
[type="radio"]:not(:checked).disable + label{
    cursor: default;
}
[type="radio"]:not(:checked) + label:before {
    content: '';
    position: absolute;
    left: 0;
    top: 1px;
    width: 15px;
    height: 15px;
    border: 1px solid #fff;
    border-radius: 50%;
    background: transparent;
}
[type="radio"]:not(:checked).disable + label:before {
    border: 1px solid #4c4c4c;
}
[type="radio"]:checked + label:before {
    content: '';
    position: absolute;
    left: 0;
    top: 1px;
    width: 15px;
    height: 15px;
    border: 1px solid var(--color-primary);
    border-radius: 50%;
    background: transparent;
}
[type="radio"]:checked + label:after,
[type="radio"]:not(:checked) + label:after {
    content: '';
    width: 7px;
    height: 7px;
    background: var(--color-primary);
    position: absolute;
    top: 5px;
    left: 4px;
    border-radius: 100%;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
}
[type="radio"]:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
}
[type="radio"]:checked + label:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
}
.label{
    color: #fff
}
</style>