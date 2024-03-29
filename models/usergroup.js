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
    }
})

module.exports = UserGroup