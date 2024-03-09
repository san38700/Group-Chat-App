const express = require('express');
require('dotenv').config();


const path = require('path');
const fs = require('fs')

const bodyParser = require('body-parser');
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
var cors = require('cors')


const User = require('./models/user')
const Chat = require('./models/chat')

const sequelize = require('./util/database')

const app = express();

const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

app.use(bodyParser.json({ extended: false }));
app.use(helmet())
app.use(compression())
app.use(morgan('combined', {stream: accessLogStream}))
app.use(cors())

app.use(userRoutes)
app.use(chatRoutes)


User.hasMany(Chat)
Chat.belongsTo(User)

// app.use((req,res) => {
//     console.log('url',req.url)
//     res.sendFile(path.join(__dirname,`public/${req.url}`))
// })


sequelize
    // .sync({force: true})
    .sync()
    .then(result => app.listen(3000))
    .catch(err => console.log(err))