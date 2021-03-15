const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const authenticate = require('./authenticate');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const channelsRouter = require('./routes/channels');

//app config
const app = express();
const port = 3000;

//db config
const url = 'mongodb://localhost:27017/slack-clone';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then((db) => {
    console.log('Connected correctly to the server')
}, (err) => { console.log(err); }); 

//set templating engine
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
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
    //console.log(req.user);

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
//app.use(express.static(path.join(__dirname, 'public'))); //static files

//rest of routes mounted to be accessible after authentication
app.use('/channels', channelsRouter);

//listen
app.listen(port, ()=> console.log(`listening on localhost:${port}`));