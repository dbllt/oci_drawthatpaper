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

/**
 * Route to refresh access token
 * @returns {json} jwt access token
 */
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

/**
 * Logs out the user, actually deletes the ability to use the refresh token given at login to user
 */
router.delete('/logout', async (req, res) => {
    const refreshToken = req.body.refreshToken
    if (refreshToken == null) return res.sendStatus(401)
    const refreshTokens = await RefreshTokensDao.getAll()
    const token = refreshTokens.find(token => token.tokenValue == refreshToken)
    if (!token) return res.sendStatus(403)
    log.debug("Someone logged out")
    RefreshTokensDao.remove(token.id)
    res.sendStatus(204)
})

/**
 * Route to login, compares the password from the coresponding user in the database and sends back a response with an access token
 * @returns {json} 
 */
router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body

    const user = await UsersDao.getOneByEmail(email.toLowerCase());

    if (user == null) return res.status(400).send('User not found')

    try {
        if (await bcrypt.compare(password, user.password)) {

            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user)
            res.json({
                accessToken: accessToken,
                expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
                refreshToken: refreshToken,
                userId: user.id
            })

        } else {
            res.status(401).send('Incorrect password')
        }
    } catch (err) {
        log.error(err)
        res.status(500).send()
    }
})


/**
 * Route to register, checks if the user is already in db then hashes the password and adds the user to db
 * @returns {json} 
 */
router.post('/register', async (req, res) => {

    const {
        username,
        email,
        password
    } = req.body

    const user = await UsersDao.getOneByEmail(email.toLowerCase());
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

/**
 * Generates an access token for the specified user
 * @param {*} user 
 * @returns {string} jwt access token
 */
function generateAccessToken(user) {
    log.debug('Generating an AccessToken')
    const userForToken = {
        id: user.id,
        username: user.username,
        // email: user.email
    }
    return jwt.sign(userForToken, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRATION_TIME
    })
}

/**
 * Generates a refresh token for the specified user and adds the refresh token to db for later usage
 * @param {*} user 
 * @returns {string} jwt refresh token
 */
function generateRefreshToken(user) {
    const userForToken = {
        id: user.id,
        username: user.username,
        email: user.email
    }
    const refreshToken = jwt.sign(userForToken, REFRESH_TOKEN_SECRET)
    RefreshTokensDao.insert(refreshToken)
    return refreshToken
}

module.exports = router