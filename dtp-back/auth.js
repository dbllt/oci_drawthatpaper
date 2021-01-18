require('dotenv').config()
const log = require('./log')
const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()

app.use(express.json())

const users = [{
    "name": "Kylo",
    "email": "anothertest@test.com",
    "password": "$2b$10$fHp51yny58xDJyBjgPfyH.W04MQ22rHYrteFbn2h50TTyJPNFvDVO"
}]

let refreshTokens = []

const {
    AUTH_PORT = 3000,
        ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET
} = process.env

app.post('/token', (req, res) => {
    const refreshToken = req.body.refreshToken
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken(user)
        res.json({
            accessToken: accessToken
        })
    })
})

app.delete('/logout', (req,res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken)
    res.sendStatus(204)
})

app.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body

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
            res.send('Not allowed')
        }
    } catch (err) {
        log.error(err)
        res.status(500).send()
    }
})

app.post('/register', async (req, res) => {

    const {
        email,
        name,
        password
    } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10) // hashes the password with 10 rounds

        const user = {
            name: name,
            email: email,
            password: hashedPassword
        }
        users.push(user)
        res.status(201).send()

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
        expiresIn: '15s'
    })
}

function generateRefreshToken(user) {
    const userForToken = {
        name: user.name
    }
    const refreshToken = jwt.sign(userForToken, REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    return refreshToken
}

app.listen(AUTH_PORT, function () {
    log.debug("Auth server running on, " + AUTH_PORT)
})