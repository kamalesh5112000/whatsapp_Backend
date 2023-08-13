const express = require('express');
const Chats = require('../models/chats');
const { Op } = require('sequelize');
const sequelize=require('../database/database');

exports.getchats=async(req,res,next)=>{
    const lastMsgId= req.query.lastMsgId;
    let grpId=req.query.groupId;
    if(grpId==undefined){
        grpId=null
    }
    console.log('Params Grou Id',grpId)
    const chat=await Chats.findAll({
        attributes:['id','userName','message','userId'],
        where: { id: { [Op.gt]: lastMsgId },groupId:grpId}
    });
    console.log(chat)
    res.json({chat:chat,cid:req.user.id})


}
exports.addChat=async (req,res,next)=>{
    const msg = req.body.msg;
    const groupId=req.body.groupid;
    console.log(msg,groupId)
    try{
        if(groupId=='null'){
            console.log("Null value")
            const result = await Chats.create({ message:msg,userName:req.user.name, userId:req.user.id});
            
        }else{
            console.log("Not Null Value")
            const result = await Chats.create({ message:msg,userName:req.user.name, userId:req.user.id,groupId:groupId});
            
        }
        
        
        
        res.status(200).json(result)

    }catch(err){
        console.log(err)
        res.status(202).json({success:false,error:err})
    }
    
}
