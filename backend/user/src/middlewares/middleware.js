const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const verifyToken = async (req, res) => {

    const token = req.cookie.jwtToken
    
    if (!token) return res.status(404).json({ success: false, message: 'Unauthorized' })
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


module.exports = {
    verifyToken,
}
