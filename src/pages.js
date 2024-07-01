import { toInteger } from "lodash";
import Game from "./game";
import Boards from "./boards";

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
        endText.innerText = (playerWin) ? "You Won! Play Again?" : "You Lost! Play Again?";
        root.appendChild(endText);

        const endBtn = document.createElement("button");
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
        boardsDisplay.appendChild(activeBoard);

        const cpuBoardLabel = document.createElement("h3");
        cpuBoardLabel.innerText = "CPU Board";
        cpuBoardLabel.classList.add("board-label");
        boardsDisplay.appendChild(cpuBoardLabel);
    
        const playerBoardSide = document.createElement("div");
        playerBoardSide.classList.add("side-board");
        boardsDisplay.appendChild(playerBoardSide);
        displayPlayerBoard(playerBoardSide);

        const cpuBoardSide = document.createElement("div");
        cpuBoardSide.classList.add("side-board");
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
                        document.getElementById("play-btn").style.display = "block";
                    }
                }
            })
            root.appendChild(boardSquare);
        }
    }

    const loadSetupPage = (root) => {
        const setupText = document.createElement("h2");
        setupText.classList.add("game-text");
        setupText.textContent = "Place Your Ships";
        root.appendChild(setupText);

        const playerBoard = document.createElement("div");
        playerBoard.classList.add("game-board");
        root.appendChild(playerBoard);

        loadSetupBoard(playerBoard);

        const setupContainer = document.createElement("div");
        setupContainer.id = "setup-container";
        root.appendChild(setupContainer);

        const rotateBtn = document.createElement("button");
        rotateBtn.classList.add("setup-btn");
        rotateBtn.innerText = "Rotate";
        rotateBtn.addEventListener("click", () => {
            Boards.toggleSetupDir();
        })
        setupContainer.appendChild(rotateBtn);

        const playerShips = document.createElement("div");
        playerShips.id = "ship-container";
        setupContainer.appendChild(playerShips);

        const playBtn = document.createElement("button");
        playBtn.id = "play-btn";
        playBtn.innerText = "Play Game";
        playBtn.addEventListener("click", () => {
            Game.changeState('MoveToGame');
        })
        playerShips.appendChild(playBtn);

        const resetBtn = document.createElement("button");
        resetBtn.classList.add("setup-btn");
        resetBtn.innerText = "Reset";
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
            playBtn.style.display = "none"
        })
        setupContainer.appendChild(resetBtn);

        for(let i=0; i<5; i++) {
            const shipBox = document.createElement("div");
            shipBox.classList.add("ship-box");
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
            switch(i) {
                case 0:
                    shipBox.classList.add("2-ship");
                    shipBox.innerText = "2";
                    break;
                case 1:
                case 2:
                    shipBox.classList.add("3-ship");
                    shipBox.innerText = "3";
                    break;
                case 3:
                    shipBox.classList.add("4-ship");
                    shipBox.innerText = "4";
                    break;
                case 4:
                    shipBox.classList.add("5-ship");
                    shipBox.innerText = "5";
                    break;
                default:
                    console.log("Error in switch statement");
            }
            playerShips.appendChild(shipBox);
        }

    }

    const loadStartPage = (root) => {
        const startTitle = document.createElement("h1");
        startTitle.id = "start-title";
        startTitle.textContent = "Battleship";
        root.appendChild(startTitle);

        const startButton = document.createElement("button");
        startButton.id = "start-btn";
        startButton.textContent = "Start Game";
        startButton.addEventListener("click", () => {
            Game.changeState('MoveToSetup');
        })
        root.appendChild(startButton);
    }

    return{ unloadPage, loadStartPage, loadSetupPage, loadGamePage, loadEndPage, displayCpuBoard, displayPlayerBoard, setupSquareSelect, clearActiveBoard, startPlayerTurn, startCpuTurn };
})()

export default Pages;