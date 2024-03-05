const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const User = sequelize.define('users', {
    id : {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type:Sequelize.STRING,
        unique: false
    },
    email: {
        type:Sequelize.STRING,
        unique: true
    },
    number:{
        type:Sequelize.BIGINT,
        unique:true
    },
    password : {
        type:Sequelize.STRING,
        unique:false
    }
})

module.exports = User