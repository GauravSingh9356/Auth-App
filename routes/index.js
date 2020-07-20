const express = require('express');

const router = express.Router();
const { ensureAuthenticated }=require('../config/auth')
//welcome page
router.get('/', (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) => {
let name=req.user.name
res.render('dashboard', {
    name: name
}
)
});
module.exports = router;
