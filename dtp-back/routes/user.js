const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

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

function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = router