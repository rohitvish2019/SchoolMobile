const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const expressLayouts = require('express')
const mongoose = require('mongoose');
const db = require('./config/dbConnection');

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const ejs = require('ejs');
const MongoStore = require('connect-mongo')
const { request, urlencoded } = require('express');
const port = 80;

const flash = require('connect-flash');
const customMiddleWare = require('./config/middleware');

app.use(cookieParser());


app.set('view engine', 'ejs');
app.set('views','./views');

app.use(express.urlencoded({extended:true}));

app.use(express.static('./assets'));
app.use(cookieParser());

/*
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
*/


app.use(session({
    name: 'EmployeeReview',
    // TODO change the secret before deployment in production mode
    secret: 'getitDone',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store:MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/employee_reviews',
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(flash());
app.use(customMiddleWare.setFlash);

app.use(passport.initialize());
app.use(passport.session());
app.use(passportLocal.setAuthenticatedUser);



app.use('/', require('./routers/index'));

app.listen(port, function(err){
    if(err){
        console.log("Error starting server");
        return;
    }
    console.log("Server started on port "+port);
});
