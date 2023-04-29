const pool = require('../config/db.config')
const { users } = require('../data')
const { resFormat } = require('../use/helpers')
const bcrypt = require('bcryptjs')

class UserController {
    //user data
    async getUserInfo(req, res){
       try {
            const userId = req.query.id

            if (!userId) 
                return res.json(resFormat('error', 'Invalid request. No user id'))

            const usersWitID = await pool.query('SELECT * FROM users WHERE id=$1', [userId])

            if (!usersWitID.rows.length) 
                return res.json(resFormat('error', 'User with such id is not found'))

            const { password, ...userData } = usersWitID.rows[0]

            res.json(resFormat('ok', 'User get success', userData))
       } catch (error) {
           console.log('Error in getUserInfo. ', error.message);
       }
    };
    async updateUserInfo(req, res){ //id, nickname, email, gender, country, age, email_notification
        try {
            if (!req.body.id || !req.body.nickname || !req.body.email || !req.body.gender ||
                 !req.body.hasOwnProperty('country') || !req.body.hasOwnProperty('age') || !req.body.hasOwnProperty('email_notification'))
                return res.json(resFormat('error', 'Invalid request updateUserInfo.'))

            const usersWitID = await pool.query('SELECT * FROM users WHERE id=$1', [req.body.id])

            if (!usersWitID.rows.length) 
                return res.json(resFormat('error', 'User with such id is not found'))

            const updateRezult = await pool.query('UPDATE users SET nickname=$1, email=$2, gender=$3, country=$4, age=$5, email_notification=$6 WHERE id=$7 RETURNING *', 
                [req.body.nickname, req.body.email, req.body.gender, req.body.country, req.body.age, req.body.email_notification, req.body.id]
            )

            const { password, ...userData } = updateRezult.rows[0]

            return res.json(resFormat('ok', 'Updated successfully', userData))

        } catch (error) {
            console.log('Error in updateUserInfo. ', error.message);
        }
    };
    async updateUserPassword(req, res){
        try {
            if (!req.body.id || !req.body.oldPassword || !req.body.newPassword)
               return res.json(resFormat('error', 'Invalid request updateUserInfo.'))

            const usersWitID = await pool.query('SELECT * FROM users WHERE id=$1', [req.body.id])

            if (!usersWitID.rows.length) 
                return res.json(resFormat('error', 'User with such id is not found'))

            const isOldPasswordCorrect = bcrypt.compareSync(req.body.oldPassword, usersWitID.rows[0].password)

            if (!isOldPasswordCorrect)
                return res.json(resFormat('error', 'Old password is incorrect'))

            const hashPassword = bcrypt.hashSync(req.body.newPassword, 7);

            await pool.query('UPDATE users SET password=$1 WHERE id=$2 RETURNING *', [hashPassword, req.body.id])

            return res.json(resFormat('ok', 'Password changed successfully'))

        } catch (error) {
            console.log('Error in updateUserPassword. ', error.message);
            res.json(resFormat('error', 'Error in updateUserPassword'))
        }
    };
    // rating
    async getUserRating(req, res){
        try {
            const userId = req.query.id

            if (!userId) 
                return res.json(resFormat('error', 'Invalid request. No user id'))

            const usersWitID = await pool.query('SELECT * FROM users WHERE id=$1', [userId])

            if (!usersWitID.rows.length) 
                return res.json(resFormat('error', 'User with such id is not found'))
            
            return res.json(resFormat('ok', 'Rating get success', usersWitID.rows[0].rating))
        } catch (error) {
            console.log('Error in getUserRating. ', error.message);
        }
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
}

module.exports = new UserController()