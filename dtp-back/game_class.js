const rooms = require("./routes/rooms")
const io = require("./server")


const GameStates = Object.freeze({
    Starting:1, // S
    NextPlayer:2, // Select player then player send word

    Picking:3,
    Drawing:4,

    Ended:5,
    Terminating:6
});
// Init        New turn       Current    Over     Clean
// Starting => NextPlayer <=> Drawing => Ended => Terminated

////TODO ATTENTION ON CHANGE D'ETAT SEULEMENT DANS LES FONCTIONS D'ETAT
////TODO PAS DANS LES FONCTIONS D'ENVOI ET DE RECEPTION
class GameObject {
    constructor(id, nbTurns, roundTimeInSeconds) {
        io.to(this.roomId).on('selection', packet => this.receiveWord(packet.player, packet.word));
        io.to(this.roomId).on('answering', packet => this.receiveAnswer(packet.player, packet.answer));
        this.roomId = id;
        this.roundTime = roundTimeInSeconds;
        this.turns = nbTurns;
    }

    roomId = 0;
    roundTime = 0;
    turns = 0;

    currentTurn = 0;
    currentDrawerId = 0;
    currentDrawer;
    currentWord="";
    state = GameStates.Starting;
    // le timer du tour
    _timer = null;

    static TURN_DURATION_IN_SEC = 100;
    _tick = setInterval(this._update, GameObject.TURN_DURATION_IN_SEC * 1000);

    _points = {};

    _getRoom() {
        //TODO prevent calling find each time isValid() is called because it's overkill
        //TODO Checks if room exists
        return rooms.rooms.find(r => this.roomId === r.id);
    }

    //network
    sendPlayers() {
        let room = this._getRoom();
        io.to(room.name).emit('players',{"participants": room.participants});
    }
    sendRoundTime() {
        io.to(this._getRoom().name).emit('round',{"round-time":this.roundTime});
    }
    sendCurrentDrawer() {
        io.to(this._getRoom().name).emit('current-drawer',{"drawer":this.currentDrawer});
    }
    sendNextWord() {
        io.to(this._getRoom().name).emit('next-word',{"word":this.currentWord});
    }
    sendScore() {
        io.to(this._getRoom().name).emit('score',{"points":this._points});
    }
    sendWordValidity(playerId, answer, good) {
        io.to(this._getRoom().name).send('word-validity', {"word":answer, "validity":good});
    }
    sendState() {
        //game over or current state
        io.to(this._getRoom().name).emit('players',{"state": this.state});
    }

    receiveWord(playerId, word) {
        if (this.state !== GameStates.Picking) {
            if (this.currentDrawer === playerId) {
                this.currentWord = word;
            } else {
                //error non drawer can't select word
            }
        }
    }
    receiveAnswer(playerId, answer) {
        if (this.state !== GameStates.Drawing) {
            if (this.currentDrawer !== playerId) {
                //checks validity
                let validity = this._checksWord(answer);
                this.sendWordValidity(playerId, answer, validity);
                //TODO Hamming distance
            } else {
                //error drawer can't anwser
            }
        }
    }

    _checksWord(word) {
        return word.toLowerCase() === this.currentWord.toLowerCase()
    }

    // test
    isCurrentPlayerConnected() {
        const room = this._getRoom();
        return room.participants !== null && room.participants.has(this.currentDrawerId);
    }

    /**
     * Checks if game room is not in invalid state.
     * isValid <=> true (PlayerCount > 2) or (ConnectedPlayer > 2)
     *
     */
    isValid(){
        let room = this._getRoom();
        return room.participants !== null && room.participants.length >= 2;
    }

    isEnded() {
        return this.state === GameStates.Ended || this.state === GameStates.Terminating || !this.isValid();
    }

    // update
    _update() {
        // on vérifie toujours en premier lieu l'état de validité
        if (!this.isValid()) {
            this.terminate();
        }

        switch (this.state) {
            case GameStates.Starting: {
                this._starting();
            } break;

            case GameStates.NextPlayer: {
                this._nextPlayer();
            } break;

            case GameStates.Picking: {
                this._picking();
            } break;

            case GameStates.Drawing: {
                this._drawing();
            } break;

            case GameStates.Ended: {
                this._ended();
            } break;
        }
        this.sendState();
    }

    // game states methods (graphe d'état)
    _starting() {
        this.sendPlayers();
        this.sendRoundTime();
        this.sendScore();
        this.state = GameStates.NextPlayer;
    }
    _clearTurn() {
      this.currentWord = "";
      if (this._timer !== null) {
          clearTimeout(this._timer);
          this._timer = null;
      }
    }
    _nextPlayer() {
        if (this.state !== GameStates.NextPlayer) {
            return ; //error
        }
        this._clearTurn();

        //joueur suivant
        this.currentDrawerId = this.currentDrawerId + 1;
        const room = this._getRoom();
        this.currentDrawer = room.participants[this.currentDrawerId % room.participants.length];

        //on met à jour le joueur suivant
        this.sendCurrentDrawer();
        this.state = GameStates.Picking;
    }
    _picking() {
        if (this.state !== GameStates.Picking) {
            return ; // error
        }

        // on vérifie que le joueur courrant est connecté sinon on attend pour rien
        if (this.isCurrentPlayerConnected()) {
            if (this.currentWord !== "") {
                // le mot a été selectionné alors on dessine
                this.sendNextWord();
                this.state = GameStates.Drawing;
            }
        } else {
            // on change de joueur
            this.state = GameStates.NextPlayer;
        }
    }

    _drawing() {
        if (this.state !== GameStates.Drawing) {
            return ; //error
        }

        // on vérifie que le joueur courrant est connecté sinon on attend pour rien
        if (this.isCurrentPlayerConnected()) {
            if (this._timer === null) {
                // appelé une fois
                this._timer = setTimeout(this._afterDrawing, this.roundTime / 1000.0);
            }
        } else {
            // on change de joueur
            this.state = GameStates.NextPlayer;
        }
    }
    _nextTurn() {
        this.sendScore();

        if (!this.isEnded()) {
            this.currentTurn = this.currentTurn + 1;
            // il n'y a plus de tour on arrête la partie
            if (this.currentTurn >= this.turns) {
                this.state = GameStates.Ended;
            }
        }
    }
    _afterDrawing() {
        if (this.state !== GameStates.Drawing) {
            return ; //error
        }

        this._nextTurn();

        this.state = GameStates.NextPlayer;
    }
    _ended() {
        this.sendScore();
        this.state = GameStates.Terminating;
    }

    /**
     * Makes this game unusable:
     * - Internal state = Terminating
     * Clean all:
     * - Internal state
     * - Clear all Timeouts
     */
    terminate() {
        if (this.state === GameStates.Terminating) {
            return; //error
        }

        this.state = GameStates.Terminating;
        clearTimeout(this._tick);
        this._clearTurn();

        io.to(this.roomId).off('selection');
        io.to(this.roomId).on('answering');
    }
}
