import Pages from './pages';
import Boards from './boards';

const Game = (() => {
    const content = document.getElementById("content");
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
                console.log(`Entering State setup`);
                Pages.loadSetupPage(content);
                Boards.initPlayerBoard();
            },
            onExit: () => {
                console.log(`Exiting State: setup`);
                Pages.unloadPage(content);
                Boards.generateCpuBoard();
                Pages.loadGamePage(content);
            }
        },
        PLAYER_TURN: {
            name: 'player_turn',
            onEnter: () => {
                console.log(`Entering State: player`);
                //Show CPU Board
                //addEventListeners
            },
            onExit: () => {
                console.log(`Exiting State: player`);
                //Hide CPU Board
                //removeEventListeners
            }
        },
        CPU_TURN: {
            name: 'cpu_turn',
            onEnter: () => {
                console.log(`Entering State: cpu`);
                //Show Player Board
            },
            onExit: () => {
                console.log(`Exiting State: cpu`);
                //Hide Player Board
            }
        },
        GAME_END: {
            name: 'game_end',
            onEnter: () => {
                console.log(`Entering State: end`);
                Pages.unloadPage(content);
                //load End Page
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

    return{ changeState };
})();

export default Game;