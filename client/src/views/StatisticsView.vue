<template>
  <div class="stats">
      <table class="table table-no-spacing">
          <tr class="table__row">
              <th width="60%"></th>
              <th></th>
          </tr>
          <tr v-for="(item, i) in Object.keys(data)" :key="i" class="row">
              <td>{{data[item].description}}</td>
              <td>{{data[item].value}}</td>
          </tr>
      </table>
  </div>
</template>

<script>
export default {
    data(){
        return{
            data: {
                allGames: {
                    description: 'Сыгнано игр',
                    value: 50
                },
                winsGames: {
                    description: 'Побед',
                    value: 50
                },
                wasMafia:{
                    description: 'Был мафией',
                    value: 50
                },
                wasSheriff:{
                    description: 'Был шерифом',
                    value: 50
                },
                wasDoctor:{
                    description: 'Был доктором',
                    value: 50
                },
                wasLover:{
                    description: 'Был любовницей',
                    value: 50
                },
                wasTerrorist:{
                    description: 'Был террористом',
                    value: 50
                },
                wasBarmen:{
                    description: 'Был барменом',
                    value: 50
                },
                wasBodyguard:{
                    description: 'Был телохранителем',
                    value: 50
                },
            }
        }
    }
}
</script>

<style scoped lang="sass">
    .row
        cursor: default
</style>