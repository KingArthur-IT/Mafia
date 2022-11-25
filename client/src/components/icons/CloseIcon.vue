<template>
    <svg class="icon" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 2L2 21" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 21L2 2" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</template>

<script>
export default {

}
</script>

<style scoped>
.icon{
    width: 19px;
    height: 19px;
    cursor: pointer;
    transition: transform .3s ease-in-out;
}
.icon:hover{
    transform: rotate(90deg);
}
.icon path{
    transition: stroke .2s ease-in-out;
}
.icon:hover path{
    stroke: var(--color-primary);
}
</style>