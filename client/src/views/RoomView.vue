<template>
  <div class="room">
      <div class="sidebar-wrap">
          sidebar
      </div>
      <div class="room__main">
          <div class="room__head">
              head
          </div>
          <div class="room__hero">
              Hero
          </div>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="sass">
    .room
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