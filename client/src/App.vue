<template> 
  <component :is="layout"></component>
  <Toast />
</template>

<script>
import DefaultLayout from '@/layouts/default.vue'
import AuthLayout from '@/layouts/authorized.vue'
import UnAuthLayout from '@/layouts/unauthorized.vue'
import Toast from '@/components/UIKit/Toast.vue'

export default {
 components:{
    DefaultLayout, AuthLayout, UnAuthLayout,
    Toast
 },
  computed: {
    layout () {
      return this.$route.meta.auth === undefined ? 'DefaultLayout' : this.$route.meta.auth ? 'AuthLayout' : 'UnAuthLayout'
    }
  },
} 

</script>

<style>

</style>
