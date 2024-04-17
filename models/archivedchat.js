const Sequelize = require('sequelize')

const sequelize = require('../util/database')
const Group = require('./group')

const ArchivedChat = sequelize.define('archivedchats', {
    id : {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message:{
        type:Sequelize.STRING,
        unique: false
    },
    userId: {
        type:Sequelize.INTEGER,
        unique: false
    },
    groupId: {
        type: Sequelize.INTEGER,
        unique: false
    }
})

module.exports = ArchivedChat