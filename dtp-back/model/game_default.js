/*jshint esversion: 6 */
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
const GameStates = Object.freeze({
    Starting: 1, // S
    NextPlayer: 2, // Select player then player send word

    Picking: 3,
    Drawing: 4,

    Ended: 5,
    Terminating: 6
});
// Init        New turn       Current    Over     Clean
// Starting => NextPlayer <=> Drawing => Ended => Terminated

////TODO ATTENTION ON CHANGE D'ETAT SEULEMENT DANS LES FONCTIONS D'ETAT
////TODO PAS DANS LES FONCTIONS D'ENVOI ET DE RECEPTION
class GameDefault {

    constructor(id, nbTurns, roundTimeInSeconds) {
        // room manager init to avoid circular dependency
        const {
            RoomManager
        } = require("./room_manager")
        this.room_manager = new RoomManager()

        // game data
        this.roomId = id;
        this.roundTime = roundTimeInSeconds * 1000;
        this.turns = nbTurns;

        // turn data
        this.currentTurn = 0;
        this.currentDrawerTurn = 0;
        this.currentDrawer = {};
        this.currentWord = "";
        this.currentWords = [];
        this.score = {};
        const room = this.getRoom()
        if (room) {
            room.participants.forEach(p => {
                this.score[p.id] = 0;
            });
        } else return log.error("Creating a game with not existing room")
        this.answers = {};
        // le timer du tour
        this.timer = null;

        // attributs machine à état
        this.state = GameStates.Starting;
        let UPDATEPERIODINMS = 500;
        this.tick = setInterval(() => {
            this._update();
        }, UPDATEPERIODINMS);
        this.init();
    }

    /**
     * Called to initialise callbacks for reception.
     */
    init() {
        throw new Error('You have to implement the method!');
    }

    /**
     * Called to destroy callbacks for reception.
     * Called to clean all dangling objects that can affect system when game is over.
     */
    destroy() {
        throw new Error('You have to implement the method!');
    }

    /**
     * Retrieve room information of this game from '@./rooms.js'
     * @private only used internally
     * @return {json}
     */
    getRoom() {
        throw new Error('You have to implement the method!');
    }

    //network
    /**
     * Send all players informations to all clients.
     */
    sendPlayers() {
        throw new Error('You have to implement the method!');
    }

    /**
     * Send round duration to all clients.
     */
    sendRoundTime() {
        throw new Error('You have to implement the method!');
    }

    /**
     * Send current drawer player to all clients.
     */
    sendCurrentDrawer() {
        throw new Error('You have to implement the method!');
    }

    /**
     * Send current next word to drawer client.
     */
    sendNextWord() {
        throw new Error('You have to implement the method!');
    }

    /**
     * Send all score to all players
     */
    sendScore() {
        throw new Error('You have to implement the method!');
    }

    /**
     * Send validation to requester client.
     */
    sendWordValidity(playerId, answer, good) {
        throw new Error('You have to implement the method!');
    }

    /**
     * Send current game state to all clients.
     */
    sendState() {
        throw new Error('You have to implement the method!');
    }

    /**
     * Send possible words to drawer player during [NextPlayer]
     */
    sendPickingWords() {
        throw new Error('You have to implement the method!');
    }

    /**
     * Receive word from drawer player.
     * Can only be called when [Picking].
     * @param playerId drawer (or not)
     * @param word picked word
     */
    receiveWord(playerId, word) {
        console.log("receiveWord");
        switch (this.state) {
            case GameStates.Picking: {
                console.log("OK	", this.currentDrawer);
                if (this.currentDrawer.id === playerId) {
                    console.log("receive selection");
                    this.currentWord = word;
                } else {
                    //error non drawer can't select word
                }
            }
            break
        }
    }

    /**
     * Receive answer from player.
     * Can only be called when [Drawing].
     * @param playerId answerer (ot not)
     * @param answer given answer for scoring
     */
    receiveAnswer(playerId, answer) {
        console.log("receive answer");
        if (this.state === GameStates.Drawing) {
            console.log("receive answer 2");
            if (this.currentDrawer.id !== playerId) {
                console.log("receive answer 3");
                //checks validity
                let order = Date.now();
                let validity = this.checksWord(answer);
                this.sendWordValidity(playerId, answer, validity);
                //TODO Hamming distance
                if (validity) {
                    // on conserve le fait que le joueur ai trouvé
                    console.log("receive answer 4");
                    this.answers[playerId] = order;
                }
            } else {
                //error drawer can't anwser
            }
        }
        console.log(this.answers);
    }

    /**
     * [TOOL] At the end of the turn, used to compute  who is the best player
     */
    _computeScore() {
        console.log("computescore");
        for (var key in this.answers) {
            let value = 100;
            this.score[key] = this.score[key] + value;
            // do something with "key" and "value" variables
        }
        console.log("score : ", this.score);
    }

    /**
     * [TOOL] Checks if word matches with current word during [Drawing]
     * @param word word to check
     * @private only used internally
     */
    checksWord(word) {
        throw new Error('You have to implement the method!');
    }

    // test
    /**
     * Checks if current player drawer is alive.
     */
    isCurrentPlayerConnected() {
        throw new Error('You have to implement the method!');
    }

    /**
     * Checks if game room is not in invalid state.
     * isValid <=> true (PlayerCount > 2) or (ConnectedPlayer > 2)
     * @returns if game as enough information to be played (such as player count).
     */
    isValid() {
        throw new Error('You have to implement the method!');
    }

    /**
     * Checks if game is running or not.
     * @returns {boolean} if game is currently running otherwise [Ended, Terminating] or not valid.
     */
    isEnded() {
        return this.state === GameStates.Ended || this.state === GameStates.Terminating || !this.isValid();
    }

    /**
     * Select among current possible sets only 3 words and put them into this#currentWords
     * @private only called internally
     */
    generateWords() {
        throw new Error('You have to implement the method!');
    }

    // update
    /**
     * [MACHINE] Called each period to update state machine.
     * Internally checks if game is valid and if not call this#_terminate().
     * Call current game state method.
     * Send current state to clients.
     * @private only used internally
     */
    _update() {
        console.log("UPDATE:" + this.currentTurn);
        // on vérifie toujours en premier lieu l'état de validité
        if (!this.isValid()) {
            this._terminate();
        } else {

            switch (this.state) {
                case GameStates.Starting: {
                    this._starting();
                }
                break;

            case GameStates.NextPlayer: {
                this._nextPlayer();
            }
            break;

            case GameStates.Picking: {
                this._picking();
            }
            break;

            case GameStates.Drawing: {
                this._drawing();
            }
            break;

            case GameStates.Ended: {
                this._ended();
            }
            break;

            case GameStates.Terminating: {
                this._terminate();
            }
            break;
            }

        }
        this.sendState();
    }

    // game states methods (graphe d'état)
    /**
     * [STATE] First state when game is created.
     * Setup values for clients.
     * Then set state to [NextPlayer].
     * @private only used internally
     */
    _starting() {
        console.log("starting");
        this.sendPlayers();
        this.sendRoundTime();
        this.sendScore();
        this.state = GameStates.NextPlayer;
    }

    /**
     * [HELPER] Clean turn objects.
     * Clear game turn timer to prevent dangling method calls.
     * @private only used internally
     */
    _clearTurn() {
        console.log("clearTurn");
        this.currentWord = "";
        this.answers = {};
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    /**
     * [STATE] State when game needs player for starting turn.
     * Clean turn.
     * Change player among participants (pass to next player) and signal client.
     * Then set state to [Picking].
     * @private only used internally
     */
    _nextPlayer() {
        console.log("nextPlayer");
        if (this.state !== GameStates.NextPlayer) {
            return; //error
        }
        this._clearTurn();
        this.generateWords();

        //joueur suivant
        this.currentDrawerTurn = this.currentDrawerTurn + 1;
        const room = this.getRoom();
        this.currentDrawer = room.participants[this.currentDrawerTurn % room.participants.length];

        //on met à jour le joueur suivant
        this.sendCurrentDrawer();
        this.sendPickingWords();
        this.state = GameStates.Picking;


    }
    /**
     * [STATE] State when game needs current player to select word.
     * Checks for current player to be alive otherwise change state to [NextPlayer].
     * this#receiveWord() can be called.
     * When this#receiveWord() is called then set state to [Drawing].
     * @private only used internally
     */
    _picking() {
        // TEST ONLY
        // this.receiveWord(this.currentDrawer.id, "current");
        // end test

        if (this.state !== GameStates.Picking) {
            return; // error
        }
        console.log("picking");

        // on vérifie que le joueur courrant est connecté sinon on attend pour rien
        if (this.isCurrentPlayerConnected()) {
            if (this.currentWord.length > 0) {
                console.log("NEXT STEP");
                // le mot a été selectionné alors on dessine et on valide pour le drawer
                this.sendNextWord();
                this.state = GameStates.Drawing;
            }
        } else {
            // on change de joueur
            this.state = GameStates.NextPlayer;
        }
    }
    /**
     * [STATE] State when game is ready for drawing and answering.
     * Checks for current player to be alive otherwise change state to [NextPlayer].
     * this#receiveAnswer() can be called.
     * First time it's used: init turn timer for limited duration then call this#_afterDrawing()
     * @private only used internally
     */
    _drawing() {
        //TEST only
        // this.receiveAnswer("current", "word1");
        //end test
        console.log("drawing");
        if (this.state !== GameStates.Drawing) {
            return; //error
        }

        // on vérifie que le joueur courrant est connecté sinon on attend pour rien
        if (this.isCurrentPlayerConnected()) {
            if (this.timer === null) {
                // appelé une fois
                this.timer = setTimeout(() => {
                    this._afterDrawing();
                }, this.roundTime);
            }
        } else {
            // on change de joueur
            console.log("ERROR ERROR")
            this.state = GameStates.NextPlayer;
        }
    }

    /**
     * [HELPER] Called internally to change current turn and send to clients the score.
     * If it's the last turn before calling this#_nextTurn() set state to [Ended].
     * @private only used internally
     */
    _nextTurn() {
        console.log("nextTurn");
        this._computeScore();
        this.sendScore();

        if (!this.isEnded()) {
            this.currentTurn = this.currentTurn + 1;
            // il n'y a plus de tour on arrête la partie
            if (this.currentTurn > this.turns) {
                this._clearTurn();
                this.state = GameStates.Ended;
            }
        }
    }
    /**
     * [HELPER] Called when game turn is ended (call by a timer internally).
     * Call this#_nextTurn() because game turn is ended correctly.
     * Then the state to [NextPlayer]
     * @private only used internally
     */
    _afterDrawing() {
        console.log("afterDrawing");

        if (this.state !== GameStates.Drawing) {
            return; //error
        }

        this.state = GameStates.NextPlayer;
        this._nextTurn();
    }
    /**
     * [STATE] Called when game is ended.
     * Call this#sendScore() for clients for final results.
     * Then the state to [Terminating]
     * @private only used internally
     */
    _ended() {
        console.log("ended");

        //on patiente quelque temps avant de tuer le salon de jeu
        if (this.timer === null) {
            let TIME_BEFORE_SHUTDOWN_IN_MS = 10000;
            this.timer = setTimeout(() => {
                this.state = GameStates.Terminating;
            }, TIME_BEFORE_SHUTDOWN_IN_MS);
            this.sendScore();
        }
    }

    /**
     * [STATE] Makes this game unusable:
     * - Internal state = Terminating
     * Clean all:
     * - Internal state
     * - Clear all Timeouts
     */
    _terminate() {
        console.log("terminate");
        /*if (this.state !== or === ? GameStates.Terminating) {
            return; //error
        }*/

        this.state = GameStates.Terminating;
        clearTimeout(this.tick);
        this._clearTurn();
        this.destroy();
    }
}

module.exports.GameDefault = GameDefault;