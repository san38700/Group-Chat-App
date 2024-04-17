const express = require('express');
require('dotenv').config();


const path = require('path');
const fs = require('fs')

const cron = require('node-cron');


const bodyParser = require('body-parser');
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
var cors = require('cors')


const User = require('./models/user')
const Chat = require('./models/chat')
const Group = require('./models/group')
const UserGroup = require('./models/usergroup')
const ForgotPasswordRequest = require('./models/forgotpassword')

const socketIo = require('./controllers/socketserver')

const sequelize = require('./util/database')

const app = express();

const server = require('http').createServer(app); // Create HTTP server
const io = socketIo(server); // Initialize Socket.IO with the HTTP server
module.exports = io

//app.use('/socket.io', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')));


const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group')
const passwordRoutes = require('./routes/forgotpassword')
const multimediaFileRoutes = require('./routes/multimediafile')
const { archiveChats } = require('./controllers/archivedchat')
const { group } = require('console');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

app.use(bodyParser.json({ extended: false }));
//app.use(helmet())
app.use(compression())
app.use(morgan('combined', {stream: accessLogStream}))
app.use(cors())

app.use(userRoutes)
app.use(chatRoutes)
app.use(groupRoutes)
app.use(passwordRoutes)
app.use(multimediaFileRoutes)


User.hasMany(Chat)
Chat.belongsTo(User)

User.belongsToMany(Group, { through: UserGroup })
Group.belongsToMany(User, { through: UserGroup })

Group.hasMany(Chat)
Chat.belongsTo(Group)

User.hasMany(ForgotPasswordRequest)
ForgotPasswordRequest.belongsTo(User)

cron.schedule('0 0 * * *', async () => {
    console.log('Cron job executed at:', new Date().toLocaleString());
    await archiveChats();
});

app.use((req,res) => {
    console.log('url',req.url)
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})


sequelize
    // .sync({force: true})
    .sync()
    .then(result => server.listen(3000))
    .catch(err => console.log(err))

