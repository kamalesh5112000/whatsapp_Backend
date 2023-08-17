const express= require('express');
const dotenv=require('dotenv');
dotenv.config();
const cors = require('cors');

const http = require('http'); // Import the 'http' module
const socketIo = require('socket.io');


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
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server,{
    cors:{
        origin:['http://localhost:3000'],
    },
});

app.use(bodyParser.json({ extended: false }));
app.use(cors({
    origin:"*",
    credentials:true
}));

app.use(userRoute)
app.use(chatRoute)
app.use(groupRoute)

app.use('/socket.io', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')));

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
    server.listen(process.env.PORT || 3000, () => {
        console.log('Server listening on port 3000');
    });
}).catch(err => console.log(err));

io.on('connection', (socket) => {
    console.log("Socket Id :",socket.id);

    // Handle messages
    socket.on('sendMessage', (data) => {
        try {
            socket.join(data.groupId)
            io.to(data.groupId).emit('receiveMessage', data);
            console.log(data);
        } catch (error) {
          console.error('Error occurred while emitting receiveMessage event:', error);
        }
      });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
})