import Boards from './boards';
import Game from './game';

const Cpu = (() => {
    //Shoot randomly until you get a hit
    //Check adjacent squares until you get a hit
    //Determine axis by comparing last 2 hits and seeing which coordinate stayed the same
    //Continue checking positive direction on axis until miss/out of room
    //Check negative direction until miss/out of room 
    //Back to shooting randomly 

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    let previousShot = {x:-1, y:-1};
    let centerSquare = {x:-1, y:-1};

    //The axis that the computer is currently searching
    let targetAxis = "x";

    // Turn states: | 0 = Random Shooting | 1 = Checking Adjacent | 2 = Checking up/left | 3 = Checking down/right |
    let turnState = 0;

    const changeState = (newState) => {
        if((turnState > 3)||(turnState < 0)) {
            console.log(`Error: ${turnState} is not a valid state`);
        } else {
            turnState = newState;
        }
    }
    
    const randomShooting = () => {
        const playerBoard = Boards.getPlayerBoard();
        let targetX = getRandomInt(10);
        let targetY = getRandomInt(10);
        let targetShot = playerBoard.getSquare(targetX, targetY);
        while(targetShot !== 0 && targetShot !== 1) {
            targetX = getRandomInt(10);
            targetY = getRandomInt(10);
            targetShot = playerBoard.getSquare(targetX, targetY);
        }
        previousShot = {x: targetX, y: targetY};
        switch(targetShot) {
            case(1): //Shot Hit
                playerBoard.setSquare(targetX, targetY, 3);
                centerSquare = {x: targetX, y: targetY};
                changeState(1);
                return(true);
            case(0): //Shot Miss
                playerBoard.setSquare(targetX, targetY, 2);
                return(false);
            default:
                console.log("CPU Turn Error");
        }
    }

    const checkAdjacent = () => {
        const playerBoard = Boards.getPlayerBoard();
        let targetShot = -1;
        let dir = 0;
        let targetX, targetY;
        // Cycle through adjacent squares until finds one that hasnt been tried
        while(targetShot !== 0 && targetShot !== 1) {
            console.log(targetShot);
            switch(dir) {
                case(0): // Up
                    targetShot = playerBoard.getSquare(centerSquare.x, centerSquare.y+1);
                    targetX = centerSquare.x;
                    targetY = centerSquare.y+1;
                    break;
                case(1): // Left
                    targetShot = playerBoard.getSquare(centerSquare.x+1, centerSquare.y);
                    targetX = centerSquare.x+1;
                    targetY = centerSquare.y;
                    break;
                case(2): // Down
                    targetShot = playerBoard.getSquare(centerSquare.x, centerSquare.y-1);
                    targetX = centerSquare.x;
                    targetY = centerSquare.y-1;
                    break;
                case(3): // Right
                    targetShot = playerBoard.getSquare(centerSquare.x-1, centerSquare.y);
                    targetX = centerSquare.x-1;
                    targetY = centerSquare.y;
                    break;
                case(4): // All Adjacent Squares have been guessed, shoot random
                    changeState(0);
                    centerSquare = {x: -1, y: -1};
                    return(randomShooting());
                default:
                    console.log(`Error: ${adjacentDir} is not a valid direction`);
            }
            dir += 1;
        }
        // Determine direction we need to look in
        if(targetX===centerSquare.x) {
            targetAxis = "y";
        } else {
            targetAxis = "x";
        }
        // Actually shoots the shot
        previousShot = {x: targetX, y: targetY};
        switch(targetShot) {
            case(1): //Shot Hit
                playerBoard.setSquare(targetX, targetY, 3);
                changeState(2);
                return(true);
            case(0): //Shot Miss
                playerBoard.setSquare(targetX, targetY, 2);
                return(false);
            default:
                console.log("CPU Turn Error");
        }
    }

    // Needs to keep checking if targetShot === 3 and stop if targetShot === 2
    const checkNegative = () => {
        const playerBoard = Boards.getPlayerBoard();
        let targetX = (targetAxis === "x") ? previousShot.x-1 : previousShot.x;
        let targetY = (targetAxis === "x") ? previousShot.y : previousShot.y-1;
        let targetShot = playerBoard.getSquare(targetX, targetY);
        switch(targetShot) {
            case 0:
                playerBoard.setSquare(targetX, targetY, 2);
                previousShot = {x: targetX, y: targetY};
                changeState(0);
                return(false);
            case 1:
                playerBoard.setSquare(targetX, targetY, 3);
                previousShot = {x: targetX, y: targetY};
                return(true);
            case 2:
                changeState(0);
                return(randomShooting());
            case 3:
            case -1:
                previousShot = {x: targetX, y: targetY};
                return(checkNegative());
            default:
                console.log("Error in CPU checkNegative function");
        }
    }

    const checkPositive = () => {
        const playerBoard = Boards.getPlayerBoard();
        let targetX = (targetAxis === "x") ? previousShot.x+1 : previousShot.x;
        let targetY = (targetAxis === "x") ? previousShot.y : previousShot.y+1;
        let targetShot = playerBoard.getSquare(targetX, targetY);
        if(targetShot === 1) {
            playerBoard.setSquare(targetX, targetY, 3);
            previousShot = {x: targetX, y: targetY};
            return(true);
        }
        if(targetShot === 0) {
            playerBoard.setSquare(targetX, targetY, 2);
            previousShot = {x: centerSquare.x, y: centerSquare.y};
            changeState(3);
            return(false);
        }
        previousShot = {x: centerSquare.x, y: centerSquare.y};
        changeState(3);
        return(checkNegative());
    }

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //Needs to return true if shot hit, false if not
    const takeTurn = async () => {
        const gameText = document.querySelector(".game-text");
        await sleep(400);
        gameText.innerText = "CPU Thinking";
        await sleep(200);
        gameText.innerText += " .";
        await sleep(200);
        gameText.innerText += " .";
        await sleep(200);
        gameText.innerText += " .";
        await sleep(400);
        switch(turnState) {
            case(0):
                return(randomShooting());
            case(1):
                return(checkAdjacent());
            case(2):
                return(checkPositive());
            case(3):
                return(checkNegative());
            default:
                console.log(`Error: ${turnState} is not a valid state`);
        }
    }

    return { takeTurn };
})();

export default Cpu;