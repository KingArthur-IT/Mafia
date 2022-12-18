// import {user} from '../data'
const {user} = require('../data')

class UserController{
    getUserInfo(req, res){
        const userData = {
            data: {
                id: user.id,
                nickname: user.nickname,
                gender: user.gender,
                email: user.email,
                emailNotification: user.emailNotification,
                rating: user.rating,
                accountType: user.accountType,
            }
        };
        // console.log(userData);
        res.json(userData)
    };
    getAchievements(req, res){
        const rez = {
            data: user.achivements
        };
        res.json(rez)
    }
}

module.exports = new UserController()