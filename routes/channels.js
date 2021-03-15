const express = require('express');
const router = express.Router();
router.use(express.json());

var mongoData = require('../models/mongoData');
//const bodyParser = require('body-parser');

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

// get all channels. Mounted to /channels
router.get('/channelList', (req, res) => {
    mongoData.find((err,data) => {
        if (err) {
            res.status(500).send(err)
        } else { 
            let channels = []           //will be sent back to frontend

            data.map((channelData) => {   //looping through the data mapping out the data and grabbing id and name from channelData. Leaving out the conversations
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }

                channels.push(channelInfo)
            })
            console.log(channels)
            res.status(200).send(channels)  //sending array of channels (with id + name in each array-item) to frontend
        }
    })
})

module.exports = router;