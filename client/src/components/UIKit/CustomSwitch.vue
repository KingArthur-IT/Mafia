<template>
    <label class="switch">
        <input  type="checkbox"
                :class="`${colorScheme}`"
                :checked="modelValue"
                :value="modelValue"
                @input="inputEvent"
        >
        <span class="slider round"></span>
    </label>
</template>

<script>
export default {
  emits: ['update:modelValue', 'saveEvent'],
  props: {
    modelValue: {
        type: Boolean,
        default: false
    },
    colorScheme: {
      type: String,
      default: 'primary'
    }
  },
  methods: {
    inputEvent() {
      this.$emit('update:modelValue', !this.modelValue)
      this.$emit('saveEvent')
    }
  }
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-background);
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 0px;
  bottom: 0px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked.primary + .slider {
  background-color: var(--color-primary);
}
input:checked.edit + .slider {
  background-color: var(--color-edit);
}
input:checked.save + .slider {
  background-color: var(--color-save);
}

input:focus + .slider {
  box-shadow: 0 0 1px #fff;
}

input:checked + .slider:before {
  -webkit-transform: translateX(24px);
  -ms-transform: translateX(24px);
  transform: translateX(24px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>