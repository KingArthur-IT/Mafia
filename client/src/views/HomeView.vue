<script setup lang="ts">
import HeadSection from '@/components/HomePage/HeadSection.vue'
import AboutSection from '@/components/HomePage/AboutSection.vue'
import InterfaceSection from '@/components/HomePage/InterfaceSection.vue'
import GameRolesSection from '@/components/HomePage/GameRolesSection.vue'
import CallToAction from '@/components/HomePage/CallToAction.vue'
</script>

<template>
  <div class="container">
    <HeadSection />
    <AboutSection />
    <InterfaceSection />
  </div>
  <GameRolesSection />
  <div class="container">
    <CallToAction />
  </div>
</template>

<style scoped>

</style>
