const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Group = sequelize.define('groups', {
    id : {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    groupname:{
        type:Sequelize.STRING,
        unique: false
    },
    creatorId :{
        type:Sequelize.INTEGER
    }
})

module.exports = Group