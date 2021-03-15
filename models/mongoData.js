const mongoose = require('mongoose');

const SlackSchema = mongoose.Schema({
    channelName: String,
    conversation: [
        {
            message: String,
            timestamp: String,
            user: String,
            userImage: String
        }
    ]
})

module.exports = mongoose.model('conversations', SlackSchema)