import Boards from './boards';

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
            targetX = (targetX + 1)%10;
            targetY = (targetY + 1)%10;
            targetShot = playerBoard.getSquare(targetX, targetY);
        }
        previousShot = {targetX, targetY};
        switch(targetShot) {
            case(1): //Shot Hit
                playerBoard.setSquare(targetX, targetY, 3);
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
        let targetShot = 0;
        let dir = 0;
        let targetX, targetY;
        // Cycle through adjacent squares until finds one that hasnt been tried
        while(targetShot !== 0 && targetShot !== 1) {
            switch(dir) {
                case(0): // Up
                    targetShot = playerBoard.getSquare(previousShot.x, previousShot.y+1);
                    targetX = previousShot.x;
                    targetY = previousShot.y+1;
                    break;
                case(1): // Left
                    targetShot = playerBoard.getSquare(previousShot.x+1, previousShot.y);
                    targetX = previousShot.x+1;
                    targetY = previousShot.y;
                    break;
                case(2): // Down
                    targetShot = playerBoard.getSquare(previousShot.x, previousShot.y-1);
                    targetX = previousShot.x;
                    targetY = previousShot.y-1;
                    break;
                case(3): // Right
                    targetShot = playerBoard.getSquare(previousShot.x-1, previousShot.y);
                    targetX = previousShot.x-1;
                    targetY = previousShot.y;
                    break;
                case(4): // All Adjacent Squares have been guessed, shoot random
                    changeState(0);
                    return(randomShooting());
                default:
                    console.log(`Error: ${adjacentDir} is not a valid direction`);
            }
        }
        dir += 1;
        // Determine direction we need to look in
        if(targetX===previousShot.x) {
            targetAxis = "x";
        } else {
            targetAxis = "y";
        }
        // Actually shoots the shot
        previousShot = {targetX, targetY};
        console.log(`targetX: ${targetX} | targetY: ${targetY}`);
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

    const checkNegative = () => {
        const playerBoard = Boards.getPlayerBoard();
        let targetX = (targetAxis === "x") ? previousShot.x-1 : previousShot.x;
        let targetY = (targetAxis === "x") ? previousShot.y : previousShot.y-1;
        let targetShot = playerBoard.getSquare(targetX, targetY);
        if(targetShot === 1) {
            playerBoard.setSquare(targetX, targetY, 3);
            previousShot = {targetX, targetY};
            return(true);
        }
        if(targetShot === 0) {
            playerBoard.setSquare(targetX, targetY, 2);
            previousShot = {targetX, targetY};
            changeState(0);
            return(false);
        }
        changeState(0);
        return(randomShooting());
    }

    const checkPositive = () => {
        const playerBoard = Boards.getPlayerBoard();
        let targetX = (targetAxis === "x") ? previousShot.x+1 : previousShot.x;
        let targetY = (targetAxis === "x") ? previousShot.y : previousShot.y+1;
        let targetShot = playerBoard.getSquare(targetX, targetY);
        if(targetShot === 1) {
            playerBoard.setSquare(targetX, targetY, 3);
            previousShot = {targetX, targetY};
            return(true);
        }
        if(targetShot === 0) {
            playerBoard.setSquare(targetX, targetY, 2);
            previousShot = {targetX, targetY};
            changeState(3);
            return(false);
        }
        changeState(3);
        return(checkNegative());
    }

    //Needs to return true if shot hit, false if not
    const takeTurn = () => {
        console.log(turnState);
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