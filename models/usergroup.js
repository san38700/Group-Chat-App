const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const UserGroup = sequelize.define('usergroup', {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    role:{
        type:Sequelize.STRING,
    },
    username: {
        type:Sequelize.STRING
    },
    groupname:{
        type:Sequelize.STRING
    }

})

module.exports = UserGroup