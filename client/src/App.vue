<template> 
  <component :is="layout"></component>
</template>

<script>
import DefaultLayout from '@/layouts/default.vue'
import AuthLayout from '@/layouts/authorized.vue'
import UnAuthLayout from '@/layouts/unauthorized.vue'

export default {
 components:{
    DefaultLayout, AuthLayout, UnAuthLayout
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
