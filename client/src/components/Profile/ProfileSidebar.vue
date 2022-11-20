<template>
  <div class="sidebar">
    <div class="sidebar__logo lg-font">MafiaWorld</div>
    <div class="profile-section">
      <div class="profile-section__icon md-font">AA</div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="sass">
    .sidebar
      background-color: var(--color-background-soft)
      height: 100%
      width: 100%
      border-radius: 30px
      &__logo
        color: var(--color-text)
        font-family: 'Kaushan Script', cursive
        text-align: center
        padding: 15px 15px 0
    .profile-section
        width: 100%
        background: var(--color-background-soft)
        padding: 15px
        &__icon
          height: 100px
          width: 100px
          color: #fff
          border-radius: 50%
          background-color: #ff0000
          border: 3px solid #fff
          display: flex
          justify-content: center
          align-items: center
          margin: 0 auto
          text-align: center
          font-weight: 700
</style>