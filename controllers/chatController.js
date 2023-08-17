const express = require('express');
const Chats = require('../models/chats');
const { Op } = require('sequelize');
const sequelize=require('../database/database');
const S3Services = require("../services/s3service");

const cron = require('cron');

exports.sendFile = async (req, res, next)=>{
    try{
        const file = req.file.buffer;

        const filename = `${req.file.originalname}`;
        const groupId =req.body.groupId;
        console.log(filename,req.body.groupId)
        const fileUrl = await S3Services.uploadToS3(file, filename);
        //console.log(fileUrl)
        if(groupId=='null'){
            console.log("Null value")
            const result = await Chats.create({ message:fileUrl,userName:req.user.name, userId:req.user.id});
            
        }else{
            console.log("Not Null Value")
            const result = await Chats.create({ message:fileUrl,userName:req.user.name, userId:req.user.id,groupId:groupId});
            
        }
        
        res.status(202).json(fileUrl)

    }catch(err){
        console.log(err)
        res.status(202).json({success:false})
    }
}

exports.getchats=async(req,res,next)=>{
    const lastMsgId= req.query.lastMsgId;
    let grpId=req.query.groupId;
    console.log('Params Group Id',grpId)
    if(grpId=='null'){
        console.log("Null value")
        const chat=await Chats.findAll({
            attributes:['id','userName','message','userId'],
            where: { id: { [Op.gt]: lastMsgId },groupId:null}
        });
        res.json({chat:chat,cid:req.user.id})

    }else{
        console.log("Not Null Value")
        const chat=await Chats.findAll({
            attributes:['id','userName','message','userId'],
            where: { id: { [Op.gt]: lastMsgId },groupId:grpId}
        });
        res.json({chat:chat,cid:req.user.id})

    }
    
    
    
    


}
exports.addChat=async (req,res,next)=>{
    const msg = req.body.msg;
    const groupId=req.body.groupid;
    console.log("Body message :",req.body)
    try{
        if(groupId=='null'){
            console.log("Null value")
            const result = await Chats.create({ message:msg,userName:req.user.name, userId:req.user.id});
            
        }else{
            console.log("Not Null Value")
            const result = await Chats.create({ message:msg,userName:req.user.name, userId:req.user.id,groupId:groupId});
            
        }
        
        
        
        res.status(200).json({success:true})

    }catch(err){
        console.log(err)
        res.status(202).json({success:false})
    }
    
}
