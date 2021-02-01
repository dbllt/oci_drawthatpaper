const rooms = require("./routes/rooms")
const io = require("./server")
const {GameDefault} = require("./model/game_default");

// Init        New turn       Current    Over     Clean
// Starting => NextPlayer <=> Drawing => Ended => Terminated

class Game extends GameDefault {
    constructor(id, nbTurns, roundTimeInSeconds) {
        super(id, nbTurns, roundTimeInSeconds);
    }

    init() {
        //throw new Error('TODO');
        io.to(this.roomId).on('selection', packet => this.receiveWord(packet.player, packet.word));
        io.to(this.roomId).on('answering', packet => this.receiveAnswer(packet.player, packet.answer));
    }

    destroy() {
        //throw new Error('TODO');
        io.to(this.roomId).off('selection');
        io.to(this.roomId).on('answering');
    }

    getRoom() {
        //throw new Error('TODO');
        //TODO prevent calling find each time isValid() is called because it's overkill
        //TODO Checks if room exists
        return rooms.rooms.find(r => this.roomId === r.id);
    }

    //network
    sendPlayers() {
        let room = this.getRoom();
        io.to(room.name).emit('players',{"participants": room.participants});
    }
    sendRoundTime() {
        io.to(this.getRoom().name).emit('round',{"round-time":this.roundTime});
    }
    sendCurrentDrawer() {
        io.to(this.getRoom().name).emit('current-drawer',{"drawer":this.currentDrawer});
    }
    sendNextWord() {
        io.to(this.getRoom().name).emit('next-word',{"word":this.currentWord});
    }
    sendScore() {
        io.to(this.getRoom().name).emit('score',{"points":this._points});
    }
    sendWordValidity(playerId, answer, good) {
        io.to(this.getRoom().name).send('word-validity', {"word":answer, "validity":good});
    }
    sendState() {
        //game over or current state
        io.to(this.getRoom().name).emit('players',{"state": this.state});
    }
    sendPickingWords() {
        io.to(this.getRoom().name).emit('pick',{"words": this.currentWords});
    }

    checksWord(word) {
        //throw new Error('TODO');
        return word.toLowerCase() === this.currentWord.toLowerCase();
    }

    generateWords() {
        //throw new Error('TODO');
        this.currentWords = ["Pikachu", "Dog", "Pond"];
    }

    // test
    isCurrentPlayerConnected() {
        //throw new Error('TODO');
        const room = this.getRoom();
        return room.participants !== null && room.participants.has(this.currentDrawerId);
    }

    isValid() {
        //throw new Error('TODO');
        let room = this.getRoom();
        return room.participants !== null && room.participants.length >= 2;
    }
}

new Game(0, 6, 100);

