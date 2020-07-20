const express = require('express');
//useer model

const User=require('../models/auth')
const passport=require('passport')
// bcrpypt
const bcrypt=require('bcryptjs')

const router = express.Router();
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

//post

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  //check req fields
  if (!name || !email || !password || !password2)
    errors.push({ msg: 'Please fill in all fields' });
  //match password
  if (password != password2) errors.push({ msg: 'Password do not match' });
  //check length of password
  if (password.length < 6)
    errors.push({ msg: 'Passwords should be atleast of 6 characters' });
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    //validation pass
    User.findOne({email: email})
    //user found already
    .then(user=>{
        if(user){
            errors.push({msg: 'Email is already registered'})
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
              });
        }
        else{
            const newUser=new User({
                name: name,
                email: email,
                password: password,
                password2: password2
            })
            //hash password
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err)
                    throw err
                    //set password to hashed passowrd
                    newUser.password=hash

                    //save user
                    newUser.save()
                    .then(user=>{
                        req.flash('success_msg', 'You are now registred and can log in')
                        res.redirect('/users/login')
                    })
                    .catch(err=> console.log(err))
                })
            })
        }
    })

  }
});

// login handle

router.post('/login', (req, res, next)=>{
passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
})(req, res, next)
})

router.get('/logout', (req, res)=>{
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/login')
})
module.exports = router;
