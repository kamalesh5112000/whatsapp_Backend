const express = require('express');
const User = require('../models/users');
const sequelize=require('../database/database');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');





function generateAccessToken(id,nam){
    return jwt.sign({ userId:id,name: nam},'secretkey')

}
async function emailValidate(email,phone){
    let emailflag=false;
    let phoneflag=false;
    let userobj=false;
    const user=await User.findAll({where: {email:email}})
    if(user.length>0){
            if(user[0].phone==phone){
                phoneflag=true
            }else{
                emailflag=user[0].email
                phoneflag = user[0].phone
                userobj=user
            }
    }else{
        console.log("No User Found",user)
    }
    console.log("data returned")
    return [emailflag,phoneflag,userobj];
}
exports.addUser=async (req,res,next)=>{
    try{
        const nam = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        console.log(nam,email,phone,password)
        
        const [emailflag,phoneflag]=await emailValidate(email,phone)
        console.log(emailflag,phoneflag)
        if(emailflag){
            res.status(202).json({message:"Email Already Exists"})
        }else if(phoneflag){
            res.status(203).json({message:"Phone Already Exists"})

        }
         else{
            const saltrounds=10;
            bcrypt.hash(password,saltrounds,async(err,hash)=>{
                console.log(err)
                await User.create({
                    name:nam,
                    email:email,
                    phone:phone,
                    password:hash
            
                })
                 res.status(205).json({message:'User Created Successfully'})
            })
        }

    }catch(err){
        console.log(err)
        res.status(202).json({message:err})
    }
    
    
}

exports.loginUser=async (req,res,next)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const [emailflag,passwordflag,userobj]=await emailValidate(email,password)

        
        if(emailflag){
            const userPassword=userobj[0].password;
            bcrypt.compare(password,userPassword,(err,response)=>{
                if(!err){
                    if(response){
                        res.status(203).json({message:"Successfully Logged In",token:generateAccessToken(userobj[0].id,userobj[0].name)})
                    }else{
                        res.status(201).json({message:"Password Incorrect"})
        
                    }
                }else{
                    console.log(err)
                }

            })
            console.log("User Exit")
        }else{
            console.log('No User Found')
            res.status(202).json({message:"Email Doesn't Exists"})

        }

    }catch(err){
    }
}