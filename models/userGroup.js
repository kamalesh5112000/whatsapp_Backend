const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/database');


const UserGroup = sequelize.define('UserGroup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    joinedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    isAdmin:{
        type:DataTypes.BOOLEAN
    }
   
});


module.exports = UserGroup;
