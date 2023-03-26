<template>
  <div class="stats">
      <p class="stats__text">
          <span><strong>{{ this.userData.name }}</strong>, Ваш игровой рейтинг: </span>
          <span><strong>{{ userData.rating }}</strong></span>
          <info-icon @click="openInfo" />
      </p>
      <p class="stats__text">
          <span>Сейчас Вы на уровне: <strong>{{ currentLevel }}</strong></span>    
      </p>
      <!-- stats -->
      <table class="table table-no-spacing">
          <tr class="table__row">
              <th width="40%"></th>
              <th>Количество</th>
              <th>Балов в рейтинге</th>
          </tr>
          <tr v-for="(item, i) in Object.keys(statsData)" :key="i" class="row">
              <td>{{ descriptions[item] }}</td>
              <td>{{ statsData[item].count }}</td>
              <td>{{ statsData[item].score }}</td>
          </tr>
      </table>
      <!-- additions -->
      <table class="table table-no-spacing">
          <tr class="table__row">
              <th width="40%"></th>
              <th>Количество</th>
              <th>Балов в рейтинге</th>
          </tr>
          <tr v-for="(item, i) in Object.keys(additionsData)" :key="i" class="row">
              <td class="cell-flex">
                  <span>{{ descriptions[item] }}</span>
                  <info-icon />
              </td>
              <td>{{ additionsData[item].count }}</td>
              <td>{{ additionsData[item].score }}</td>
          </tr>
      </table>
      <!-- levels -->
      <p class="stats__text stats__title">Таблица уровней</p>
      <table class="table table-no-spacing">
          <tr class="table__row">
              <th width="40%"></th>
              <th>Рейтинг</th>
          </tr>
          <tr v-for="(item, i) in levels" :key="i" class="row">
              <td class="cell-flex">
                  <span>{{ item.name }}</span>
                  <div v-if="currentLevel === item.name">
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
    <div class="modal">
        Ваш уровень зависит от очков рейтинга. Рейнтинг можно заработать:
        <ul>
            <li>Играя и выигрывая</li>
            <li>Пригласив друга зарегистрироваться и поиграть с Вами</li>
            <li>Подключив премиум аккаунт</li>
        </ul>
    </div>
  </ModelWrapper>
</template>

<script>
import InfoIcon from '@/components/icons/InfoIcon.vue';
import SelectedIcon from '@/components/icons/SelectedIcon.vue';
import { mapActions, mapGetters } from 'vuex'
import ModelWrapper from '@/components/Modals/ModalWrapper.vue'

export default {
  components: { InfoIcon, SelectedIcon, ModelWrapper },
    data() {
        return {
            isModalVisible: false,
            descriptions: {
                allGames: 'Сыгнано игр',
                mafiaWins: 'Побед в команде мафии',
                citizenWins: 'Побед в команде мирных жителей',
                wasMafia: 'Играл в роли мафии',
                wasSheriff: 'Играл в роли шерифа',
                wasDoctor: 'Играл в роли доктора',
                wasLover: 'Играл в роли любовницы',
                wasTerrorist: 'Играл в роли террориста',
                wasBarmen: 'Играл в роли бармена',
                wasBodyguard: 'Играл в роли телохранителя',
                friends: 'Приведи друга'
            },
            levels: [
                { name: 'Новичок', scoreMin: 0, scoreMax: 199 },
                { name: 'Гражданин', scoreMin: 200, scoreMax: 499 },
                { name: 'Крестный отец', scoreMin: 500, scoreMax: 999 },
                { name: 'Консильери', scoreMin: 1000, scoreMax: 1999 },
                { name: 'Дон', scoreMin: 2000, scoreMax: 4999 },
                { name: 'Босс мафии', scoreMin: 5000, scoreMax: 9999 },
                { name: 'Преступный гений', scoreMin: 10000, scoreMax: 14999 },
                { name: 'Владыка теней', scoreMin: 15000, scoreMax: 19999 },
                { name: 'Король преступного мира', scoreMin: 20000, scoreMax: 24999 },
                { name: 'Божество мафии', scoreMin: 25000, scoreMax: 1000000 },
            ]
        }
    },
    mounted(){
        this.getStatsData();
        this.getAdditionsData();
    },
    methods:{
        ...mapActions('user', ['getStatsData', 'getAdditionsData']),
        openInfo(){
            this.isModalVisible = true;
        }
    },
    computed:{
        ...mapGetters('user', ['statsData', 'additionsData', 'userData']),
        currentLevel() {
            return this.levels.find(el => this.userData.rating >= el.scoreMin && this.userData.rating <= el.scoreMax).name
        }
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
</style>