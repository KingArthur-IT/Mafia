<template>
  <main>
    <MainHeader />
    <RouterView />
    <MainFooter />
  </main>
</template>

<script>
import MainHeader from '@/components/MainHeader.vue'
import MainFooter from '@/components/MainFooter.vue'
// import { RouterView } from 'vue-router'

export default {
    components:{
        MainHeader, 
        MainFooter
    }
}
</script>

<style>

</style>