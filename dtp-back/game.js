const io = require("./server")
const {
    GameDefault
} = require("./model/game_default");
const RoomManager = require("./rooms");
const log = require("./log")

const types = {
    players: "players",
    state: "state",
    round: "round",
    next_word: "next_word",
    score: "score",
    word_validity: "word_validity",
    pick: "pick"
}

// Init        New turn       Current    Over     Clean
// Starting => NextPlayer <=> Drawing => Ended => Terminated

class Game extends GameDefault {
    constructor(id, nbTurns, roundTimeInSeconds) {
        super(id, nbTurns, roundTimeInSeconds);
    }

    processEvent(event) {
        log.debug(event)
        switch (event.type) {
            case types.pick:
                log.debug("picked " + event.data)
                this.receiveWord(event.userId, event.data)
                break
        }
    }

    init() {
        //throw new Error("TODO");
    }

    destroy() {
        //throw new Error("TODO");
    }

    getRoom() {
        //throw new Error("TODO");
        //TODO prevent calling find each time isValid() is called because it"s overkill
        //TODO Checks if room exists
        return RoomManager.getRoom(this.roomId)
    }

    sendData(dataType, data) {
        var data = JSON.stringify({
            "type": dataType,
            "data": data
        });
        io.to(this.roomId).emit("game", data)
    }

    //network
    sendPlayers() {
        let room = this.getRoom();
        this.sendData(types.players, {
            "participants": room.participants
        })
    }
    sendRoundTime() {
        this.sendData(types.round, {
            "round-time": this.roundTime
        });
    }
    sendCurrentDrawer() {
    // useless ?
    }
    sendNextWord() {
        this.sendData(types.next_word, {
            "word": this.currentWord
        });
    }
    sendScore() {
        this.sendData(types.score, {
            "points": this.points
        });
    }
    sendWordValidity(playerId, answer, good) {
        this.sendData(types.word_validity, {
            "word": answer,
            "playerId": playerId,
            "validity": good
        });
    }
    sendState() {
        //game over or current state
        this.sendData(types.state, {
            "state": this.state
        });
    }
    sendPickingWords() {
        this.sendData(types.pick, {
            "words": this.currentWords,
            "drawing_user_id": this.currentDrawer.id
        });
    }

    checksWord(word) {
        //throw new Error("TODO");
        return word.toLowerCase() === this.currentWord.toLowerCase();
    }

    generateWords() {
        //throw new Error("TODO");
        this.currentWords = ["Pikachu", "Dog", "Pond"];
    }

    // test
    isCurrentPlayerConnected() {
        //throw new Error("TODO");
        return RoomManager.isInRoom(this.roomId, this.currentDrawer.id);
    }

    isValid() {
        //throw new Error("TODO");
        // return true;
        return RoomManager.isValid(this.roomId);
    }
}

module.exports.Game = Game;