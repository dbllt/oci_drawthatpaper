const {
    Game
} = require("../game")
const log = require('../log')

class GameManager {
    constructor() {
        if (GameManager.exists) {
            return GameManager.instance
        }
        // Instance don't exist, initialisation of GameManager
        this._games = {}

        GameManager.instance = this
        GameManager.exists = true
        return this
    }

    /**
     * Creates a game 
     * @param {*} roomId 
     */
    createGame(roomId) {
        this._games[roomId] = new Game(roomId, 5, 60)
    }

    /**
     * Sends the event to the running game
     * @param {*} event 
     * @param {*} roomId 
     */
    processEvent(event, roomId) {
        if(!this._games[roomId]) return log.error("processEvent: Game don't exist")
        this._games[roomId].processEvent(event)
    }

}

module.exports.GameManager = GameManager