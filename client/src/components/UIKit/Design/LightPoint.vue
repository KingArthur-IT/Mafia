<template>
  <div 
    class="light"
    :class="{'top': !isBottom, 'bottom': isBottom, 'left': isLeft, 'right': !isLeft}"
  ></div>
</template>

<script>
export default {
    props: {
        isBottom: {
            type: Boolean,
            default: false
        },
        isLeft: {
            type: Boolean,
            default: false
        },
    }
}
</script>

<style scoped lang="sass">
.light
    position: absolute
    background: linear-gradient(103.66deg, #176DAE 6.84%, #82E1E2 94.52%)
    filter: blur(232px)
    border-radius: 20px
    transform: rotate(-20deg)
    width: 350px
    height: 350px
    pointer-events: none
    z-index: -1
.top
    top: -100px
.bottom
    bottom: -100px
.right
    right: -100px
.left
    left: -100px


@media screen and (max-width: 600px)
    .light
        filter: blur(200px)
        width: 260px
        height: 260px
    .top
        top: -50px
    .bottom
        bottom: -50px
    .right
        right: -50px
    .left
        left: -50px
</style>