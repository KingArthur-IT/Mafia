const pool = require('../config/db.config')
const { users } = require('../data')

class UserController {
    //user data
    async getUserInfo(req, res){
       try {
            const userId = req.query.id

            if (!userId) 
                return res.json({ status: 'error', message: 'Invalid request. No user id', data: null })

            const usersWitID = await pool.query('SELECT * FROM users WHERE id=$1', [userId])

            if (!usersWitID.rows.length) 
                return res.json({ status: 'error', message: 'User with such id is not found', data: null })

            const { password, ...userData } = usersWitID.rows[0]

            res.json({ status: 'ok', message: 'User get success', data: userData })
       } catch (error) {
           console.log(error);
       }
    };
    updateUserInfo(req, res){
        var rez;
        const user = users.find(el => el.id === req.body.id);
        
        if (user){
            if (req.body.email && req.body.nickname && req.body.gender && req.body.hasOwnProperty('emailNotification')) {
                user.email = req.body.email
                user.nickname = req.body.nickname
                user.gender = req.body.gender
                user.emailNotification = req.body.emailNotification
                user.age = req.body.age
                user.country = req.body.country
                rez = { 
                    status: 'ok', 
                    message: 'User data updated successfully', 
                    data: {
                        id: user.id,
                        nickname: user.nickname,
                        age: user.age,
                        country: user.country,
                        gender: user.gender,
                        email: user.email,
                        emailNotification: user.emailNotification,
                        rating: user.rating,
                        accountType: user.accountType,
                    }
                };
            } else rez = { status: 'error', message: 'Request is incorect', data: null };
        } else {
            rez = { status: 'error', message: 'User not found', data: null };
        }

        res.json(rez)
    };
    updateUserPassword(req, res){
        var rez;
        const user = users.find(el => el.id === req.body.id);
        
        if (user){
            if (req.body.oldPassword && req.body.newPassword) {
                if (user.password === req.body.oldPassword) {
                    user.password = req.body.newPassword
                    rez = { status: 'ok', message: 'Password updated successfully', data: null };
                } else rez = { status: 'error', message: 'Old password is incorect', data: null };
            } else rez = { status: 'error', message: 'Request is incorect', data: null };
        } else {
            rez = { status: 'error', message: 'User not found', data: null };
        }

        res.json(rez)
    };
    //notifications
    getNotificationsData(req, res){
        const user = users.find(el => el.id === req.body.id);
        var rez;
        if (user){
            rez = {
                status: 'ok',
                message: 'Success',
                data: user.notifications
            };
        } else {
            rez = {
                status: 'error',
                message: 'User not found',
                data: null
            };
        }
        res.json(rez)
    };
    setAllNotificationsRead(req, res){
        const user = users.find(el => el.id === req.body.id);
        var rez;
        if (user){
            user.notifications.forEach(n => n.isRead = true)
            rez = {
                status: 'ok',
                message: 'Success',
                data: user.notifications
            };
        } else {
            rez = {
                status: 'error',
                message: 'User not found',
                data: null
            };
        }
        res.json(rez)
    };
    //statistic
    getStatsData(req, res){
        const user = users.find(el => el.id === req.body.id);
        var rez;
        if (user){
            rez = {
                status: 'ok',
                message: 'Success',
                data: user.statistics
            };
        } else {
            rez = {
                status: 'error',
                message: 'User not found',
                data: null
            };
        }
        res.json(rez)
    };
    getAdditionsData(req, res){
        const user = users.find(el => el.id === req.body.id);
        var rez;
        if (user){
            rez = {
                status: 'ok',
                message: 'Success',
                data: user.userAdditions
            };
        } else {
            rez = {
                status: 'error',
                message: 'User not found',
                data: null
            };
        }
        res.json(rez)
    };
    // rating
    getUserRating(req, res){
        const user = users.find(el => el.id === req.body.id);
        var rez;
        if (user){
            rez = {
                status: 'ok',
                data: user.rating
            };
        } else {
            rez = {
                status: 'error',
                message: 'User not found',
                data: null
            };
        }
        res.json(rez)
    };
}

module.exports = new UserController()