<template>
  <div class="stats">
      <p class="stats__text">
          <span><strong>{{ this.userData.nickname }}</strong>, Ваш игровой рейтинг: </span>
          <span><strong>{{ userData.rating }}</strong></span>
          <info-icon @click="openInfo" />
      </p>
      <p class="stats__text">
          <span>Сейчас Вы на уровне: <strong>{{ currentLevel(userData.rating) }}</strong></span>    
      </p>
      <!-- stats -->
      <table class="table table-no-spacing">
          <tr class="table__row">
              <th width="40%"></th>
              <th>Количество</th>
          </tr>
          <tr v-for="(item, i) in Object.keys(statsDescription)" :key="i" class="row">
              <td>{{ statsDescription[item] }}</td>
              <td>{{ userData[item] }}</td>
          </tr>
      </table>
      <!-- additions -->
      <table class="table table-no-spacing">
          <tr class="table__row">
              <th width="40%"></th>
              <th>Количество</th>
          </tr>
          <tr v-for="(item, i) in Object.keys(additionalDesctiption)" :key="i" class="row">
              <td class="cell-flex">
                  <span>{{ additionalDesctiption[item] }}</span>
                  <info-icon @click="$router.push({ name: 'profile.about' })" />
              </td>
              <td>{{ userData[item] }}</td>
          </tr>
      </table>
      <!-- levels -->
      <p class="stats__text stats__title">Таблица уровней</p>
      <table class="table table-no-spacing">
          <tr class="table__row">
              <th width="40%"></th>
              <th>Рейтинг</th>
          </tr>
          <tr v-for="(item, i) in levelsInfo" :key="i" class="row">
              <td class="cell-flex">
                  <span>{{ item.name }}</span>
                  <div v-if="currentLevel(userData.rating) === item.name">
                      <SelectedIcon />
                  </div>
              </td>
              <td>
                  <span>{{ item.scoreMin }}-{{ item.scoreMax }}</span>
              </td>
          </tr>
      </table>
  </div>
  <ModelWrapper
    v-model="isModalVisible"
    :title="'Как повыстить свой уровень?'"
  >
    <div class="stats-modal">
        Ваш уровень зависит от очков рейтинга. <br><br>
        Рейнтинг можно заработать если:
        <ul class="stats-modal__list">
            <li>Просто играть и выигрывать</li>
            <li>Пригласить друга зарегистрироваться и поиграть с вами</li>
            <li>Подключить премиум аккаунт и ускорить свой рост</li>
        </ul>
    </div>
  </ModelWrapper>
</template>

<script>
import InfoIcon from '@/components/icons/InfoIcon.vue';
import SelectedIcon from '@/components/icons/SelectedIcon.vue';
import { mapActions, mapGetters } from 'vuex'
import ModelWrapper from '@/components/Modals/ModalWrapper.vue'
import { currentLevel } from '@/use/userInfo'
import { levelsInfo } from '@/data/data'

export default {
  components: { InfoIcon, SelectedIcon, ModelWrapper },
    data() {
        return {
            isModalVisible: false,
            levelsInfo
        }
    },
    mounted() {
        this.getUserData();
    },
    methods: {
        ...mapActions('user', ['getUserData']),
        currentLevel,
        openInfo(){
            this.isModalVisible = true;
        }
    },
    computed: {
        ...mapGetters('user', ['userData', 'statsDescription', 'additionalDesctiption']),
    }
}
</script>

<style scoped lang="sass">
    .row
        cursor: default
    .stats
        &__text
            color: #fff
            margin-bottom: 3px
            display: flex
            align-items: center
            & span
                margin-right: 10px
        &__title
            margin-top: 36px
            margin-bottom: 0
    .cell-flex
        display: flex
        align-items: center
        & span
            margin-right: 10px
    .stats-modal
        &__list
            & li
                padding-left: 20px
                position: relative
                &::before
                    content: ''
                    position: absolute
                    top: 9px
                    left: 2px
                    width: 8px
                    height: 8px
                    background: var(--color-primary)
</style>