const { response } = require('express');
const express = require('express');
const router = express.Router();
router.use(express.json());

//GET mounted to /upload-photo
router.get('/upload-photo', (req, res) => {
    response.render('photoUpload')
})

//POST mounted to /upload-photo
router.post('/', (req, res) => {
    try {
        if (req.files) { //success
            let photo = req.files.photo //use the name of the input field (i.e. <input type="file" name = "avatar" .../> -> avatar) to retrieve the uploaded file
            let photo_path = './uploads/' + photo.name
            photo.mv(photo_path)   // use the mv() method to place the file in upload directory (i.e "uploads") on server

            res.render('photoUploaded', {photo_path: photo_path} )
        } else {
            res.send({ //Failure
                status: false,
                message: 'No file uploaded'
            })
        }

    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;