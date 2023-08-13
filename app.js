const express= require('express');
const dotenv=require('dotenv');
dotenv.config();
const cors = require('cors');

const path = require('path');
const fs=require('fs');
const bodyParser=require('body-parser');
const sequelize=require('./database/database');
const user = require('./models/users');
const chats = require('./models/chats');
const groups=require('./models/groups');
const userGroup=require('./models/userGroup');
const userRoute=require('./routes/userRoute')
const chatRoute=require('./routes/chatRoute');
const groupRoute=require('./routes/groupRoute');

const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(cors({
    origin:"*",
    credentials:true
}));

app.use(userRoute)
app.use(chatRoute)
app.use(groupRoute)


app.use((req,res)=>{
    
    res.sendFile(path.join(__dirname,`views/${req.url}`))
    console.log("Url :",req.url)
})

user.hasMany(chats);
chats.belongsTo(user);

groups.hasMany(chats);

user.belongsToMany(groups, { through: userGroup }); // Corrected association
groups.belongsToMany(user, { through: userGroup }); // Corrected association
groups.belongsTo(user)
userGroup.belongsTo(user);
userGroup.belongsTo(groups);


sequelize.sync().then(result => {
    //console.log(result);
    app.listen(process.env.PORT || 3000);
}).catch(err => console.log(err));