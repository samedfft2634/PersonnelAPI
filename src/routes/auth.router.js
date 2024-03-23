"use strict"
/* ====================================================== */
/*                 EXPRESS - Personnel API                */
/* ====================================================== */
const router = require('express').Router()
/* ====================================================== */
const auth = require('../controllers/auth.controller')
/* ====================================================== *
{
    "username": "testF0",
    "password": "1234",
}
/* ====================================================== */

// URL: /auth

// Login/logout:
router.post('/login', auth.login)
// router.all('/logout', auth.logout)
router.get('/logout', auth.logout)

/* ====================================================== */

module.exports = router