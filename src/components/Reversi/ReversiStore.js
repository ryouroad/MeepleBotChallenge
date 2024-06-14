// ReversiStore.js
import axios from 'axios'
const API_KEY = process.env.VUE_APP_API_KEY;
const SERVER_URL = process.env.VUE_APP_SERVER_URL;

const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
];

function flipDiscs(board, x, y, color) {
    let flipped = false; // ひっくり返せたかどうかのフラグ
    for (const [dx, dy] of directions) {
        let i = x + dx, j = y + dy;
        const discsToFlip = [];
        while (i >= 0 && i < 8 && j >= 0 && j < 8 && board[j][i] === (color === 'black' ? 'white' : 'black')) {
            discsToFlip.push([i, j]);
            i += dx;
            j += dy;
        }
        if (i >= 0 && i < 8 && j >= 0 && j < 8 && board[j][i] === color) {
            for (const [i, j] of discsToFlip) {
                board[j][i] = color;
                flipped = true; // 石をひっくり返せた
            }
        }
    }
    // console.log("x:"+x+" y:"+y+" flipped:"+flipped);
    return flipped; // ひっくり返せたかどうかを返す
}

function isValidMove(board, x, y, color) {
    // 指定された位置にすでに石があるか、または盤外であれば無効
    // console.log(board[y][x]);
    if (board[y][x] !== null) return false;
    
    // 仮に石を置いてみて、ひっくり返せるかチェック
    const tempBoard = JSON.parse(JSON.stringify(board)); // 盤面のディープコピー
    tempBoard[y][x] = color; // 石を置く
    if (!flipDiscs(tempBoard, x, y, color)) {
        // ひっくり返せなかったら無効
        return false;
    }
    return true; // ひっくり返せるなら有効
}

function hasValidMove(board, color) {
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x] === null && isValidMove(board, x, y, color)) {
                return true; // 少なくとも1つ合法手が見つかった
            }
        }
    }
    return false; // 合法手がない
}

function calculateValidMoves(board, color) {
    const validMoves = [];
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x] === null && isValidMove(board, x, y, color)) {
                validMoves.push({ x, y });
            }
        }
    }
    return validMoves;
}


export const reversiStore = {
    namespaced: true,
    state: {
        game: {
            board: Array(8).fill().map((_, i) => Array(8).fill().map((_, j) => {
                if (i === 3 && j === 3 || i === 4 && j === 4) return 'white'
                if (i === 3 && j === 4 || i === 4 && j === 3) return 'black'
                return null
            })),
            currentPlayer: 'black',
        },
        chat: {
            messages: [],
            threadId: null,
        },
        isNextMoveLoading: false,
        isChatLoading: false,
    },
    mutations: {
        setGame(state) {
            const newGame = {
                board: Array(8).fill().map((_, i) => Array(8).fill().map((_, j) => {
                    if (i === 3 && j === 3 || i === 4 && j === 4) return 'white'
                    if (i === 3 && j === 4 || i === 4 && j === 3) return 'black'
                    return null
                })),
                currentPlayer: 'black',
            }
            state.game = newGame
        },
        addMessage(state, message) {
            state.chat.messages.push(message)
        },
        setBoard(state, { x, y, color }) {
            state.game.board[y][x] = color
        },
        switchPlayer(state) {
            state.game.currentPlayer = state.game.currentPlayer === 'black' ? 'white' : 'black'
        },
        setWinner(state, winner) {
            state.game.winner = winner; // winnerを状態に保存
        },
        setGameOver(state, isGameOver) {
            state.game.isGameOver = isGameOver; // ゲーム終了状態を更新
        },
        setIsNextMoveLoading(state, isNextMoveLoading) {
            state.isNextMoveLoading = isNextMoveLoading;
        },
        setIsChatLoading(state, isChatLoading) {
            state.isChatLoading = isChatLoading;
        },
        setThreadId(state, threadId) {
            state.chat.threadId = threadId;
        },
        setIsFeedbackLoading(state, isFeedbackLoading){
            state.isFeedbackLoading = isFeedbackLoading;
        }
    },
    actions: {
        async sendFeedback({ commit }, message) {
            commit('setIsFeedbackLoading', true); // ローディング開始
            const post_response = await axios.post(SERVER_URL+'feedback', {
                feedback: message,
            }, {
                headers: {
                    'x-api-key': API_KEY, // ヘッダーにAPIキーを追加
                }
            });
            console.log(post_response)
            commit('setIsFeedbackLoading', false); // ローディング終了
        },
        async sendMessage({ commit, state }, message) {
            commit('setIsChatLoading', true); // ローディング開始
            commit('addMessage', { text: message, sender: 'user' })
            const validMoves = calculateValidMoves(state.game.board, state.game.currentPlayer);
            const post_response = await axios.post(SERVER_URL+'reversi/chat', {
                board: state.game.board,
                currentPlayer: state.game.currentPlayer,
                validMoves: validMoves,
                question: message,
            }, {
                headers: {
                    'x-api-key': API_KEY, // ヘッダーにAPIキーを追加
                    'x-thread-id': state.chat.threadId,
                }
            });
            if(post_response.status===200){
                // console.log(post_response)
                var response = await axios.get(SERVER_URL+'reversi/chat', {
                    headers: {
                        'x-api-key': API_KEY, // ヘッダーにAPIキーを追加
                        'x-thread-id': post_response.data.threadId,
                        'x-run-id': post_response.data.runId,
                    }
                });
                while (response.status!=200){
                    response = await axios.get(SERVER_URL+'reversi/chat', {
                        headers: {
                            'x-api-key': API_KEY, // ヘッダーにAPIキーを追加
                            'x-thread-id': post_response.data.threadId,
                            'x-run-id': post_response.data.runId,
                        }
                    });
                }
            }
            // APIからチャットの返答を受け取る
            commit('setThreadId', response.data.threadId);
            commit('addMessage', { text: response.data.text, sender: 'ai' })
            commit('setIsChatLoading', false); // ローディング終了
        },
        handleMove({ commit, state, dispatch }, { x, y }) {
            // console.log('handleMove x:'+x+" y:"+y);
            const color = state.game.currentPlayer;
            if (!isValidMove(state.game.board, x, y, color)) {
                console.error("Invalid move");
                return;
            }
            commit('setBoard', { x, y, color });
            if (flipDiscs(state.game.board, x, y, color)) {
                commit('switchPlayer');
                // ターンを変えた後のプレイヤーが合法手を持っているかチェック
                if (!hasValidMove(state.game.board, state.game.currentPlayer)) {
                    // 次のプレイヤーが合法手を持っていない場合、もう一度プレイヤーを切り替え
                    commit('switchPlayer');
                    if (!hasValidMove(state.game.board, state.game.currentPlayer)) {
                        // どちらのプレイヤーも合法手を持っていない場合、ゲーム終了
                        dispatch('endGame');
                    }
                }
            } else {
                console.error("No discs flipped");
            }
        },
        endGame({ state, commit }) {
            let blackCount = 0;
            let whiteCount = 0;
            // 盤面をスキャンして、それぞれの石の数をカウント
            state.game.board.forEach(row => {
                row.forEach(cell => {
                    if (cell === 'black') blackCount++;
                    if (cell === 'white') whiteCount++;
                });
            });
    
            // 勝者を決定
            let winner = null;
            if (blackCount > whiteCount) {
                winner = 'black';
            } else if (whiteCount > blackCount) {
                winner = 'white';
            } // それ以外の場合は引き分け（winnerはnullのまま）
    
            // 結果を保存
            commit('setWinner', winner);
            commit('setGameOver', true);
        },
        async getNextMove({ commit, state, dispatch }) {
            const validMoves = calculateValidMoves(state.game.board, state.game.currentPlayer);
            if (validMoves.length === 0) {
                // 合法手がない場合、プレイヤーを切り替える
                commit('switchPlayer');
                // もう一度合法手があるかチェックし、もしなければゲーム終了
                if (!hasValidMove(state.game.board, state.game.currentPlayer)) {
                    dispatch('endGame');
                    return; // ゲーム終了なのでここで処理を終了
                }
                // プレイヤーを切り替えた後、合法手がある場合は処理を続ける
            }
            commit('setIsNextMoveLoading', true); // ローディング開始
            try {
                const post_response = await axios.post(SERVER_URL+'reversi/move', {
                    board: state.game.board,
                    currentPlayer: state.game.currentPlayer,
                    validMoves: validMoves, // ここに合法手を追加
                }, {
                    headers: {
                      'x-api-key': API_KEY // ヘッダーにAPIキーを追加
                    }
                });
                if(post_response.status===200){
                    // console.log(post_response)
                    var response = await axios.get(SERVER_URL+'reversi/move', {
                        headers: {
                          'x-api-key': API_KEY, // ヘッダーにAPIキーを追加
                          'x-thread-id': post_response.data.threadId,
                          'x-run-id': post_response.data.runId,
                        }
                    });
                    while (response.status!=200){
                        response = await axios.get(SERVER_URL+'reversi/move', {
                            headers: {
                                'x-api-key': API_KEY, // ヘッダーにAPIキーを追加
                                'x-thread-id': post_response.data.threadId,
                                'x-run-id': post_response.data.runId,
                            }
                        });
                    }
                }
                // APIから次の手の情報を受け取る
                const { x, y } = response.data;
            
                // 受け取った手をゲーム状態に適用する
                if (typeof x === 'number' && typeof y === 'number' && x != -1 && y != -1) {
                    // 石を置く処理を実行
                    commit('setBoard', { x, y, color: state.game.currentPlayer });
                    // 石をひっくり返す処理を実行
                    flipDiscs(state.game.board, x, y, state.game.currentPlayer);
                    // プレイヤーを切り替える
                    commit('switchPlayer');
                } else {
                    console.error('Invalid move received from backend');
                }
            } catch (error) {
              console.error('Error fetching next move:', error);
            }
            commit('setIsNextMoveLoading', false); // ローディング終了
        },
        resetGame({commit}){
            commit('setGame');
        }          
    },
}
