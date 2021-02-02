const {
    authenticationToken
} = require("./common")
const express = require("express")
const router = express.Router()

const RoomManager = require("../rooms")


// Get all rooms
router.get("/", authenticationToken, (req, res) => {
    res.json(RoomManager.getRooms())
})

// Get one room
router.get("/:id", authenticationToken, (req, res) => {
    const room = RoomManager.getRoom(req.params.id)
    if (!room) return res.status(404).send()
    res.json(room)
})

// Create a room 
router.post("/", authenticationToken, (req, res) => {
    const roomName = req.body.name
    if (!roomName) return res.status(400).send("No name specified")
    const room = RoomManager.createRoom(roomName, req.user)
    res.json(room)
})

// Join a room
router.put("/:id", authenticationToken, (req, res) => {
    const room = RoomManager.getRoom(req.params.id)
    if (!room) return res.status(404).send("Room not found")
    const alreadyInRoom = room.participants.find(p => p.id == req.user.id)
    if (alreadyInRoom) return res.status(400).send("User already in the room")
    res.json(room)
})

module.exports = router