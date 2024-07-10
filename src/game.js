import Pages from './pages';
import Boards from './boards';

const Game = (() => {
    const content = document.getElementById("content");
    let gameMsg = "";

    const setNewMsg = (text) => {
        gameMsg = text;
    }

    const gameStates = {
        START: {
            name: 'start',
            onEnter: () => {
                console.log(`Entering State: start`); 
                Pages.loadStartPage(content);
            },
            onExit: () => {
                console.log(`Exiting State: start`);
                Pages.unloadPage(content);
            }
        },
        SETUP: {
            name: 'setup',
            onEnter: () => {
                console.log(`Entering State: setup`);
                Pages.loadSetupPage(content);
                Boards.initPlayerBoard();
            },
            onExit: () => {
                console.log(`Exiting State: setup`);
                Pages.unloadPage(content);
                setNewMsg("Your Turn: Shoot Your Shot");
                Boards.generateCpuBoards(); 
            }
        },
        PLAYER_TURN: {
            name: 'player_turn',
            onEnter: () => {
                console.log(`Entering State: player`);
                Pages.loadGamePage(content, gameMsg);
                Pages.displayCpuBoard();
                Pages.setupSquareSelect();
            },
            onExit: () => {
                console.log(`Exiting State: player`);
                Pages.clearActiveBoard();
                Pages.unloadPage(content);
            }
        },
        CPU_TURN: {
            name: 'cpu_turn',
            onEnter: () => {
                console.log(`Entering State: cpu`);
                Pages.loadGamePage(content, gameMsg);
                Pages.displayPlayerBoard();
            },
            onExit: () => {
                console.log(`Exiting State: cpu`);
                Pages.clearActiveBoard();
                Pages.unloadPage(content);
            }
        },
        GAME_END: {
            name: 'game_end',
            onEnter: () => {
                console.log(`Entering State: end`);
                Pages.loadEndPage(content, true); //Fix 2nd Argument to reflect who won
            },
            onExit: () => {
                console.log(`Exiting State: end`);
                Pages.unloadPage(content);
            }
        }
    };

    const transitions = {
        MoveToSetup: {
            [gameStates.START.name]: gameStates.SETUP.name
        },
        MoveToGame: {
            [gameStates.SETUP.name]: gameStates.PLAYER_TURN.name
        },
        PlayerMiss: {
            [gameStates.PLAYER_TURN.name]: gameStates.CPU_TURN.name
        },
        CpuMiss: {
            [gameStates.CPU_TURN.name]: gameStates.PLAYER_TURN.name
        },
        GameEnd: {
            [gameStates.PLAYER_TURN.name]: gameStates.GAME_END.name,
            [gameStates.CPU_TURN.name]: gameStates.GAME_END.name
        },
        ResetGame: {
            [gameStates.GAME_END.name]: gameStates.START.name
        }
    };

    let curState = gameStates.START.name;

    const changeState = (event) => {
        const nextState = transitions[event][curState];        

        if(!nextState) {
            console.log('Invalid state transition or event');
            return(null);
        }

        for(const state in gameStates) {
            if(gameStates[state].name === curState) {
                gameStates[state].onExit();
            }
        }

        curState = nextState;

        for(const state in gameStates) {
            if(gameStates[state].name === curState) {
                gameStates[state].onEnter();
            }
        }
    }

    const getState = () => {
        return(curState);
    }

    return{ setNewMsg, changeState, getState };
})();

export default Game;