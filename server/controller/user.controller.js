// import {user} from '../data'
const { users } = require('../data')

class UserController{
    getUserInfo(req, res){
        const user = users.find(el => el.email === req.body.email);
        var rez;
        if (user){
            rez = {
                status: 'ok',
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
        } else {
            rez = {
                status: 'error',
                text: 'User not found',
                data: null
            };
        }
        res.json(rez)
    };
    getAchievements(req, res){
        const user = users.find(el => el.id === req.body.userId);
        var rez;
        if (user){
            rez = {
                status: 'ok',
                data: user.achivements
            } 
        } else {
            rez = {
                status: 'error',
                text: 'Achievements not found',
                data: null
            };
        }
        res.json(rez)
    }
}

module.exports = new UserController()