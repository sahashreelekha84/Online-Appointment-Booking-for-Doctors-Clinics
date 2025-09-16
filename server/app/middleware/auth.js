

const jwt = require("jsonwebtoken")

const AuthCheck = (req, res, next) => {
    if (req.cookies && req.cookies.usertoken) {
        jwt.verify(req.cookies.usertoken, "helloworldwelcometowebskitters", (err, data) => {
            req.user = data
            //console.log('user',req.user);
            //console.log(req.user);
            
            next()
        })
    } else {
        next()
    }
}

module.exports = AuthCheck;