<template>
  <div class="profile">
      <div class="sidebar-wrap">
          <ProfileSidebar />
      </div>
      <div class="profile__main">
          <div class="profile__head">
              <HeadPanel />
          </div>
          <ProfileHero />
      </div>
  </div>
</template>

<script>
import ProfileSidebar from '@/components/Profile/ProfileSidebar.vue'
import HeadPanel from '@/components/Profile/HeadPanel.vue'
import ProfileHero from '@/components/Profile/ProfileHero.vue'

export default {
    components:{
        ProfileSidebar,
        HeadPanel,
        ProfileHero
    }
}
</script>

<style scoped lang="sass">
    .profile
        display: flex
        justify-content: space-between
        align-items: stretch
        background-color: var(--color-background)
        min-height: 100vh
        &__main
            width: 100%
            display: flex
            flex-direction: column
            padding: 20px 20px 20px 0
        &__head
            width: 100%
            padding-bottom: 20px
    .sidebar-wrap
        min-width: 280px
        padding: 20px
    
</style>