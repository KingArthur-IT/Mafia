<!-- <template>
    <div class="achievements">
        <p v-if="achievementsData?.length" class="achievements__text">Достижения</p>
        <p v-else class="achievements__text">Достижений пока нет</p>
        <div v-if="achievementsData?.length" class="achievements__list">
            <div 
                v-for="(item, i) in achievementsData" 
                :key="i"
                class="achievements__item" 
                @click="openAchievement(achievementsInfo[item])"
                >
                    <img :src="getImageUrl('achievements', item)" :alt="item">
                    <QuestionIcon class="achievements__question" />
            </div>
        </div>
    </div>
    <ModelWrapper
        v-model="isModalVisible"
        :title="'Info'"
    >
        <div class="modal">
            {{description}}
        </div>
    </ModelWrapper>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getImageUrl } from '@/use/imgLinks.js'
import ModelWrapper from '@/components/Modals/ModalWrapper.vue'
import QuestionIcon from '@/components/icons/QuestionIcon.vue'
import { achievementsInfo } from '@/data/data'

export default {
    components:{
        ModelWrapper,
        QuestionIcon
    },
    data(){
        return{
            isModalVisible: false,
            description: '',
            achievementsDescriptions: '',
            achievementsInfo
        }
    },
    mounted(){
        this.getAchievementsData(this.userData.id);
        this.achievementsDescriptions = {...achievementsInfo};
    },
    methods:{
        ...mapActions('user', ['getAchievementsData']),
        getImageUrl,
        openAchievement(descr){
            this.isModalVisible = true;
            this.description = descr;
        }
    },
    computed:{
        ...mapGetters('user', ['userData', 'achievementsData']),
    }
}
</script>

<style scoped lang="sass">
    .achievements
        &__text
            color: #fff
            margin-bottom: 12px
            font-weight: 700
        &__list
            display: flex
            align-items: center
            margin-bottom: 24px
        &__item
            position: relative
            width: 100px
            height: 100px
            margin-right: 12px
            cursor: pointer
            & img
                width: 100%
                height: 100%
        &__question
            position: absolute
            width: 20px
            height: 20px
            bottom: 0
            right: 0
            cursor: pointer
</style> -->