<template>
  <div class="stats">
      <table class="table table-no-spacing">
          <tr class="table__row">
              <th width="60%"></th>
              <th></th>
          </tr>
          <tr v-for="(item, i) in Object.keys(statsData)" :key="i" class="row">
              <td>{{descriptions[item]}}</td>
              <td>{{statsData[item]}}</td>
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
                wins: 'Побед',
                wasMafia: 'Был мафией',
                wasSheriff: 'Был шерифом',
                wasDoctor: 'Был доктором',
                wasLover: 'Был любовницей',
                wasTerrorist: 'Был террористом',
                wasBarmen: 'Был барменом',
                wasBodyguard: 'Был телохранителем'
            }
        }
    },
    mounted(){
        this.getStatsData();
    },
    methods:{
        ...mapActions(['getStatsData'])
    },
    computed:{
        ...mapGetters(['statsData'])
    }
}
</script>

<style scoped lang="sass">
    .row
        cursor: default
</style>