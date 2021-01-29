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
function Game(id, nbTurns, roundTimeInSeconds) {
    //TODO function for return value
    let roomId = id;

    let roundTime = roundTimeInSeconds;
    let turns = nbTurns;
    var currentTurn = 0;
    var currentDrawerId = 0;
    var currentDrawer;
    var currentWord = null;
    var state = GameStates.Starting;
    // le timer du tour
    var _timer = null;

    //le jeu est mis à jour tous les 100 ms
    let _tick = setInterval(this._update, 100);

    return {
        _getRoom: function() {
            //TODO prevent calling find each time isValid() is called because it's overkill
            //TODO Checks if room exists
            return rooms.rooms.find(r => this.roomId === r.id);
        },

        //network
        sendPlayers: function() {
            io.to(this._getRoom()).send({});
        },
        sendRoundTime: function() {
            io.to(this._getRoom()).send({"round-time":roundTime});
        },
        sendCurrentDrawer: function() {
            io.to(this._getRoom()).send({"drawer":currentDrawer});
        },
        sendNextWord: function() {
            io.to(this._getRoom()).send({"word":currentWord});
        },
        sendPoints: function() {
            //io.to(this._getRoom()).send({"points":});
        },
        sendWordValidity: function(playerId, answer, good) {
            //io.to(this._getRoom()).send({"word":currentWord});
        },
        sendState: function() {
            //game over or current state
            io.to(this._getRoom()).send({"state": this.state});
        },

        receiveWord: function(playerId, word) {
            if (this.state !== GameStates.Picking) {
                if (this.currentDrawer === playerId) {
                    this.currentWord = word;
                } else {
                    //error non drawer can't select word
                }
            }
        },
        receiveAnswer: function(playerId, answer) {
            if (this.state !== GameStates.Drawing) {
                if (this.currentDrawer !== playerId) {
                    this.currentWord = word;
                    //checks validity
                    let validity = answer.toLowerCase() === this.currentWord.toLowerCase();
                    this.sendWordValidity(playerId, answer, validity);
                    //TODO Hamming distance
                } else {
                    //error drawer can't anwser
                }
            }
        },

        // test
        isCurrentPlayerConnected: function() {
            const room = this._getRoom();
            return room.participants !== null && room.participants.has(this.currentDrawerId);
        },

        /**
         * Checks if game room is not in invalid state.
         * isValid <=> true (PlayerCount > 2) or (ConnectedPlayer > 2)
         *
         */
        isValid: function() {

            return room.participants !== null && room.participants.length >= 2;
        },

        isEnded: function() {
            return state === GameStates.Ended || state === GameStates.Terminating || !this.isValid();
        },

        // update
        _update: function() {
            // on vérifie toujours en premier lieu l'état de validité
            if (!this.isValid()) {
                this.terminate();
            }
            switch (state) {
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
        },

        // game states methods (graphe d'état)
        _starting: function() {
            this.sendPlayers();
            this.sendRoundTime();
            this.sendPoints();
            state = GameStates.NextPlayer;
        },
        _clearTurn: function() {
          this.currentWord = null;
          if (this._timer !== null) {
              clearTimeout(_timer);
              this._timer = null;
          }
        },
        _nextPlayer: function() {
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
            state = GameStates.Picking;
        },
        _picking: function() {
            if (this.state !== GameStates.Picking) {
                return ; // error
            }

            // on vérifie que le joueur courrant est connecté sinon on attend pour rien
            if (this.isCurrentPlayerConnected()) {
                if (this.currentWord !== null) {
                    // le mot a été selectionné alors on dessine
                    this.sendNextWord();
                    state = GameStates.Drawing;
                }
            } else {
                // on change de joueur
                state = GameStates.NextPlayer;
            }
        },
        _drawing: function() {
            if (this.state !== GameStates.Drawing) {
                return ; //error
            }

            // on vérifie que le joueur courrant est connecté sinon on attend pour rien
            if (this.isCurrentPlayerConnected()) {
                if (this._timer === null) {
                    // appelé une fois
                    this._timer = setTimeout(this._afterDrawing, roundTime / 1000.0);
                }
            } else {
                // on change de joueur
                state = GameStates.NextPlayer;
            }
        },
        _nextTurn: function() {
            this.sendPoints();

            if (!this.isEnded()) {
                currentTurn = currentTurn + 1;
                // il n'y a plus de tour on arrête la partie
                if (currentTurn >= turns) {
                    state = GameStates.Ended;
                }
            }
        },
        _afterDrawing: function() {
            if (this.state !== GameStates.Drawing) {
                return ; //error
            }

            this._nextTurn();

            state = GameStates.NextPlayer;
        },
        _ended: function() {
            this.sendGameOver();
            this.terminate();
        },
        terminate: function() {
            if (this.state === GameStates.Terminating) {
                return ; //error
            }

            state = GameStates.Terminating;
            clearTimeout(_tick);
            this._clearTurn();
        },
    }
}
