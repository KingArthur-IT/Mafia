<template>
  <footer class="container footer">
      <div class="footer__logo" @click="goToMainPage">
        <Logo />
      </div>
      <div class="footer__contact">
        <div class="footer__contact-name">Наши контакты:</div>
        <a href="mailto:" class="footer__mail">mafiaworld@support.com</a>
        <div class="socials">
          <a href="#" class="socials__item">
            <svg width="800px" height="800px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none">
              <path stroke="#fff" stroke-width="12" d="M23.073 88.132s65.458-26.782 88.16-36.212c8.702-3.772 38.215-15.843 38.215-15.843s13.621-5.28 12.486 7.544c-.379 5.281-3.406 23.764-6.433 43.756-4.54 28.291-9.459 59.221-9.459 59.221s-.756 8.676-7.188 10.185c-6.433 1.509-17.027-5.281-18.919-6.79-1.513-1.132-28.377-18.106-38.214-26.404-2.649-2.263-5.676-6.79.378-12.071 13.621-12.447 29.891-27.913 39.728-37.72 4.54-4.527 9.081-15.089-9.837-2.264-26.864 18.483-53.35 35.835-53.35 35.835s-6.053 3.772-17.404.377c-11.351-3.395-24.594-7.921-24.594-7.921s-9.08-5.659 6.433-11.693Z"/>
            </svg>
          </a>
          <a href="#" class="socials__item">
            <svg width="800px" height="800px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none">
              <path stroke="#fff" stroke-width="12" d="M96 162c-14.152 0-24.336-.007-32.276-.777-7.849-.761-12.87-2.223-16.877-4.741a36 36 0 0 1-11.33-11.329c-2.517-4.007-3.98-9.028-4.74-16.877C30.007 120.336 30 110.152 30 96c0-14.152.007-24.336.777-32.276.76-7.849 2.223-12.87 4.74-16.877a36 36 0 0 1 11.33-11.33c4.007-2.517 9.028-3.98 16.877-4.74C71.663 30.007 81.847 30 96 30c14.152 0 24.336.007 32.276.777 7.849.76 12.87 2.223 16.877 4.74a36 36 0 0 1 11.329 11.33c2.518 4.007 3.98 9.028 4.741 16.877.77 7.94.777 18.124.777 32.276 0 14.152-.007 24.336-.777 32.276-.761 7.849-2.223 12.87-4.741 16.877a36 36 0 0 1-11.329 11.329c-4.007 2.518-9.028 3.98-16.877 4.741-7.94.77-18.124.777-32.276.777Z"/>
              <circle class="big-circle" cx="96" cy="96" r="30" stroke="#fff" stroke-width="12"/>
              <circle class="small-circle" cx="135" cy="57" r="9" fill="#fff"/>
            </svg>
          </a>
          <a href="#" class="socials__item fb">
            <svg fill="#fff" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="-143 145 512 512" xml:space="preserve">
              <g>
                <path d="M329,145h-432c-22.1,0-40,17.9-40,40v432c0,22.1,17.9,40,40,40h432c22.1,0,40-17.9,40-40V185C369,162.9,351.1,145,329,145z
                  M339,617c0,5.5-4.5,10-10,10h-432c-5.5,0-10-4.5-10-10V185c0-5.5,4.5-10,10-10h432c5.5,0,10,4.5,10,10V617z"/>
                <path d="M146.8,313.7c10.3,0,21.3,3.2,21.3,3.2l6.6-39.2c0,0-14-4.8-47.4-4.8c-20.5,0-32.4,7.8-41.1,19.3
                  c-8.2,10.9-8.5,28.4-8.5,39.7v25.7H51.2v38.3h26.5v133h49.6v-133h39.3l2.9-38.3h-42.2v-29.9C127.3,317.4,136.5,313.7,146.8,313.7z"
                  />
              </g>
            </svg>
          </a>
        </div>
      </div>
  </footer>
</template>

<script>
import Logo from '@/components/icons/ProjectLogo.vue'

export default {
  components: {
    Logo
  },
  methods: {
    goToMainPage() {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped lang="sass">
.footer
    display: flex
    justify-content: space-between
    align-items: flex-start
    padding-bottom: 15px
    &__logo
        cursor: pointer
        flex-basis: 50%
        transform: translateY(-10px)
        & svg
          width: 240px
    &__contact
      flex-basis: 50%
    &__contact-name
      text-align: right
      font-weight: 600
      font-size: 26px
      margin-bottom: 10px
    &__mail
      width: fit-content
      font-size: 16px
      text-align: right
      margin-left: auto
      display: block
      transition: color .3s ease
      font-weight: 600
      margin-bottom: 5px
      &:hover
        color: var(--color-primary)
.socials
  display: flex
  align-items: center
  justify-content: flex-end
  &__item
    cursor: pointer
    margin-left: 8px
    & svg
      width: 30px
      height: 30px
      & path 
        transition: all .3s ease
      & circle
        transition: all .3s ease
    &.fb
      margin-left: 12px
      & svg
        width: 23px
        height: 23px
      &:hover svg path
        fill: var(--color-primary)
    &:hover svg
      & path
        stroke: var(--color-primary)
      & .big-circle
        stroke: var(--color-primary)
      & .small-circle
        fill: var(--color-primary)

@media screen and (max-width: 768px)
  .footer
    &__logo
      & svg
        width: 180px
    &__contact-name
      font-size: 22px
      margin-bottom: 5px
    &__mail
      font-size: 14px

@media screen and (max-width: 475px)
  .footer
    &__logo
      & svg
        width: 140px

@media screen and (max-width: 425px)
  .footer
    &__contact-name
      font-size: 20px
      margin-bottom: 5px
    &__mail
      font-size: 12px

@media screen and (max-width: 350px)
  .footer
    &__contact-name
      font-size: 18px
      margin-bottom: 2px

</style>