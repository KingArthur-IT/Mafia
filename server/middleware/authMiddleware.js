const jwt = require('jsonwebtoken')
const { access_token_secret } = require('../config/jwt.config')

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token)
            return res.status(401).json({ message: 'User in not authorized' })

        jwt.verify(token, access_token_secret, (err, user) => {
            if (err) res.status(401).json({ message: 'User in not authorized' })
            req.user = user
            next()
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Authorizization error' })
    }
}