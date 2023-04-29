import { levelsInfo } from '@/data/data'

const currentLevel = (rating) => {
    if (rating)
        return levelsInfo.find(el => rating >= el.scoreMin && this.userData.rating <= el.scoreMax).name
    else return levelsInfo[0].name
} 

export {
    currentLevel
}