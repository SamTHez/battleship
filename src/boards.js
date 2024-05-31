const Boards = (() => {
    const BOARD_SIZE = 10;

    let playerBoard, cpuBoard;
    let setupDir = "x";

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }      

    const getPlayerBoard = () => {return(playerBoard)};
    const initPlayerBoard = () => {playerBoard = newBoard() };
    const resetPlayerBoard = () => {
        playerBoard = [];
        playerBoard = newBoard();
    }

    const getCpuBoard = () => {return(cpuBoard)};

    const getSelectedSize = () => {
        let selectedShip = document.getElementsByClassName("ship-selected")[0];
        if(!(selectedShip)) {
            return(false);
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
            placeShip: function(size, dir, x, y) {
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

    const generateCpuBoard = () => {
        cpuBoard = newBoard();
        let shipSizes = [2,3,3,4,5];
        for(let i=0; i<shipSizes.length; i++) {
            let dirNum = getRandomInt(2);
            let shipDir;
            if(dirNum==0) {
                shipDir = "x";
            } else {
                shipDir = "y";
            }
            let possibleLocations = [];
            for(let x=0; x<BOARD_SIZE; x++) {
                for(let y=0; y<BOARD_SIZE; y++) {
                    if(cpuBoard.checkShip(shipSizes[i], shipDir, x, y)) {
                        possibleLocations.push([x,y]);
                    }
                }
            }
            let numLocations = possibleLocations.length;
            let newLocation = possibleLocations[getRandomInt(numLocations)];
            cpuBoard.placeShip(shipSizes[i], shipDir, newLocation[0], newLocation[1]);
        }
    }



    return{ newBoard, getPlayerBoard, resetPlayerBoard, getCpuBoard, getSelectedSize, toggleSetupDir, getSetupDir, generateCpuBoard, initPlayerBoard };
})()

export default Boards;