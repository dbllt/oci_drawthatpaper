const { authenticationToken } = require('./common')
const express = require('express')
const router = express.Router()


const UsersDao = require('../database/dao').UsersDao

const log = require('../log')


// Getting all
// Getting one
// Creating one
// Updating one
// Deleting one

router.get('/info', authenticationToken, (req, res) => {
    res.json(req.user)
})

router.patch('/update', authenticationToken, (req, res) => {
    res.json(req.user)
})


module.exports = router