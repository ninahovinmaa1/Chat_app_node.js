const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const authenticate = require('./authenticate');
const fileUpload = require('express-fileupload');
const socket = require('socket.io');

//require models
var mongoData = require('./models/mongoData');

//require routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const channelsRouter = require('./routes/channels');
const photosRouter = require('./routes/photos');

//app config
const app = express();
const port = 3000;

//db config
const url = 'mongodb://localhost:27017/slack-clone';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});

connect.then((db) => {
    console.log('Connected correctly to the server')
}, (err) => { console.log(err); }); 

//set templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }))
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

//pre-auth routes mounted
app.use('/', indexRouter);
app.use('/users', usersRouter);

//authentication
function auth(req, res, next) {

    if (!req.user) {
        var err = new Error('You are not authenticated!');
        err.status = 403;
        next(err);
    }
    else {
        next();
    }
}

app.use(auth);

//rest of routes mounted to be accessible after authentication
app.use('/channels', channelsRouter);
app.use('/upload-photo', photosRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')) ) //static files, photos in uploads
app.use('/public', express.static(path.join(__dirname, 'public')) ) //static files

//listen
const server = app.listen(port, ()=> console.log(`listening on localhost:${port}`));

///////chat BE////////

//socket setup
const io = socket(server); //initializes a new instanse of socket.io by passing the server object.

    //listen to connections events for incoming sockets. When someone connects to our app.
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('chat message', (data) => { //data includes message+channelId from FE, this is sent to server. Here server processes the data
            let message = data.inputValue
            let channelId = data.channelId
            let conversation = { message : message }

            //save msg to db
            mongoData.findByIdAndUpdate({ _id: channelId }, { $push: {conversation: conversation}}, {new: true})
                .then((res) => {
                    console.log(res)
                    io.emit('chat message', message)
                })
        });

        socket.on('disconnect', () => {
            console.log("User disconnected")
        })
    })


