document.body.style.zoom="100%"
localStorage.setItem("bestScore", 0);

var canvas = document.getElementById("2048Canvas");
var context = canvas.getContext("2d");

// variable which will store the best score achieved by a registered user
var canvasBestScore = document.getElementById("bestSc");

// variable which updated the current score on canvas once it is made equal to currentScoreOnCanvas
var currentScoreOnCanvas = document.getElementById("currentSc");

// variable which will be updated after every button press. this variable is only updated within the game
var currentScore = 0;

//variable which will hold the values of each tile in the canvas
var board = [[0, 0, 0, 0],
             [0, 0, 0, 0],
             [0, 0, 0, 0],
             [0, 0, 0, 0]]

// once a key is pressed the checkAction() will be executed
window.onkeydown = checkAction;

// function which sets up the board for a new game
function startGame() {

    // function which retrievs the highest score a user has obtained from local storage and displays it on the right handside above the canvas
    displayBestScore();

    // variable to generate an integer - either a 4 or a 2
    // 4 will be generated once in every 5 attempts
    // this is used to recreate what happens in the real game
    var cellValue = Math.floor(Math.random() * 5) === 0 ? 4 : 2;

    // the game begins with 2 tiles. Either a 2 and a 4 or a 2 and a 2. This is why the dropNewTile is called twice
    // a function which adds a number to the board variable. The number is passed as a parameter, in this case 2
    dropNewTile(2);
    // a function which adds a randomly generated number to the board variable. The number is either a 2 or a 4. The number is passed as a parameter.
    dropNewTile(cellValue);

    // a function which draws the board with the existing values in the board variable
    refresh();
}

// a function which drops a new tile in the board variable
function dropNewTile(cellValue) {

    // loop to generate a random location in the board variable
    // the loop will keep executing and will stop when the value of the generated location is 0 
    do {
        var x = Math.floor(Math.random() * 4);
        var y = Math.floor(Math.random() * 4);
    } while (board[x][y] != 0);

    // set the value of the randomly generated location to the variable which is passed as a parameter
    board[x][y] = cellValue;
}

// a function which determines the colour of each cell on the board depending on a variable which is passed as a parameter
function setColour(cellValue) {

    var cellColour = 'rgb(0, 0, 0)';

    // if statement which determines the colour of the cell depending on the parameter which is passed - cellValue
    if (cellValue == 0) {
        cellColour = 'rgb(211,211,211)';
    } else if (cellValue == 2) {
        cellColour = 'rgb(179, 255, 102)';
    } else if (cellValue == 4) {
        cellColour = 'rgb(128, 255, 0)'; 
    } else if (cellValue == 8) {
        cellColour = 'rgb(153, 204, 0)'; 
    } else if (cellValue == 16) {
        cellColour = 'rgb(255, 255, 102)';
    } else if (cellValue == 32) {
        cellColour = 'rgb(255, 255, 0)';
    } else if (cellValue == 64) {
        cellColour = 'rgb(230, 230, 0)';
    } else if (cellValue == 128) {
        cellColour = 'rgb(255, 179, 102)';
    } else if (cellValue == 256) {
        cellColour = 'rgb(255, 128, 0)';
    } else if (cellValue == 512) {
        cellColour = 'rgb(179, 89, 0)';
    } else if (cellValue == 1024) {
        cellColour = 'rgb(255, 159, 128)';
    } else if (cellValue == 2048) {
        cellColour = 'rgb(255, 102, 51)';
    } else if (cellValue == 4096) {
        cellColour = 'rgb(230, 57, 0)';
    } else if (cellValue == 8192) {
        cellColour = 'rgb(153, 38, 0)';
    }

    return cellColour;
}

// a function which draws the board with the existing values in the board variable
function refresh() {

    // determines the size of each cell in pixels
    var blockSize = 110;
    // determines the thickness of the grid which creates the space between the cells
    var padding = blockSize / 10;

    // draws the canvas and colours it in 
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgb(169,169,169)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // a for loop which will go through each position in the board variable
    // it will output all the values that the board variable contains
    // it will colour in all the cells with a value that is not equal to 0
    for (i = 0; i < board.length; i++) {
        for (j = 0; j < board.length; j++) {

            var cellValue = board[j][i];

            context.fillStyle = setColour(cellValue);
            context.fillRect(padding + (padding + blockSize) * i, padding + (padding + blockSize) * j, blockSize, blockSize);
            context.fillStyle = "black";
            context.font = "35px sans-serif";
            context.textAlign = "center";

            if (cellValue != 0) {
                context.fillText(cellValue, (padding + (padding + blockSize) * i) + 55, (padding + (padding + blockSize) * j) + 68);
            }
        }
    }

    currentScoreOnCanvas.innerHTML = currentScore;

}

// a function which checks if the button pressed is one of the arrow keys
function checkAction(button) {

    // for each arrow button there is a specific function to be executed
    if (button.keyCode == 37) {
        leftAction();
    } else if (button.keyCode == 39) {
        rightAction();
    } else if (button.keyCode == 40) {
        downAction();
    } else if (button.keyCode == 38) {
        upAction();
    }

}

// when the left arrow button is pressed each column is pushed to the left starting from the left most column
// if there are two cells with the same value they will merge into one cell with a doubled value
function leftAction() {

    // a variable to hold the values of the board array before any changes have been made
    var boardBefore = board.toString();

    // for loop which is executed twice
    for (h = 0; h < 2; h++) {
        // a nested for loop which goes through every cell of board
        for (i = 0; i < board.length; i++) {
            for (j = 1; j < board.length; j++) {
                // if statement that will only move the current cell to the left if it contains a value which is not equal to 0 
                if (board[i][j] != 0) {
                    // if statement that checks if the cell on the left is empty
                    if (board[i][j - 1] == 0) {
                        // the current cell is being moved to the left once
                        board[i][j - 1] = board[i][j];
                        board[i][j] = 0;
                    }

                }
            }
        }
    }

    // a nested for loop which merges every 2 matching cells which are next to each other into one and doubles its value
    for (i = 0; i < board.length; i++) {
        for (j = 1; j < board.length; j++) {
            // if statement that checks if the current cell is equal to 0
            if (board[i][j] != 0) {
                // if statement that checks if the cell on the left and the current cell are equal
                if (board[i][j - 1] == board[i][j]) {
                    // cells are being merged into one and the value of the new cell is doubled
                    board[i][j - 1] = board[i][j - 1] * 2;
                    //the current score is updated 
                    currentScore = currentScore + board[i][j - 1];
                    board[i][j] = 0;
                }

            }
        }
    }

    // for loop to push each new, merged cell to the left
    for (i = 0; i < board.length; i++) {
        for (j = 1; j < board.length; j++) {
            // if statement that will only move cells to the left if they contain a value which is not equal to 0
            if (board[i][j] != 0) {
                // if statement that checks if the cell on the left is empty
                if (board[i][j - 1] == 0) {
                    // the current cell is being moved to the left once
                    board[i][j - 1] = board[i][j];
                    board[i][j] = 0;
                }

            }
        }
    }

    // a variable to hold the values of the board array after the changes made by the for loops
    var boardAfter = board.toString();

    // an if statement to check if the board is full. If the board is full a new tile can't be dropped and the game is over
    if (checkIfFull()) {
        GameOver();
    }

    // a function which will determine whether a new tile should be dropped
    checkForBoardChange(boardBefore, boardAfter);

    // a function to draw the canvas after any changes that have been made
    refresh();

}

// when the right arrow button is pressed each column is pushed to the right starting from the right most column
// if there are two cells with the same value they will merge into one cell with a dobuled value
function rightAction() {

    // a variable to hold the values of the board array before any changes have been made
    var boardBefore = board.toString();

    // for loop which is executed twice
    for (h = 0; h < 2; h++) {
        // a nested for loop which goes through every cell of the board
        for (i = 0; i < board.length; i++) {
            for (j = 2; j > -1; j--) {
                // if statement that will only move the current cell to the right if it contains a value which is not equal to 0 
                if (board[i][j] != 0) {
                    // if statement that checks if the cell on the right is empty
                    if (board[i][j + 1] == 0) {
                        // the current cell is being moved to the right once
                        board[i][j + 1] = board[i][j];
                        board[i][j] = 0;
                    }

                }
            }
        }
    }

    // a nested for loop which merges every 2 matching cells which are next to each other into one and doubles its value
    for (i = 0; i < board.length; i++) {
        for (j = 2; j > -1; j--) {
            // if statement that checks if the current cell is equal to 0
            if (board[i][j] != 0) {
                // if statement that checks if the cell on the right and the current cell are equal
                if (board[i][j + 1] == board[i][j]) {
                    // cells are being merged into one and the value of the new cell is doubled
                    board[i][j + 1] = board[i][j + 1] * 2;
                    // the current score is updated
                    currentScore = currentScore + board[i][j + 1];
                    board[i][j] = 0;
                }
            }
        }
    }

    // for loop to push each new, merged cell to the right
    for (i = 0; i < board.length; i++) {
        for (j = 2; j > -1; j--) {
            // if statement that will only move cells to the right if they contain a value which is not equal to 0
            if (board[i][j] != 0) {
                // if statement that checks if the cell on the right is empty
                if (board[i][j + 1] == 0) {
                    // the current cell is being moved to the right once
                    board[i][j + 1] = board[i][j];
                    board[i][j] = 0;
                }

            }
        }
    }

    // a variable to hold the values of the board array after the changes made by the for loops
    var boardAfter = board.toString();

    // an if statement to check if the board is full. If the board is full a new tile can't be dropped and the game is over
    if (checkIfFull()) {
        GameOver();
    }

    // a function which will determine whether a new tile should be dropped
    checkForBoardChange(boardBefore, boardAfter);

    // a function to draw the canvas after any changes that have been made
    refresh();

}

// when the down arrow button is pressed each row is pushed down starting from the bottom most column
// if there are two cells with the same value they will merge into one cell with a dobuled value
function downAction() {

    // a variable to hold the values of the board array before any changes have been made
    var boardBefore = board.toString();

    // for loop which is executed twice
    for (h = 0; h < 2; h++) {
        // nested for loop to go through each cell in the board
        for (i = 2; i > -1; i--) {
            for (j = 0; j < board.length; j++) {
                // if statement checking if the current cell's value is not equal to 0
                if (board[i][j] != 0) {
                    // if statement to check if the cell below is empty
                    if (board[i + 1][j] == 0) {
                        // moves the current cell one position down
                        board[i + 1][j] = board[i][j];
                        board[i][j] = 0;
                    }

                }
            }
        }
    }

    // for loop which goes through each cell in the board
    for (i = 2; i > -1; i--) {
        for (j = 0; j < board.length; j++) {
            // if statement checking if the current cell's value is not equal to 0
            if (board[i][j] != 0) {
                // if statement checking if the value of the cell below is equal to the value of the current cell
                if (board[i + 1][j] == board[i][j]) {
                    // cells are being merged into one and the value of the new cell is doubled
                    board[i + 1][j] = board[i + 1][j] * 2;
                    // the current score is updated
                    currentScore = currentScore + board[i + 1][j];
                    board[i][j] = 0;
                }
            }
        }
    }

    // nested for loop to go through each cell in the board
    for (i = 2; i > -1; i--) {
        for (j = 0; j < board.length; j++) {
            // if statement checking if the current cell's value is not equal to 0
            if (board[i][j] != 0) {
                // if statement to check if the cell below is empty
                if (board[i + 1][j] == 0) {
                    // moves the current cell one position down
                    board[i + 1][j] = board[i][j];
                    board[i][j] = 0;
                }

            }
        }
    }

    // a variable to hold the values of the board array after the changes made by the for loops
    var boardAfter = board.toString();

    // an if statement to check if the board is full. If the board is full a new tile can't be dropped and the game is over
    if (checkIfFull()) {
        GameOver();
    }

    // a function which will determine whether a new tile should be dropped
    checkForBoardChange(boardBefore, boardAfter);

    // a function to draw the canvas after any changes that have been made
    refresh();

}

// when the up arrow button is pressed each row is pushed up starting from the top most column
// if there are two cells with the same value they will merge into one cell with a dobuled value
function upAction() {

    // a variable to hold the values of the board array before any changes have been made
    var boardBefore = board.toString();

    // for loop which is executed twice
    for (h = 0; h < 2; h++) {
        // nested for loop to go through each cell in the board
        for (i = 1; i < board.length; i++) {
            for (j = 0; j < board.length; j++) {
                // if statement checking if the current cell's value is not equal to 0
                if (board[i][j] != 0) {
                    // if statement to check if the cell above is empty
                    if (board[i - 1][j] == 0) {
                        // moves the current cell one position up
                        board[i - 1][j] = board[i][j];
                        board[i][j] = 0;
                    }
                }
            }
        }
    }

    // for loop which goes through each cell in the board
    for (i = 1; i < board.length; i++) {
        for (j = 0; j < board.length; j++) {
            // if statement checking if the current cell's value is not equal to 0
            if (board[i][j] != 0) {
                // if statement checking if the value of the cell above is equal to the value of the current cell
                if (board[i - 1][j] == board[i][j]) {
                    // cells are being merged into one and the value of the new cell is doubled
                    board[i - 1][j] = board[i - 1][j] * 2;
                    // the current score is updated
                    currentScore = currentScore + board[i - 1][j];
                    board[i][j] = 0;
                }
            }
        }
    }


    // nested for loop to go through each cell in the board
    for (i = 1; i < board.length; i++) {
        for (j = 0; j < board.length; j++) {
            // if statement checking if the current cell's value is not equal to 0
            if (board[i][j] != 0) {
                // if statement to check if the cell above is empty
                if (board[i - 1][j] == 0) {
                    // moves the current cell one position up
                    board[i - 1][j] = board[i][j];
                    board[i][j] = 0;
                }
            }
        }
    }

    // a variable to hold the values of the board array after the changes made by the for loops
    var boardAfter = board.toString();

    // an if statement to check if the board is full. If the board is full a new tile can't be dropped and the game is over
    if (checkIfFull()) {
        GameOver();
    }

    // a function which will determine whether a new tile should be dropped
    checkForBoardChange(boardBefore, boardAfter);

    // a function to draw the canvas after any changes that have been made
    refresh();

}

// a function which counts how many cells with value 0 exist on the board
function checkIfFull() {

    // a variable used to count the number of cells with value 0
    var counter = 0;

    // a for loop which goes through the board variable and counts the occurences of the number 0
    for (i = 0; i < board.length; i++) {
        var roll = board[i];
        var exists = roll.indexOf(0);
        if (exists > -1) {
            counter++
        }
    }

    // if the value of counter is equal to 0 the checkIfFull function will return true;
    if (counter == 0) {
        return true;
    } else {
        return false;
    }


}

// function to determine whether a new tile should be dropped 
function checkForBoardChange(boardBefore, boardAfter) {

    // if statement which checks if the board stayed the same before and after the button is pressed
    // if there was a change in the board a new tile with the value 2 is dropped
    // if the values in the board are not the same after the button action, a new tile with the value 2 is dropped
    // this can be demonstrated if the user keeps pressing the same button. At some point a new tile will no longer drop
    if (!(boardBefore === boardAfter)) {
        dropNewTile(2);
    }

}

// before beginning a new game, this function will reset the board and the current score
function resetBoard() {

    board = [[0, 0, 0, 0],
             [0, 0, 0, 0],
             [0, 0, 0, 0],
             [0, 0, 0, 0]]

    currentScore = 0;

}

// a function which will display the highest score that exists in local storage on the right handside above the canvas
function displayBestScore() {
    var localStorageBestScore = localStorage.getItem("bestScore");
    canvasBestScore.innerHTML = localStorageBestScore
}

// a function which will output an allert with a choice.The user can either click "ok" !or "cancel"
function GameOver() {
    alert("Game Over!\nCongratulations, you have achieved a new top score!\nYour score is: " + currentScore);
    saveScore();
    newGameRequest();
}

// this function will save the achieved score to the records of the user who is logged in. 
// If there is no one logged in the score will not be saved
function saveScore() {
    var localStorageBest = localStorage.getItem("bestScore");
    if (currentScore > localStorageBest){
        localStorage.setItem("bestScore", currentScore);
    }
}

// a function which will be triggered when the newGameButton is pressed
function newGameRequest() {

    // if statement to handle the button press
    if (checkIfFull()) {
        resetBoard();
        startGame();
    } else {
        // if the board is not full the user will be asked to confirm that he wants to start a new game
        if (window.confirm("Are you sure you want to attempt a new game? You will lose your progress!")) {
            resetBoard();
            startGame();
        }
    }


}

//when the html/css code is loaded the function startGame() will be executed
document.addEventListener('DOMContentLoaded', startGame);
