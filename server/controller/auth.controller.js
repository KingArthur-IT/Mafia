const pool = require('../config/db.config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const jwtConfig = require('../config/jwt.config')
const { getJWTCookie } = require('../use/additional')

const generateAccessToken = (id, email, role) => jwt.sign({ id, email, role }, jwtConfig.access_token_secret, { expiresIn: jwtConfig.access_expires_in })
const generateRefreshToken = (email) => jwt.sign({ email }, jwtConfig.refresh_token_secret, { expiresIn: jwtConfig.refresh_expires_in })

class AuthController {
    async registration(req, res){
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return res.json({ status: 'error', message: 'Validation errors', data: null })

            const { nickname, email, password, age, country, gender } = req.body

            const exist = await pool.query('SELECT * FROM users WHERE nickname=$1 or email=$2', [nickname, email])
            if (!exist.rows.length) {
                const hashPassword = bcrypt.hashSync(password, 7);
                const rez = await pool.query('INSERT INTO users (nickname, email, age, country, password, gender) values ($1, $2, $3, $4, $5, $6) RETURNING *', [nickname, email, age, country, hashPassword, gender])

                res.json({
                    status: 'ok',
                    message: 'User created successfully',
                    data: null
                })
            } else 
                res.json({
                    status: 'error',
                    message: 'User with such nickname or email is already exists',
                    data: null
                })
            
        } catch (error) {
            console.log(error);
            res.json({
                status: 'error',
                message: 'User creation failed',
                data: null
            })
        }
    };
    async login(req, res){
        try {
            const { email, password } = req.body
            const usersWithEmailInDB = await pool.query('SELECT * FROM users WHERE email=$1', [email])
            
            if (!usersWithEmailInDB.rows.length) 
                return res.json({ status: 'error', message: 'User with such email is not found', data: null })

            const { password: passwordFromDB, ...userData } = usersWithEmailInDB.rows[0]
            const validPassword = bcrypt.compareSync(password, passwordFromDB)
            if (!validPassword)
                return res.json({ status: 'error', message: 'Password is incorrect', data: null })

            const access_token = generateAccessToken( userData.id, userData.email, userData.role)
            const refresh_token = generateRefreshToken( userData.email)
            
            res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: jwtConfig.refresh_max_age });

            return res.json({ status: 'ok', message: 'Authorization success', data: { access_token, user_data: userData } })
        } catch (error) {
            console.log(error);
            res.json({ status: 'error', message: 'Failed to login', data: null })
        }
    };
    async refreshToken(req, res){
        try { 
            return res.status(500).json()
            if (req.headers?.cookie && getJWTCookie(req.headers.cookie)) {
                const refreshToken = getJWTCookie(req.headers.cookie);
          
                jwt.verify(refreshToken, jwtConfig.refresh_token_secret, async (err, decoded) => {
                    if (err || !decoded) {
                        return res.status(406).json({ message: 'Unauthorized' });
                    }
                    else {
                        const usersWithEmailInDB = await pool.query('SELECT * FROM users WHERE email=$1', [decoded.email])

                        const access_token = generateAccessToken( usersWithEmailInDB.rows[0].id, usersWithEmailInDB.rows[0].email, usersWithEmailInDB.rows[0].role)
                        const refresh_token = generateRefreshToken( usersWithEmailInDB.rows[0].email)

                        res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: jwtConfig.refresh_max_age });

                        return res.json({ status: 'ok', message: 'Token refresh success', data: access_token })
                    }
                })
            } else {
                return res.status(406).json({ message: 'Unauthorized' });
            }
        } catch (error) {
            console.log('ERR = ', error);
            res.json({ status: 'error', message: 'Failed to refresh token', data: null })
        }
    }
}

module.exports = new AuthController()