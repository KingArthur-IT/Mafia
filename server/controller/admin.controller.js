const pool = require('../config/db.config')
const { entryNotif } = require('../config/entryNotification')
const { resFormat } = require('../use/helpers')

class AdminController {
    async setNewRole(req, res){
        try {

        } catch (error) {
            console.log(error);
        }
    };
    async addEntryNotification(req, res){
        try {
            if (!req.body.email)
                return res.json(resFormat('error', 'Invalid request. Required email'))
            
            const usersWithEmailInDB = await pool.query('SELECT * FROM users WHERE email=$1', [req.body.email])
            
            if (!usersWithEmailInDB.rows.length) 
                return res.json(resFormat('error', 'User with such email is not found'))
        
            await pool.query('INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3);', [usersWithEmailInDB.rows[0].id, entryNotif.title, entryNotif.message])
            return res.json(resFormat('ok', 'Entry notification added successfully'))

        } catch (error) {
            console.log('Error in addEntryNotification', error.message);
            res.json(resFormat('error','Error in addEntryNotification'))
        }
    }
}

module.exports = new AdminController()