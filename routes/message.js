// stuff

app.post('/new/message', (req, res) => {
    const id = req.query.id  //document id
    const newMessage = req.body   //new message

    mongoData.update(
        { _id: id },    //filters which conversation we want to add the message to
        { $push: {conversation: newMessage} }, //push the new data in the conversation
        (err, data) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(201).send(data)  //doc created
            }
    }
    )
})
