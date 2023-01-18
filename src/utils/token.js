const jsonwebtoken = require("jsonwebtoken");
const jwt = {
    //create token
    issueJWT: async user => {
        let payload = {
            mobile_no: user.mobile_no,
            id: user.id
        };
        const options = {
            expiresIn: '365d'
        };
        const jwtToken = await jsonwebtoken.sign(payload, 'KEy', options);
        return jwtToken;
    },
    //verify Token 
    verifyTokenFn: async (req, res, next) => {
        //let token=req.headers.authorization    
        var token = req.headers.authorization;
        await jsonwebtoken.verify(token, 'KEy', function (err, decoded) {
            if (err) {
                return res.status(404).json({
                    success: false,
                    message: "Token Not Found",
                    data: {}
                });
            } else {
                user = {
                    mobile_no: decoded.mobile_no,
                    id: decoded.id
                }
                return next();
            }
        });
    }
};
module.exports = jwt;