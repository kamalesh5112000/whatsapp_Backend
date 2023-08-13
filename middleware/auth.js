const jwt = require('jsonwebtoken');
const User= require('../models/users');

const authenticate=(req,res,next)=>{
    try{
        const token=req.headers.authorization
        const user=jwt.verify(token,'secretkey')
        console.log("auth",user.userId)
        User.findByPk(user.userId).then(user=>{
            console.log(JSON.stringify(user));
            req.user=user;
            next();
        })

    }catch(err){
        console.log(err)
        return res.status(401).json({success:false})
    }
}

module.exports={
    authenticate
}