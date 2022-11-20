<template>
    <svg class="svg-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 511 511" style="enable-background:new 0 0 511 511;" xml:space="preserve">
        <path d="M0,104v303h511V104H0z M308.486,288H202.514L26.166,119h458.668L308.486,288z M149.871,258.327L15,382.409V129.076
                L149.871,258.327z M160.723,268.727L196.486,303h118.027l35.764-34.273L484.27,392H26.73L160.723,268.727z M361.129,258.327
                L496,129.076v253.333L361.129,258.327z"/>
        <rect x="399.5" y="136" width="24" height="15"/>
        <rect x="255.5" y="136" width="128" height="15"/>
    </svg>
</template>

<script>
export default {

}
</script>

<style scoped>
.svg-icon{
    cursor: pointer;
}
.svg-icon path,
.svg-icon rect{
    stroke: #fff;
    fill: #fff;
    transition: all .2s ease-in-out;
}
.svg-icon:hover path,
.svg-icon:hover rect{
    stroke: var(--color-primary);
    fill: var(--color-primary);
}
</style>