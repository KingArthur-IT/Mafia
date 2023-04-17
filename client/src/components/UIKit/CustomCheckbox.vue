<template>
  <div class="wrapper" @click="changeEvent(modelValue)">
    <input  type="checkbox"
            class="custom-checkbox"  
            :class="{'checked': modelValue, 'error': isError && !modelValue}"
            :value="modelValue"
            @input="(event) => $emit('update:modelValue', event.target.checked)"
    >
    <slot></slot>
  </div>
</template>

<script>
export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    isError: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {emit}){
    const changeEvent = (oldValue) => {
      emit('update:modelValue', !oldValue)
    }

    return {
      changeEvent
    }
  }
}
</script>

<style scoped>
.wrapper{
  display: flex;
  cursor: pointer;
  align-items: center;
}
.custom-checkbox {
  position: relative;
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: var(--color-primary);
  width: 20px;
  height: 20px;
  border: 1px solid var(--color-primary);
  background-color: transparent;
  cursor: pointer;
  border-radius: 3px;
}
.custom-checkbox.error {
  border: 1px solid #ff0000;
}
.custom-checkbox.checked::after{
  content: '';
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  right: 3px;
  border-radius: 1px;
  background-color: var(--color-primary);
}
</style>

