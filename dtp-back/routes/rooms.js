const {
    authenticationToken
} = require('./common')
const express = require('express')
const router = express.Router()

const rooms = []
var id = 1
nextId = () => {
    return id++
}


// Get all rooms
router.get('/', authenticationToken, (req, res) => {
    res.json(rooms)
})

// Get one room
router.get('/:id', authenticationToken, (req, res) => {
    const room = rooms.find(r => req.params.id == r.id)
    if(!room) return res.status(404).send()
    res.json(room)
})

// Create a room with body:
// {
//     name: name,
// }
const crypto = require("crypto");
router.post('/', authenticationToken, (req, res) => {
    const roomName = req.body.name
    if (!roomName) return res.status(400).send('No name specified')
    
    const chatRoom = crypto.randomBytes(16).toString("hex");
    const room = {
        id: nextId(),
        name: roomName,
        chatRoom: chatRoom,
        participants: [req.user]
    }
    rooms.push(room)

    res.json(room)
})

// Join a room
router.put('/:id', authenticationToken, (req, res) => {
    const room = rooms.find(r => req.params.id == r.id)
    if(!room) return res.status(404).send()
    room.participants.push(req.user.name)
    res.json(room)
})


module.exports = router