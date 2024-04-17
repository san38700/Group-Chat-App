const Chat = require('../models/chat')
const ArchivedChat = require('../models/archivedchat')
const { Op, where } = require('sequelize');

//const cron = require('node-cron');

const archiveChats = async () => {

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 to represent the beginning of today

    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1); // Subtract 1 day to get the previous date
    previousDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 to represent the beginning of the previous day


    try {
        const chats = await Chat.findAll({
            where: {
              createdAt: {
                [Op.gte]: previousDate, // Get records where createdAt is greater than or equal to the beginning of the previous day
                [Op.lt]: currentDate // AND less than the beginning of today
              }
            }
          });
        
        await Chat.destroy({
            where: {
                createdAt: {
                    [Op.gte]: previousDate, // Get records where createdAt is greater than or equal to the beginning of the previous day
                    [Op.lt]: currentDate // AND less than the beginning of today
                }
              }
        })
        const chatCopies = chats.map(message => ({
            message: message.message,
            userId: message.userId,
            groupId: message.groupId,
        }));

        console.log(chatCopies);

        await ArchivedChat.bulkCreate(chatCopies);
        console.log('Messages copied successfully.');
    } catch (err) {
        console.error('Error:', err);
    }
};

module.exports = { archiveChats };

    
