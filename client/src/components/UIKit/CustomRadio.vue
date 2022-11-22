<template>
    <div class="radio-group">
        <div v-for="item in radioList" :key="item.id"  class="radio-item">
            <input  type="radio" 
                    :id="item.id" 
                    :value="item.value" 
                    name="radio-male-group"
                    v-model="modelValue"
                    @input="(event) => $emit('update:modelValue', item.value)"
            >
            <label :for="item.id" class="label">{{item.value == '1' ? 'Мужской' : 'Женский'}}</label>
        </div>
    </div>
</template>

<script>
export default {
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: String,
            default: '1'
        },
    },
    setup(){
        const radioList = [
            { id: 'male', value: 1 },
            { id: 'femail', value: 2 },
        ]


        return {
            radioList
        }
    }
}
</script>

<style scoped>
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