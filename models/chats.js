const Sequelize =require('sequelize');

const sequelize=require('../database/database');


const chats = sequelize.define('chats',{
    id:{
      type:Sequelize.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
    },
    message:Sequelize.STRING,
    userName:Sequelize.STRING
  });
  
  module.exports=chats;