<template>
  <div class="stats">
      <p class="stats__text">
          <span>Рейтинг: {{userData.rating}}</span>
          <span>Уровень: Горожанин</span>    
      </p>
      <table class="table table-no-spacing">
          <tr class="table__row">
              <th width="60%"></th>
              <th>Балов в рейтинге</th>
          </tr>
          <tr v-for="(item, i) in Object.keys(descriptions)" :key="i" class="row">
              <td>{{ descriptions[item] }}</td>
              <td>{{ statsData[item] }}</td>
          </tr>
      </table>
      <table class="table table-no-spacing">
          <tr class="table__row">
              <th width="60%"></th>
              <th>Балов в рейтинге</th>
          </tr>
          <tr class="row">
              <td>"Приведи друга"</td>
              <td>{{ statsData.friend }}</td>
          </tr>
      </table>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    data(){
        return{
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
                wasBodyguard: 'Играл в роли телохранителя'
            }
        }
    },
    mounted(){
        this.getStatsData();
    },
    methods:{
        ...mapActions('user', ['getStatsData'])
    },
    computed:{
        ...mapGetters('user', ['statsData', 'userData'])
    }
}
</script>

<style scoped lang="sass">
    .row
        cursor: default
    .stats
        &__text
            color: #fff
            margin-bottom: 12px
            font-weight: 700
            display: flex
            align-items: center
            & span
                margin-right: 10px
</style>