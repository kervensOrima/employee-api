const jwt = require('jsonwebtoken')
const SECRET = require('./secret')


module.exports = (req, resp, next) => {

    const headerAuthorization = req.headers.authorization 
    // console.log(headerAuthorization)
    
    if(!headerAuthorization) {
        return resp.status(403).json({
            message: 'ho header authorization in the request' ,
            success: false,
            timestamp: new Date()
        })
    }

    const token = headerAuthorization.split(' ')[1]
    const decodedToken = jwt.verify(token, SECRET, (error, decodedTokens) => {

        if(error) {
            return resp.status(404).json({
                message: 'request unauthorized',
                timestamp: new Date() ,
                success: false
            })
        }

        // compare the user request to gvive or not access
        const user = decodedTokens.data
        console.log(user)

        if(req.body.user && req.body.user !== user) {
            return resp.status(402).json({
                message: 'invalid token' ,
                timestamp: new Date() ,
                success: false
            })
        } else {
            next()
        }

    })
}