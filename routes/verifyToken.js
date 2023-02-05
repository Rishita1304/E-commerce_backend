const e = require('express')
const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWTKEY, (err,user) => {
            if(err) res.status(403).json("Token is not valid!")
            req.user = user;
            next();
        })
    } else{
        res.status(401).json("You are not authenticated!")
    }
}

const verifyandAuthentication = (req,res,next) => {
    verifyToken(req,res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }
        else{
            res.status(403).json("You are not allowed!")
        }
    })
}

const verifyAndAdmin = (req,res,next) => {
    verifyToken(req,res, ()=> {
        if(req.user.isAdmin){
            next();
        }
        else{
            res.status(403).json("You are not the admin!")
        }
    })
}

module.exports = {verifyToken, verifyandAuthentication, verifyAndAdmin}