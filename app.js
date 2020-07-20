const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const flash=require('connect-flash')
const session=require('express-session')
const passport=require('passport')
//passport config
require('./config/passport')(passport)
//db
const db = require('./config/keys').MongoURI;

//connectmongo

mongoose
  .connect(db, { useNewUrlParser: true , useUnifiedTopology: true,})
  .then(() => console.log('connected'))
  .catch((err) => console.log(err));
//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body[arser]

app.use(express.urlencoded({extended: false}))
//session

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }))
//passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // connect flash
  app.use(flash())

//global vars

app.use((req, res, next)=>{
res.locals.success_msg=req.flash('success_msg')
res.locals.error_msg=req.flash('error_msg')
res.locals.error=req.flash('error_msg')
next()
})
//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//listen port
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on ${PORT}`));
