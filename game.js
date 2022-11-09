// var config = {
//     draggable: true,
//     position: 'start',
//     moveSpeed: 'slow'
//   }
  
// board = new ChessBoard('board1', config);
game = new Chess();

var board = null
var game = new Chess()

/*
 * Piece Square Tables, adapted from Sunfish.py:
 * https://github.com/thomasahle/sunfish/blob/master/sunfish.py
 */

var weights = { p: 100, n: 280, b: 320, r: 479, q: 929, k: 60000, k_e: 60000 };
var pst_w = {
  p: [
    [100, 100, 100, 100, 105, 100, 100, 100],
    [78, 83, 86, 73, 102, 82, 85, 90],
    [7, 29, 21, 44, 40, 31, 44, 7],
    [-17, 16, -2, 15, 14, 0, 15, -13],
    [-26, 3, 10, 9, 6, 1, 0, -23],
    [-22, 9, 5, -11, -10, -2, 3, -19],
    [-31, 8, -7, -37, -36, -14, 3, -31],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    [-66, -53, -75, -75, -10, -55, -58, -70],
    [-3, -6, 100, -36, 4, 62, -4, -14],
    [10, 67, 1, 74, 73, 27, 62, -2],
    [24, 24, 45, 37, 33, 41, 25, 17],
    [-1, 5, 31, 21, 22, 35, 2, 0],
    [-18, 10, 13, 22, 18, 15, 11, -14],
    [-23, -15, 2, 0, 2, 0, -23, -20],
    [-74, -23, -26, -24, -19, -35, -22, -69],
  ],
  b: [
    [-59, -78, -82, -76, -23, -107, -37, -50],
    [-11, 20, 35, -42, -39, 31, 2, -22],
    [-9, 39, -32, 41, 52, -10, 28, -14],
    [25, 17, 20, 34, 26, 25, 15, 10],
    [13, 10, 17, 23, 17, 16, 0, 7],
    [14, 25, 24, 15, 8, 25, 20, 15],
    [19, 20, 11, 6, 7, 6, 20, 16],
    [-7, 2, -15, -12, -14, -15, -10, -10],
  ],
  r: [
    [35, 29, 33, 4, 37, 33, 56, 50],
    [55, 29, 56, 67, 55, 62, 34, 60],
    [19, 35, 28, 33, 45, 27, 25, 15],
    [0, 5, 16, 13, 18, -4, -9, -6],
    [-28, -35, -16, -21, -13, -29, -46, -30],
    [-42, -28, -42, -25, -25, -35, -26, -46],
    [-53, -38, -31, -26, -29, -43, -44, -53],
    [-30, -24, -18, 5, -2, -18, -31, -32],
  ],
  q: [
    [6, 1, -8, -104, 69, 24, 88, 26],
    [14, 32, 60, -10, 20, 76, 57, 24],
    [-2, 43, 32, 60, 72, 63, 43, 2],
    [1, -16, 22, 17, 25, 20, -13, -6],
    [-14, -15, -2, -5, -1, -10, -20, -22],
    [-30, -6, -13, -11, -16, -11, -16, -27],
    [-36, -18, 0, -19, -15, -15, -21, -38],
    [-39, -30, -31, -13, -31, -36, -34, -42],
  ],
  k: [
    [4, 54, 47, -99, -99, 60, 83, -62],
    [-32, 10, 55, 56, 56, 55, 10, 3],
    [-62, 12, -57, 44, -67, 28, 37, -31],
    [-55, 50, 11, -4, -19, 13, 0, -49],
    [-55, -43, -52, -28, -51, -47, -8, -50],
    [-47, -42, -43, -79, -64, -32, -29, -32],
    [-4, 3, -14, -50, -57, -18, 13, 4],
    [17, 30, -3, -14, 6, -1, 40, 18],
  ],

  // King endgame multipliers
  k_e: [
    [-50, -40, -30, -20, -20, -30, -40, -50],
    [-30, -20, -10, 0, 0, -10, -20, -30],
    [-30, -10, 20, 30, 30, 20, -10, -30],
    [-30, -10, 30, 40, 40, 30, -10, -30],
    [-30, -10, 30, 40, 40, 30, -10, -30],
    [-30, -10, 20, 30, 30, 20, -10, -30],
    [-30, -30, 0, 0, 0, 0, -30, -30],
    [-50, -30, -30, -30, -30, -30, -30, -50],
  ],
};
var pst_b = {
  p: pst_w['p'].slice().reverse(),
  n: pst_w['n'].slice().reverse(),
  b: pst_w['b'].slice().reverse(),
  r: pst_w['r'].slice().reverse(),
  q: pst_w['q'].slice().reverse(),
  k: pst_w['k'].slice().reverse(),
  k_e: pst_w['k_e'].slice().reverse(),
};

function eval(game, move) {
    // store old fen string and evalutate the board after the move
    let oldFen = game.fen();
    console.log(game.fen());
    game.move(move, { sloppy: true });
    console.log(game.fen());
    let sum = 0;
    let fen = game.fen();
    let rank = 7;
    let file = 0;
    for (let i = 0; i < fen.length; i++) {
        switch(fen[i]) {
            case 'p':
                sum += weights['p'] + pst_b['p'][rank][file];
                file++;
                break;
            case 'n':
                sum += weights['n'] + pst_b['n'][rank][file];
                file++;
                break;
            case 'b':
                sum += weights['b'] + pst_b['b'][rank][file];
                file++;
                break;
            case 'r': 
                sum += weights['r'] + pst_b['r'][rank][file];
                file++;
                break;
            case 'q': 
                sum += weights['q'] + pst_b['q'][rank][file];
                file++;
                break;
            case 'P':
                sum -= weights['p'] + pst_w['p'][rank][file];
                file++;
                break;
            case 'N':
                sum -= weights['n'] + pst_w['n'][rank][file];
                file++;
                break;
            case 'B':
                sum -= weights['b'] + pst_w['b'][rank][file];
                file++;
                break;
            case 'R': 
                sum -= weights['r'] + pst_w['r'][rank][file];
                file++;
                break;
            case 'Q': 
                sum -= weights['q'] + pst_w['q'][rank][file];
                file++;
                break;
            case '1':
                file += 1;
                break;
            case '2':
                file += 2;
                break;
            case '3':
                file += 3;
                break;
            case '4':
                file += 4;
                break;
            case '5':
                file += 5;
                break;
            case '6':
                file += 6;
                break;
            case '7':
                file += 7;
                break;
            case '8':
                file += 8;
                break;
            case '/':
                file = 0;
                rank--;
                break;
            default:
                sum += 0;
                break;
        }
    }
    game.load(oldFen);
    return sum;
}

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) return false
}

function makeBestMove () {
    let moves = game.moves();
    let max = -1e6;
    let bestMove = 0;
    for (let i = 0; i < moves.length; i++) {
        // if (eval(game, moves[i]) > max) {
        //     max = eval(game, moves[i]);
        //     bestMove = i;
        //     }
        let sum = eval(game, moves[i]);
        let oldFen = game.fen();
        game.move(moves[i]);
        let newMoves = game.moves();
        for (let j = 0; j < newMoves.length; j++) {
            if (eval(game, newMoves[j]) + sum > max) {
                max = eval(game, newMoves[j]) + sum;
                bestMove = i;
            }
        }
        game.load(oldFen);
    }
    game.move(moves[bestMove], { sloppy: true });
    board.position(game.fen());
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  // make best move for black
  window.setTimeout(makeBestMove, 250)

}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board.position(game.fen())
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}
board = Chessboard('board1', config)
