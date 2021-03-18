const express = require('express');
const router = express.Router();
router.use(express.json());

var mongoData = require('../models/mongoData');

// post new channelName, mounted to /channels
router.post('/new', (req, res, next) => {   
    //Create a new channelname in frontend and post it in req.body as "channelName":"whatever_channel_name_you_prefer")    
    const dbData = req.body; //whatever we get from req body (channelName), we want to save to a variable, dbData. 

    mongoData.create(dbData, (err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)  
        }
    });
});

// get all channels. Mounted to /channels. For sidebar to display channelList
router.get('/channelList', (req, res) => {
    mongoData.find((err,data) => {
        if (err) {
            res.status(500).send(err)
        } else { 
            let channels = []           //will be sent back to frontend

            data.map((channelData) => {   //looping through the data from db, mapping out the data and grabbing id and name from channelData. Leaving out the conversations
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }

                channels.push(channelInfo) //channelInfo is now in channels
                
            })
            res.render('chat', {channel: channels} )
            //res.status(200).send(channels)  //sending array of channels (with id + name in each array-item) to frontend
        }
    })
})

// POST new message to the channel. Mounted on channels/. Example http://localhost:3000/channels/new/message?id=604caa15defd2e2148909c8a, {"message":"whatever message"}
router.post('/new/message', (req, res) => {
    const id = req.query.id  //channel id, name="id" of input element in FE
    const newMessage = req.body   //new message

    mongoData.findByIdAndUpdate({_id: id}, { $push: {conversation: newMessage} }, (err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

// GET all messages in a channel. Mounted on /channels. Example: http://localhost:3000/channels/get/conversation?id=604caa15defd2e2148909c8a
router.get('/get/conversation', (req, res) => {
    const id = req.query.id   //req.query.id to know which convo are we in. Comes from FE that makes request, and the id is passed on to this request

    mongoData.find({_id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})


module.exports = router;