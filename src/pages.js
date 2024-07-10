import { toInteger } from "lodash";
import Game from "./game";
import Boards from "./boards";
import ShipIcon from "./assets/shipIcon.png";
import RotateIcon from "./assets/rotateIcon.png";
import ResetIcon from "./assets/resetIcon.png";
import PlayerWin from "./assets/playerWin.png";
import PlayerLoss from "./assets/playerLoss.png";
import CpuWin from "./assets/cpuWin.png";
import CpuLoss from "./assets/cpuLoss.png";

const Pages = (() => {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }      

    const unloadPage = (root) => {
        root.innerHTML = "";
    }

    const generateSquareID = (number) => {
        const xNum = number%10;
        const yNum = (number-xNum)/10;
        const squareID = `box-${xNum}-${yNum}`;
        return(squareID);
    }

    const startPlayerTurn = (targetX, targetY) => {
        const answerBoard = Boards.getAnswerBoard();
        const displayBoard = Boards.getDisplayBoard();
        switch(answerBoard.getSquare(targetX, targetY)) {
            case(1):
                displayBoard.setSquare(targetX, targetY, 3);
                return(true);
            case(0):
                displayBoard.setSquare(targetX, targetY, 2);
                return(false);
            default:
                console.log("Player Turn Error");
        }
        
    }

    const startCpuTurn = () => {
        const playerBoard = Boards.getPlayerBoard();
        let targetX = getRandomInt(10);
        let targetY = getRandomInt(10);
        let targetShot = playerBoard.getSquare(targetX, targetY);
        while(targetShot !== 0 && targetShot !== 1) {
            targetX = (targetX + 1)%10;
            targetY = (targetY + 1)%10;
            targetShot = playerBoard.getSquare(targetX, targetY);
        }
        switch(targetShot) {
            case(1):
                playerBoard.setSquare(targetX, targetY, 3)
                return(true);
            case(0):
                playerBoard.setSquare(targetX, targetY, 2)
                return(false);
            default:
                console.log("CPU Turn Error");
        }

    }

    const setupSquareSelect = () => {
        const activeSquares = document.querySelectorAll("#active-board .board-square");
        for(let i=0;i<activeSquares.length;i++) {
            const curSquare = activeSquares[i];
            if(!(curSquare.classList.contains("miss-shot")||curSquare.classList.contains('hit-shot'))) {
                curSquare.addEventListener("click", () => {
                    let selectedSquares = document.getElementsByClassName("square-selected");
                    while(selectedSquares[0]) {
                        selectedSquares[0].classList.remove("square-selected");                   
                    }
                    curSquare.classList.add("square-selected");
                })
            }
        }
    }

    const displayCpuBoard = (root) => {
        const activeBoard = document.getElementById("active-board");
        root = root || activeBoard;
        const displayBoard = Boards.getDisplayBoard();
        for(let i=0; i<100; i++) {
            const boardSquare = document.createElement("div");
            boardSquare.classList.add("board-square");
            boardSquare.id = generateSquareID(i);
            let curX = toInteger(boardSquare.id.split("-")[1]);
            let curY = toInteger(boardSquare.id.split("-")[2]);
            switch(displayBoard.getSquare(curX, curY)) {
                case 0:
                    break;
                case 1:
                    boardSquare.classList.add("ship-square");
                    break;
                case 2:
                    boardSquare.classList.add("miss-shot");
                    break;
                case 3:
                    boardSquare.classList.add("hit-shot");
                    break;
                default:
                    console.log("Error in DisplayBoard");
            }
            root.appendChild(boardSquare);
        }
    }

    const displayPlayerBoard = (root) => {
        const board = Boards.getPlayerBoard();
        const activeBoard = document.getElementById("active-board");
        root = root || activeBoard;
        for(let i=0; i<100; i++) {
            const boardSquare = document.createElement("div");
            boardSquare.classList.add("board-square");
            boardSquare.id = generateSquareID(i);
            let curX = toInteger(boardSquare.id.split("-")[1]);
            let curY = toInteger(boardSquare.id.split("-")[2]);
            switch(board.getSquare(curX, curY)) {
                case 0:
                    break;
                case 1:
                    boardSquare.classList.add("ship-square");
                    break;
                case 2:
                    boardSquare.classList.add("miss-shot");
                    break;
                case 3:
                    boardSquare.classList.add("hit-shot");
                    break;
                default:
                    console.log("Error in PlayerBoard");
            }

            root.appendChild(boardSquare);
        }
    }

    const clearActiveBoard = () => {
        const activeBoard = document.getElementById("active-board");
        activeBoard.innerHTML = "";
    }

    const loadEndPage = (root, playerWin) => {
        const endText = document.createElement("h1");
        endText.classList.add("game-text");
        endText.innerText = (playerWin) ? "You Won! Play Again?" : "You Lost! Play Again?";
        root.appendChild(endText);

        //Add 2 portraits side by side
        const charContainer = document.createElement("div");
        charContainer.id = "char-container";
        root.appendChild(charContainer);

        const playerPortrait = document.createElement("img");
        playerPortrait.classList.add("char-portrait", "chalk-border");
        playerPortrait.src = (playerWin) ? PlayerWin : PlayerLoss;
        charContainer.appendChild(playerPortrait);

        const cpuPortrait = document.createElement("img");
        cpuPortrait.classList.add("char-portrait", "chalk-border");
        cpuPortrait.src = (playerWin) ? CpuLoss : CpuWin;
        charContainer.appendChild(cpuPortrait);

        const endBtn = document.createElement("button");
        endBtn.classList.add("chalk-border");
        endBtn.id = "end-btn";
        endBtn.innerText = "Back to Home";
        endBtn.addEventListener("click", () => {
            Game.changeState("ResetGame");
        })
        root.appendChild(endBtn);
    }

    const loadGamePage = (root, gameMsg) => {
        const gameText = document.createElement("h1");
        gameText.classList.add("game-text");
        gameText.innerText = gameMsg;
        root.appendChild(gameText);

        const nextBtn = document.createElement("button");
        nextBtn.id = "nextBtn";
        nextBtn.classList.add("chalk-border");
        nextBtn.textContent = "Continue";
        nextBtn.addEventListener("click",() => {
            switch(Game.getState()) {
                case "player_turn":
                    const selectedSquare = document.querySelector("#active-board .square-selected");
                    if(selectedSquare) {
                        let selectedX = toInteger(selectedSquare.id.split("-")[1]);
                        let selectedY = toInteger(selectedSquare.id.split("-")[2]);
                        let result = startPlayerTurn(selectedX, selectedY);
                        if(result) {
                            console.log(Boards.getDisplayBoard())
                            if(Boards.getDisplayBoard().checkForWin()) {
                                Game.changeState("GameEnd");
                            } else {
                                unloadPage(root);
                                loadGamePage(root, "You Hit A Ship! Shoot Again");
                                displayCpuBoard();
                                setupSquareSelect();
                            }
                        } else {
                            Game.setNewMsg("You Missed! CPU Turn To Shoot");
                            Game.changeState("PlayerMiss");
                        }
                    }
                    break;
                case "cpu_turn":
                    let result = startCpuTurn();
                    if(result) {
                        if(Boards.getPlayerBoard().checkForWin()) {
                            Game.changeState("GameEnd");
                        } else {
                            unloadPage(root);
                            loadGamePage(root, "CPU Hit! CPU Will Shoot Again");
                            displayPlayerBoard();
                        }
                    } else {
                        Game.setNewMsg("CPU Missed! Your Turn To Shoot");
                        Game.changeState("CpuMiss");
                    }
                    break;
                default:
                    console.log("Error in NextBtn")

            }
            
        })
        root.appendChild(nextBtn);

        const boardsDisplay = document.createElement("div");
        boardsDisplay.id = "boards-display";
        root.appendChild(boardsDisplay);

        const playerBoardLabel = document.createElement("h3");
        playerBoardLabel.innerText = "Your Board";
        playerBoardLabel.classList.add("board-label");
        boardsDisplay.appendChild(playerBoardLabel);

        const activeBoard = document.createElement("div");
        activeBoard.id = "active-board";
        activeBoard.classList.add("chalk-border");
        boardsDisplay.appendChild(activeBoard);

        const cpuBoardLabel = document.createElement("h3");
        cpuBoardLabel.innerText = "CPU Board";
        cpuBoardLabel.classList.add("board-label");
        boardsDisplay.appendChild(cpuBoardLabel);
    
        const playerBoardSide = document.createElement("div");
        playerBoardSide.classList.add("side-board", "chalk-border");
        boardsDisplay.appendChild(playerBoardSide);
        displayPlayerBoard(playerBoardSide);

        const cpuBoardSide = document.createElement("div");
        cpuBoardSide.classList.add("side-board", "chalk-border");
        boardsDisplay.appendChild(cpuBoardSide);

        displayCpuBoard(cpuBoardSide);
        console.log(Boards.getAnswerBoard());
    }

    const loadSetupBoard = (root) => {
        for(let i=0; i<100; i++) {
            const boardSquare = document.createElement("div");
            boardSquare.classList.add("board-square");
            boardSquare.id = generateSquareID(i);
            boardSquare.addEventListener("mouseover", () => {
                //Get size of ship and direction
                const shipSize = Boards.getSelectedSize();
                const shipDir = Boards.getSetupDir();

                //Get all spots that ship should cover
                const squaresToCheck = [];
                let curId = boardSquare.id;

                let curX = toInteger(curId.split("-")[1]);
                let curY = toInteger(curId.split("-")[2]);

                for(let i=0; i<shipSize; i++) {
                    let targetId;
                    if(shipDir === "x") {
                        targetId = `box-${curX+i}-${curY}`;
                    } else {
                        targetId = `box-${curX}-${curY+i}`;
                    }
                    if(document.getElementById(targetId)) {
                        squaresToCheck.push(document.getElementById(targetId));
                    }
                }
                const playerBoard = Boards.getPlayerBoard();
                if(playerBoard.checkShip(shipSize, shipDir, curX, curY)) {
                    for(let i=0; i<squaresToCheck.length; i++) {
                        squaresToCheck[i].classList.add("placement-valid");
                    }    
                } else {
                    for(let i=0; i<squaresToCheck.length; i++) {
                        squaresToCheck[i].classList.add("placement-invalid");
                    }    
                }
            });
            boardSquare.addEventListener("mouseout", () => {
                const validSquares = Array.from(document.getElementsByClassName("placement-valid"));
                if(validSquares) {
                    let numValid = validSquares.length;
                    for(let i=0;i<numValid;i++) {
                        if (validSquares[i].classList.contains("placement-valid")) {
                            validSquares[i].classList.remove("placement-valid");
                        }
                    }
                }

                const invalidSquares = Array.from(document.getElementsByClassName("placement-invalid"));
                if(invalidSquares) {
                    let numInvalid = invalidSquares.length;
                    for(let i=0;i<numInvalid;i++) {
                        if (invalidSquares[i].classList.contains("placement-invalid")) {
                            invalidSquares[i].classList.remove("placement-invalid");
                        }
                    }
                }
            });
            boardSquare.addEventListener("click", () => {
                const playerBoard = Boards.getPlayerBoard();
                let shipSize = Boards.getSelectedSize();
                let shipDir = Boards.getSetupDir();
                let curId = boardSquare.id;
                let curX = toInteger(curId.split("-")[1]);
                let curY = toInteger(curId.split("-")[2]);
                if(playerBoard.checkShip(shipSize, shipDir, curX, curY)) {
                    playerBoard.placeShip(shipSize, shipDir, curX, curY);
                    for(let i=0;i<shipSize;i++) {
                        if(shipDir === "x") {
                            const curSquare = document.getElementById(`box-${curX+i}-${curY}`);
                            curSquare.classList.add("square-used");
                        } else {
                            const curSquare = document.getElementById(`box-${curX}-${curY+i}`);
                            curSquare.classList.add("square-used");
                        }
                    }
                    let placedShip = document.getElementsByClassName(`ship-selected`)[0];
                    placedShip.classList.add("ship-used");
                    placedShip.classList.remove("ship-selected");
                    let usedShips = document.getElementsByClassName("ship-used");
                    if(usedShips.length >= 5) {
                        document.getElementById("play-btn").disabled = false;
                    }
                }
            })
            root.appendChild(boardSquare);
        }
    }

    const loadSetupPage = (root) => {
        //Top Text
        const setupText = document.createElement("h2");
        setupText.classList.add("game-text");
        setupText.textContent = "Place Your Ships";
        root.appendChild(setupText);

        //Main Setup Layout
        const setupContent = document.createElement('div');
        setupContent.id = "setup-content";
        root.appendChild(setupContent);

        //Left side of setup screen - setup board
        const playerBoard = document.createElement("div");
        playerBoard.classList.add("game-board");
        playerBoard.classList.add("chalk-border");
        setupContent.appendChild(playerBoard);

        loadSetupBoard(playerBoard);

        //Right Side of Setup Screen - Ship Selection and Controls
        const setupMenu = document.createElement("div");
        setupMenu.id = "setup-menu";
        setupContent.appendChild(setupMenu);

        //Ship Controls and Buttons
        const setupBtns = document.createElement('div');
        setupBtns.id = "setup-btns";
        setupMenu.appendChild(setupBtns);

        const rotateBtn = document.createElement("button");
        rotateBtn.classList.add("setup-btn", "chalk-border");
        const rotateIcon = document.createElement("img");
        rotateIcon.classList.add("setup-icon");
        rotateIcon.src = RotateIcon;
        rotateBtn.appendChild(rotateIcon);
        rotateBtn.addEventListener("click", () => {
            Boards.toggleSetupDir();
        })
        setupBtns.appendChild(rotateBtn);

        const playBtn = document.createElement("button");
        playBtn.id = "play-btn";
        playBtn.classList.add("chalk-border");
        playBtn.innerText = "Play Game";
        playBtn.disabled = true;
        playBtn.addEventListener("click", () => {
            Game.changeState('MoveToGame');
        })
        setupBtns.appendChild(playBtn);

        const resetBtn = document.createElement("button");
        resetBtn.classList.add("setup-btn", "chalk-border");
        const resetIcon = document.createElement("img");
        resetIcon.classList.add("setup-icon");
        resetIcon.src = ResetIcon;
        resetBtn.appendChild(resetIcon);
        resetBtn.addEventListener("click", () => {
            Boards.resetPlayerBoard();
            const selectedShips = Array.from(document.getElementsByClassName("ship-used"));
            for(let i=0;i<selectedShips.length;i++) {
                selectedShips[i].classList.remove("ship-used");
            }
            const selectedSquares = Array.from(document.getElementsByClassName("square-used"));
            for(let i=0;i<selectedSquares.length;i++) {
                selectedSquares[i].classList.remove("square-used");
            }
            const playBtn = document.getElementById("play-btn");
            playBtn.disabled = true;
        })
        setupBtns.appendChild(resetBtn);

        //Ship Selection Containers
        const upperShipRow = document.createElement("div");
        upperShipRow.classList.add("ship-row");
        setupMenu.appendChild(upperShipRow);

        const lowerShipRow = document.createElement("div");
        lowerShipRow.classList.add("ship-row");
        setupMenu.appendChild(lowerShipRow);

        for(let i=0; i<5; i++) {
            const shipBox = document.createElement("div");
            shipBox.classList.add("ship-box");
            shipBox.classList.add("chalk-border");
            shipBox.addEventListener("click", () => {
                if(!shipBox.classList.contains("ship-used")) {
                    const allShips = document.querySelectorAll(".ship-box");
                    for(let j=0;j<allShips.length;j++) {
                        if (allShips[j].classList.contains("ship-selected")) {
                            allShips[j].classList.remove("ship-selected");
                        }
                    }
                    shipBox.classList.add("ship-selected");
                }
            })
            let shipIconBox = document.createElement("div");
            switch(i) {
                case 0:
                    shipBox.classList.add("two-ship");
                    shipIconBox.classList.add("ship-icon-box");
                    shipBox.appendChild(shipIconBox);
                    for(let j=0;j<2;j++){
                        const icon = document.createElement("img");
                        icon.classList.add("ship-icon");
                        icon.src = ShipIcon;
                        shipIconBox.appendChild(icon);
                    }
                    upperShipRow.appendChild(shipBox);
                    break;
                case 1:
                case 2:
                    shipBox.classList.add("three-ship");
                    shipIconBox = document.createElement("div");
                    shipIconBox.classList.add("ship-icon-box");
                    shipBox.appendChild(shipIconBox);
                    for(let j=0;j<3;j++){
                        const icon = document.createElement("img");
                        icon.classList.add("ship-icon");
                        icon.src = ShipIcon;
                        shipIconBox.appendChild(icon);
                    }
                    upperShipRow.appendChild(shipBox);
                    break;
                case 3:
                    shipBox.classList.add("four-ship");
                    shipIconBox = document.createElement("div");
                    shipIconBox.classList.add("ship-icon-box");
                    shipBox.appendChild(shipIconBox);
                    for(let j=0;j<4;j++){
                        const icon = document.createElement("img");
                        icon.classList.add("ship-icon");
                        icon.src = ShipIcon;
                        shipIconBox.appendChild(icon);
                    }
                    lowerShipRow.appendChild(shipBox);
                    break;
                case 4:
                    shipBox.classList.add("five-ship");
                    shipIconBox = document.createElement("div");
                    shipIconBox.classList.add("ship-icon-box");
                    shipBox.appendChild(shipIconBox);
                    for(let j=0;j<5;j++){
                        const icon = document.createElement("img");
                        icon.classList.add("ship-icon");
                        icon.src = ShipIcon;
                        shipIconBox.appendChild(icon);
                    }
                    lowerShipRow.appendChild(shipBox);
                    break;
                default:
                    console.log("Error in switch statement");
            }
        }


    }

    const loadStartPage = (root) => {
        const startTitle = document.createElement("h1");
        startTitle.id = "start-title";
        startTitle.textContent = "Battleship";
        root.appendChild(startTitle);

        const startButton = document.createElement("button");
        startButton.id = "start-btn";
        startButton.classList.add("chalk-border");
        startButton.textContent = "Start Game";
        startButton.addEventListener("click", () => {
            Game.changeState('MoveToSetup');
        })
        root.appendChild(startButton);
    }

    return{ unloadPage, loadStartPage, loadSetupPage, loadGamePage, loadEndPage, displayCpuBoard, displayPlayerBoard, setupSquareSelect, clearActiveBoard, startPlayerTurn, startCpuTurn };
})()

export default Pages;