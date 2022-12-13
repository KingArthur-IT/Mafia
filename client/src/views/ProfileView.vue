<template>
  <div class="profile">
      <div class="sidebar-wrap">
          <ProfileSidebar />
      </div>
      <div class="profile__main">
          <div class="profile__head">
              <HeadPanel />
          </div>
          <div class="profile__hero">
              <router-view></router-view>
          </div>
      </div>
  </div>
</template>

<script>
import ProfileSidebar from '@/components/Profile/ProfileSidebar.vue'
import HeadPanel from '@/components/Profile/HeadPanel.vue'

import { mapActions } from 'vuex'

export default {
    components:{
        ProfileSidebar,
        HeadPanel,
    },
    async mounted(){
        this.getUserData( );
    },
    methods:{
        ...mapActions('user', ['getUserData']),
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
        &__hero
            background: var(--color-background-soft)
            height: 100%
            width: 100%
            border-radius: 30px
            padding: 30px
    .sidebar-wrap
        min-width: 280px
        padding: 20px
    
</style>