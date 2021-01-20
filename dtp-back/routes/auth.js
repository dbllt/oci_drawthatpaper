const express = require('express')
const router = express.Router()
const log = require('../log')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UsersDao = require('../database/dao').UsersDao
const RefreshTokensDao = require('../database/dao').RefreshTokensDao

const {
    ACCESS_TOKEN_EXPIRATION_TIME,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
} = process.env

router.post('/token', async (req, res) => {
    const refreshToken = req.body.refreshToken
    if (refreshToken == null) return res.sendStatus(401)
    const refreshTokens = await RefreshTokensDao.getAll()
    if (!refreshTokens.find(token => token.tokenValue == refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        log.debug("Refreshing a token")
        const accessToken = generateAccessToken(user)
        res.json({
            accessToken: accessToken
        })
    })
})

router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken)
    res.sendStatus(204)
})

router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body

    const users = await UsersDao.getAll();
    const user = users.find(user => user.email == email)

    if (user == null) return res.status(400).send('User not found')

    try {
        if (await bcrypt.compare(password, user.password)) {

            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user)
            res.json({
                accessToken: accessToken,
                refreshToken: refreshToken
            })

        } else {
            res.status(401).send('Incorrect password')
        }
    } catch (err) {
        log.error(err)
        res.status(500).send()
    }
})

router.post('/register', async (req, res) => {

    const {
        username,
        email,
        password
    } = req.body

    const users = await UsersDao.getAll();
    const user = users.find(user => user.email == email)
    if (user != null) return res.status(409).send('Email adress already in use')

    try {
        const hashedPassword = await bcrypt.hash(password, 10) // hashes the password with 10 rounds

        const user = {
            username: username,
            email: email,
            password: hashedPassword
        }
        UsersDao.insert(user)



        res.status(201).send("You have been registered")

    } catch (err) {
        log.error(err)
        res.status(500).send()
    }

})

function generateAccessToken(user) {
    const userForToken = {
        name: user.name
    }
    return jwt.sign(userForToken, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRATION_TIME
    })
}

function generateRefreshToken(user) {
    const userForToken = {
        name: user.name
    }
    const refreshToken = jwt.sign(userForToken, REFRESH_TOKEN_SECRET)
    RefreshTokensDao.insert(refreshToken)
    return refreshToken
}

module.exports = router