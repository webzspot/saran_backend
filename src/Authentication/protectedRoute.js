var jwt = require('jsonwebtoken');

function productedRoute(req, res, next) {
    console.log(req.headers)
    const data = req.headers["authorization"]
    const token = data && data.split(' ')[1]
    console.log(data)
    console.log(token)
    if (!token) {
        res.status(403).json({
            message: "No token"   
        })
    } else {
        jwt.verify(token, 'saranya_project', function (err) {
            if (err) {
                res.status(403).json({
                    message: "Token Invalid"
                });

            } else {
                next();
            }
        })

    }
}

module.exports= productedRoute
