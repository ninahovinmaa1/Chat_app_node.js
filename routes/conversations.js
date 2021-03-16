const express = require('express');
const router = express.Router();
router.use(express.json());

app.get('/get/conversation', (req, res) => {
    const id = req.query.id   //req.query.id to know which convo are we in. Comes from React router that makes request, and the id is passed on to this request

    mongoData.find({_id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})