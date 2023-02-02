<template>
  <div class="create">
      <div class="create__input-wrapper">
            <CustomInput 
                :label="'Название комнаты'"  
                v-model="roomName"
                :isValid="isRoomNameValid"
                >Не задано название комнаты</CustomInput>
        </div>

        <div class="create__line"></div>
        <p class="create__text">Количество игроков в комнате</p>
        <div class="create__input-wrapper range">
            <RangeSlider
                v-model="roomPlayers"
                :max="21"
                :min="6"
            />
        </div>
        <p class="create__text">Игроков в комнате: от {{roomPlayers[0]}} до {{roomPlayers[1]}}</p>

        <div class="create__line"></div>

        <p class="create__text">Мирных жителей: <strong>{{citizens}}</strong></p>
        <p class="create__text">Мафия: <strong>{{mafia}}</strong></p>

        <div class="create__input-wrapper">
            <NumberRange 
                v-model="sheriff.value"
                :label="'Шериф'"
                :min="sheriff.min"
                :max="sheriff.max"
            />
        </div>
        <div class="create__input-wrapper">
            <NumberRange 
                v-model="doctor.value"
                :label="'Доктор'"
                :min="doctor.min"
                :max="doctor.max"
            />
        </div>
        <div class="create__input-wrapper">
            <NumberRange 
                v-model="reporter.value"
                :label="'Репортер'"
                :min="reporter.min"
                :max="reporter.max"
            />
        </div>
        <div class="create__input-wrapper">
            <NumberRange 
                v-model="lover.value"
                :label="'Любовница'"
                :min="lover.min"
                :max="lover.max"
            />
        </div>
        <div class="create__input-wrapper">
            <NumberRange 
                v-model="bodyguard.value"
                :label="'Телохранитель'"
                :min="bodyguard.min"
                :max="bodyguard.max"
            />
        </div>
        <div class="create__input-wrapper">
            <NumberRange 
                v-model="barmen.value"
                :label="'Бармен'"
                :min="barmen.min"
                :max="barmen.max"
            />
        </div>
        <div class="create__input-wrapper">
            <NumberRange 
                v-model="terrorist.value"
                :label="'Террорист'"
                :min="terrorist.min"
                :max="terrorist.max"
            />
        </div>

        <div class="create__btn">
            <SaveButton :text="'Создать'" :isAdd="true" @click="createRoomEvent" />
        </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import RangeSlider from 'vue-simple-range-slider';
import 'vue-simple-range-slider/css';
import CustomInput from '@/components/UIKit/CustomInput.vue'
import SaveButton from '@/components/UIKit/SaveButton.vue'
import NumberRange from '@/components/UIKit/NumberRange.vue'

export default {
    components:{
        RangeSlider,
        CustomInput,
        SaveButton,
        NumberRange
    },
    data(){
        return{
            roomName: '',
            isRoomNameValid: true,
            roomPlayers: [6, 6],
            citizens: 4,
            mafia: 2,
            sheriff: {
                value: 1,
                min: 1,
                max: 1
            },
            doctor: {
                value: 1,
                min: 0,
                max: 1
            },
            lover: {
                value: 0,
                min: 0,
                max: 0
            },
            reporter: {
                value: 1,
                min: 0,
                max: 1
            },
            bodyguard: {
                value: 0,
                min: 0,
                max: 0
            },
            barmen: {
                value: 0,
                min: 0,
                max: 0
            },
            terrorist: {
                value: 0,
                min: 0,
                max: 0
            },
        }
    },
    watch:{
        roomPlayers: function(){
            const roomPlayersMax = this.roomPlayers[1];
            const roomPlayersMin = this.roomPlayers[0];

            this.mafia = Math.round(roomPlayersMax / 3);
            this.citizens = roomPlayersMax - this.mafia;

            this.barmen.max = this.mafia > 2 ? this.mafia < 7 ? 1 : 2 : 0;
            this.terrorist.max = this.mafia > 3 ? this.mafia < 7 ? 1 : 2 : 0;

            this.bodyguard.max = this.mafia > 3 ? this.mafia < 7 ? 1 : 2 : 0;
            this.reporter.max = this.citizens > 8 ? this.citizens < 12 ? 2 : 3 : 1;
            this.doctor.max = this.citizens > 5 ? this.citizens < 12 ? 2 : 3 : 1;
            this.lover.max = this.citizens > 7 ? 2 : 1;
            this.sheriff.max = this.citizens > 6 ? this.citizens < 12 ? 2 : 3 : 1;

            if (roomPlayersMax < roomPlayersMin)
                    this.roomPlayers[0] = roomPlayersMax;

            if (roomPlayersMax < roomPlayersMin)
                this.roomPlayers[1] = roomPlayersMin;
        },
    },
    methods:{
        ...mapActions('rooms', ['createRoom']),
        async createRoomEvent(){
            this.isRoomNameValid = !!this.roomName.length;
            if (!this.isRoomNameValid) return;

            const roomId = await this.createRoom({
                name: this.roomName,
                maxPersons: this.roomPlayers[0],
                minPersons: this.roomPlayers[1],
                roles: [
                    {role: 'lover', count: this.lover.value},
                    {role: 'reporter', count: this.reporter.value},
                    {role: 'barmen', count: this.barmen.value},
                    {role: 'doctor', count: this.doctor.value},
                    {role: 'bodyguard', count: this.bodyguard.value},
                    {role: 'terrorist', count: this.terrorist.value}
                ]
            });
            if (roomId !== -1)
                this.$router.push({name: 'room', params:{id: roomId}});
        }
    }
}
</script>

<style scoped lang="sass">
    .create
        &__input-wrapper
            max-width: 500px
            margin-bottom: 12px
        &__text
            margin-bottom: 12px
        &__btn
            max-width: 500px
            margin-top: 24px
        &__line
            width: 100%
            height: 1px
            margin: 24px 0
            background-color: #4a4d55
            max-width: 500px
    .range
        color: #000
</style>