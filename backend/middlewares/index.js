const JWT_Secret = require("../config")
const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next)=>{
    const authHeader =  req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(500).json({message:"something went wrong"})
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token,JWT_Secret)
        // console.log(decoded.userId)
        req.id = decoded.userId //available in everywhere we use middleware
        next()
    } catch (error) {
        return res.status(500).send(error)
    }
}

module.exports = authMiddleware;    