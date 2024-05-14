import { toInteger } from "lodash";
import Game from "./game";

const Pages = (() => {
    const unloadPage = (root) => {
        root.innerHTML = "";
    }

    const generateSquareID = (number) => {
        const xNum = number%10;
        const yNum = (number-xNum)/10;
        const squareID = `box-${xNum}-${yNum}`;
        return(squareID);
    }

    const loadBoard = (root) => {
        for(let i=0; i<100; i++) {
            const boardSquare = document.createElement("div");
            boardSquare.classList.add("board-square");
            boardSquare.id = generateSquareID(i);
            boardSquare.addEventListener("mouseover", () => {
                //Get size of ship and direction
                const shipSize = Game.getSelectedSize();
                const shipDir = Game.getSetupDir();

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
                const playerBoard = Game.getPlayerBoard();
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

        loadBoard(playerBoard);

        const setupContainer = document.createElement("div");
        setupContainer.id = "setup-container";
        root.appendChild(setupContainer);

        const rotateBtn = document.createElement("button");
        rotateBtn.classList.add("setup-btn");
        rotateBtn.innerText = "Rotate";
        rotateBtn.addEventListener("click", () => {
            Game.toggleSetupDir();
        })
        setupContainer.appendChild(rotateBtn);

        const playerShips = document.createElement("div");
        playerShips.id = "ship-container";
        setupContainer.appendChild(playerShips);

        const resetBtn = document.createElement("button");
        resetBtn.classList.add("setup-btn");
        resetBtn.innerText = "Reset";
        setupContainer.appendChild(resetBtn);

        for(let i=0; i<5; i++) {
            const shipBox = document.createElement("div");
            shipBox.classList.add("ship-box");
            shipBox.addEventListener("click", () => {
                const allShips = document.querySelectorAll(".ship-box");
                for(let j=0;j<allShips.length;j++) {
                    if (allShips[j].classList.contains("ship-selected")) {
                        allShips[j].classList.remove("ship-selected");
                    }
                }
                shipBox.classList.add("ship-selected");
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
            unloadPage(root);
            loadSetupPage(root);
            Game.startGame();
        })
        root.appendChild(startButton);
    }

    return{ unloadPage, loadStartPage, loadSetupPage };
})()

export default Pages;