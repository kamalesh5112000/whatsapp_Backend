const Sequelize=require('sequelize');
const dotenv=require('dotenv');
dotenv.config();

console.log("DATABASE NAME:" ,process.env.DB_HOST)
console.log("DATABASE NAME:" ,process.env.DB_NAME)
const sequelize=new Sequelize(process.env.DB_NAME,process.env.CONNECTION_NAME,process.env.CONNECTION_PASSWORD,{dialect:'mysql',host:process.env.DB_HOST});
module.exports=sequelize;