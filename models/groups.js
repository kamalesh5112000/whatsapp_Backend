const Sequelize =require('sequelize');

const sequelize=require('../database/database');


const groups = sequelize.define('groups',{
    id:{
      type:Sequelize.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
    },
    groupName:Sequelize.STRING,
    createrName:Sequelize.STRING
  });
  
  module.exports=groups;