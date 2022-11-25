<template>
    <div class="achievements">
        <p class="achievements__text">Достижения</p>
          <div class="achievements__list">
              <div 
                v-for="item in achievements" 
                :key="item.id"
                class="achievements__item" 
                @click="openAchievement(item.description)"
              >
                  <img :src="getImageUrl('achievements', item.imgName)" :alt="item.imgName">
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
import { getImageUrl } from '@/use/imgLinks.js'
import ModelWrapper from '@/components/Modals/ModalWrapper.vue'
import QuestionIcon from '@/components/icons/QuestionIcon.vue'

export default {
    components:{
        ModelWrapper,
        QuestionIcon
    },
    data(){
        return{
            isModalVisible: false,
            description: '',
            achievements: [
                {
                    id: 0,
                    imgName: 'sheriff',
                    alt: 'sheriff',
                    description: 'Вы успешно сыграли в роли шерифа'
                },
                {
                    id: 1,
                    imgName: 'sheriff',
                    alt: 'sheriff',
                    description: 'Вы успешно сыграли в роли шерифа'
                },
                {
                    id: 2,
                    imgName: 'sheriff',
                    alt: 'sheriff',
                    description: 'Вы успешно сыграли в роли шерифа'
                }
            ]
        }
    },
    methods:{
        getImageUrl,
        openAchievement(descr){
            this.isModalVisible = true;
            this.description = descr;
        }
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
</style>