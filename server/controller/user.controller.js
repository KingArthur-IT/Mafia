// import {user} from '../data'
const {user} = require('../data')

class UserController{
    getUserInfo(req, res){
        const userData = {
            nickname: user.nickname,
            gender: user.gender,
            email: user.email,
            emailNotification: user.emailNotification,
            rating: user.rating,
            achivements: user.achivements
        };
        // console.log(userData);
        res.json(userData)
    }
}

module.exports = new UserController()