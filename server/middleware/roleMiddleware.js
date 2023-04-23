const jwt = require('jsonwebtoken')
const { secret } = require('../config/jwt.config')

module.exports = function(userRole) {
    return function (req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1]
            if (!token)
                return res.status(403).json({ message: 'User in not authorized' })
    
            const { role } = jwt.verify(token, secret)
            if (userRole !== role)
                return res.status(403).json({ message: 'User has no rights' })
            
            next()
        } catch (error) {
            console.log(error);
            return res.status(403).json({ message: 'User in not authorized' })
        }
    }
}