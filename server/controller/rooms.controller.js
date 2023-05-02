// const uuid = require('uuid')
const pool = require('../config/db.config');
const { resFormat } = require('../use/helpers')

class RoomsController{
    async createRoom(req, res){
        try {
            // const newId = uuid.v4()
            if (!req.body?.name || !req.body?.max_persons || !req.body?.min_persons || !req.body?.roles.length)
                return res.json(resFormat('error', 'Invalid request createRoom.'))

            const roomWithSameName = await pool.query('SELECT id, name FROM rooms WHERE name = $1;', [req.body.name])
            if (roomWithSameName.rows.length)
                return res.json(resFormat('error', 'Room with such name already exists'))

            const lover_max_count = req.body.roles.find(r => r.role === 'lover')?.count || 0
            const reporter_max_count = req.body.roles.find(r => r.role === 'reporter')?.count || 0
            const barmen_max_count = req.body.roles.find(r => r.role === 'barmen')?.count || 0
            const doctor_max_count = req.body.roles.find(r => r.role === 'doctor')?.count || 0
            const bodyguard_max_count = req.body.roles.find(r => r.role === 'bodyguard')?.count || 0
            const terrorist_max_count = req.body.roles.find(r => r.role === 'terrorist')?.count || 0

            const roomId = await pool.query(`
                INSERT INTO rooms (name, max_persons, min_persons, lover_max_count, reporter_max_count, barmen_max_count, doctor_max_count, bodyguard_max_count, terrorist_max_count) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id
            `, 
                [req.body.name, req.body.max_persons, req.body.min_persons, lover_max_count, reporter_max_count, barmen_max_count, doctor_max_count, bodyguard_max_count, terrorist_max_count]
            )

            if (roomId.rows[0].id)
                return res.json(resFormat('ok', 'Room created successfully', { id: roomId.rows[0].id }))
            else return res.json(resFormat('error', 'Room creation failed'))
        } catch (error) {
            console.log('Error in createRoom. ', error.message);
            res.json(resFormat('error', 'Error in createRoom'))
        }
    }
}

module.exports = new RoomsController()