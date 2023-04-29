const pool = require('../config/db.config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const jwtConfig = require('../config/jwt.config')
const { getJWTCookie, resFormat } = require('../use/helpers')

const generateAccessToken = (id, email, role) => jwt.sign({ id, email, role }, jwtConfig.access_token_secret, { expiresIn: jwtConfig.access_expires_in })
const generateRefreshToken = (email) => jwt.sign({ email }, jwtConfig.refresh_token_secret, { expiresIn: jwtConfig.refresh_expires_in })

class AuthController {
    async registration(req, res){
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return res.json(resFormat('error', 'Validation errors'))

            const { nickname, email, password, age, country, gender } = req.body

            const exist = await pool.query('SELECT * FROM users WHERE nickname=$1 or email=$2', [nickname, email])
            if (!exist.rows.length) {
                const hashPassword = bcrypt.hashSync(password, 7);
                await pool.query('INSERT INTO users (nickname, email, age, country, password, gender) values ($1, $2, $3, $4, $5, $6) RETURNING *', [nickname, email, age, country, hashPassword, gender])

                res.json(resFormat('ok', 'User created successfully'))
            } else 
                res.json(resFormat('error', 'User with such nickname or email is already exists'))
            
        } catch (error) {
            console.log('Error in registration', error.message);
            res.json(resFormat('error','User creation failed'))
        }
    };
    async login(req, res){
        try {
            const { email, password } = req.body
            const usersWithEmailInDB = await pool.query('SELECT * FROM users WHERE email=$1', [email])
            
            if (!usersWithEmailInDB.rows.length) 
                return res.json(resFormat('error', 'User with such email is not found'))

            const { password: passwordFromDB, ...userData } = usersWithEmailInDB.rows[0]
            const validPassword = bcrypt.compareSync(password, passwordFromDB)
            if (!validPassword)
                return res.json(resFormat('error', 'Password is incorrect'))

            const access_token = generateAccessToken( userData.id, userData.email, userData.role)
            const refresh_token = generateRefreshToken( userData.email)
            
            res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: jwtConfig.refresh_max_age });

            return res.json(resFormat('ok', 'Authorization success', { access_token, user_data: userData }))
        } catch (error) {
            console.log('Error in login', error.message);
            res.json(resFormat('error', 'Failed to login'))
        }
    };
    async refreshToken(req, res){
        try { 
            if (req.headers?.cookie && getJWTCookie(req.headers.cookie)) {
                const refreshToken = getJWTCookie(req.headers.cookie);
          
                jwt.verify(refreshToken, jwtConfig.refresh_token_secret, async (err, decoded) => {
                    if (err || !decoded) {
                        return res.status(406).json(resFormat('error', 'Unauthorized'));
                    }
                    else {
                        const usersWithEmailInDB = await pool.query('SELECT * FROM users WHERE email=$1', [decoded.email])

                        const access_token = generateAccessToken( usersWithEmailInDB.rows[0].id, usersWithEmailInDB.rows[0].email, usersWithEmailInDB.rows[0].role)
                        const refresh_token = generateRefreshToken( usersWithEmailInDB.rows[0].email)

                        res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: jwtConfig.refresh_max_age });

                        return res.json(resFormat('ok', 'Token refresh success', access_token))
                    }
                })
            } else {
                return res.status(406).json(resFormat('error', 'Unauthorized'));
            }
        } catch (error) {
            console.log('Error in refreshToken ', error.message);
            res.json(resFormat('error', 'Failed to refresh token'))
        }
    }
}

module.exports = new AuthController()