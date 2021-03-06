const io = require("./server")
const {
    GameDefault
} = require("./model/game_default");
const log = require("./log")
const RandLine = require("./model/wordpicker");

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
            case types.word_validity:
                log.debug("checking word validity " + event.data)
                this.receiveAnswer(event.userId, event.data)
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
        return this.room_manager.getRoom(this.roomId)
    }

    formatData(dataType, data) {
        return JSON.stringify({
            "type": dataType,
            "data": data
        });
    }

    sendData(dataType, data) {
        io.to(this.roomId).emit("game", this.formatData(dataType, data))
    }

    sendDataToUser(dataType, data, userId) {
        io.to(userId).emit("game", this.formatData(dataType, data))
    }

    //network
    sendPlayers() {
        let room = this.getRoom();

        room.participants.forEach(p => {
            p.score = this.score[p.id]
        })

        this.sendData(types.players, {
            "participants": room.participants
        })
    }

    sendRoundTime() {
        this.sendData(types.round, {
            "round_time": this.roundTime
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
        this.sendPlayers();
    }
    sendWordValidity(playerId, answer, good) {
        this.sendDataToUser(types.word_validity, {
            "word": answer,
            "validity": good
        }, playerId);
    }
    sendState() {
        //game over or current state
        this.sendData(types.state, {
            "state": this.state,
            "drawing_user_id": this.currentDrawer.id
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
        let generator = new RandLine('wordbank/français.txt');
        this.currentWords = [];

        let callback = (word) => {
            if (word.length < 2) {
                generator.lines(callback, 1);
                return ;
            }
            this.currentWords.push(word);
        };
        generator.lines(callback, 3);
        //this.currentWords = ["Pikachu", "Dog", "Pond"];
    }

    // test
    isCurrentPlayerConnected() {
        //throw new Error("TODO");
        return this.room_manager.isInRoom(this.roomId, this.currentDrawer.id);
    }

    isValid() {
        const room = this.room_manager.getRoom(this.roomId)
        if (!room) return false
        if (!this.room_manager.isInRoom(this.roomId, room.creator.id)) return false
        return room.participants !== null && room.participants.length >= 2
    }
}

module.exports.Game = Game;
