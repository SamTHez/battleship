const Game = (() => {
    const BOARD_SIZE = 10;

    let playerBoard, cpuBoard;
    let setupDir = "x";

    const getPlayerBoard = () => {return(playerBoard)};
    const getCpuBoard = () => {return(cpuBoard)};

    const getSelectedSize = () => {
        let selectedShip = document.getElementsByClassName("ship-selected")[0];
        if(!(selectedShip)) {
            return(false)
        }
        if(selectedShip.classList.contains("2-ship")) {
            return(2);
        }
        if(selectedShip.classList.contains("3-ship")) {
            return(3);
        }
        if(selectedShip.classList.contains("4-ship")) {
            return(4);
        }
        if(selectedShip.classList.contains("5-ship")) {
            return(5);
        }
        return(false);
    }

    const getSetupDir = () => {return(setupDir)};
    const toggleSetupDir = () => {
        if(setupDir === "x") {
            setupDir = "y";
        } else {
            setupDir = "x";
        }
    }

    const newBoard = () => {
        let boardState = [];

        for(let i=0;i<BOARD_SIZE;i++) {
            let newRow = [];
            for(let j=0;j<BOARD_SIZE;j++) {
                newRow.push(0);
            }
            boardState.push(newRow);
        }

        return({
            board: boardState,
            getSquare: function(x,y) {
                if(x>=BOARD_SIZE||y>=BOARD_SIZE) {
                    return(-1);
                }
                return(this.board[y][x]);
            },
            setSquare: function(x,y,newState) {
                this.board[y][x] = newState;
            },
            checkShip: function(size, dir, x, y) {
                //Check Function Inputs
                if(size<2||size>=6) {
                    return(false);
                }
                if(dir!="x"&&dir!="y") {
                    return(false);
                }
                if(x<0||x>=BOARD_SIZE||y<0||y>=BOARD_SIZE){
                    return(false);
                }

                //Check for valid placement
                if(dir == "x") {
                    for(let i=0; i<size; i++) {
                        if(this.getSquare(x+i,y)!=0) {
                            return(false)
                        }
                    }
                } else {
                    for(let i=0; i<size; i++) {
                        if(this.getSquare(x,y+i)!=0) {
                            return(false)
                        }
                    }
                }
                return(true);
            },
            placeShip: function() {
                if(this.checkShip(size, dir, x, y)) {        
                    if(dir == "x") {
                        for(let i=0; i<size; i++) {
                            this.setSquare(x+i,y,1);
                        }
                    } else {
                        for(let i=0; i<size; i++) {
                            this.setSquare(x,y+i,1);
                        }
                    }
                } else {
                    console.log("Error placing ship: INVALID PLACEMENT");
                }
            }
        })
    }

    const startGame = () => {
        playerBoard = newBoard();
        cpuBoard = newBoard();
    }


    return{ startGame, getPlayerBoard, getCpuBoard, getSelectedSize, toggleSetupDir, getSetupDir };
})()

export default Game;