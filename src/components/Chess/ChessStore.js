import axios from 'axios'
const API_KEY = process.env.VUE_APP_API_KEY;
const SERVER_URL = process.env.VUE_APP_SERVER_URL;

export const chessStore = {
    namespaced: true,
    state: {
        game: {
            board: Array(8).fill().map((_, i) => Array(8).fill().map((_, j) => {
                if (i === 0 & j === 0 | i === 0 & j === 7) return { type:"Rook", color: "Black", isPossibleMove: false }
                if (i === 0 & j === 1 | i === 0 & j === 6) return { type:"Knight", color: "Black", isPossibleMove: false }
                if (i === 0 & j === 2 | i === 0 & j === 5) return { type:"Bishop", color: "Black", isPossibleMove: false }
                if (i === 0 & j === 3) return { type:"Queen", color: "Black", isPossibleMove: false }
                if (i === 0 & j === 4) return { type:"King", color: "Black", isPossibleMove: false }
                if (i === 1) return { type:"Pawn", color: "Black", isPossibleMove: false }
                if (i === 6) return { type:"Pawn", color: "White", isPossibleMove: false }
                if (i === 7 & j === 0 | i === 7 & j === 7) return { type:"Rook", color: "White", isPossibleMove: false }
                if (i === 7 & j === 1 | i === 7 & j === 6) return { type:"Knight", color: "White", isPossibleMove: false }
                if (i === 7 & j === 2 | i === 7 & j === 5) return { type:"Bishop", color: "White", isPossibleMove: false }
                if (i === 7 & j === 3) return { type:"Queen", color: "White", isPossibleMove: false }
                if (i === 7 & j === 4) return { type:"King", color: "White", isPossibleMove: false }
                return { type:null, color: null, isPossibleMove: false }
            })),
            currentPlayer: 'White',
            from: null,
            possibleMoves: null,
            showPromotionDialog: false,
            promotionPosition: null,
            lastMove: null,
        },
        chat: {
            messages: [],
            threadId: null,
        },
        isNextMoveLoading: false,
        isChatLoading: false,
    },
    mutations: {
        setGame(state, game) {
            state.game = game
        },
        addMessage(state, message) {
            state.chat.messages.push(message)
        },
        switchPlayer(state) {
            state.game.currentPlayer = state.game.currentPlayer === 'Black' ? 'White' : 'Black'
        },
        setWinner(state, winner) {
            state.game.winner = winner; // winnerを状態に保存
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
        },
        setFrom(state, position){
            state.game.from = position
        },
        clearFrom(state){
            state.game.from = null
        },
        // ピースを移動させる
        movePiece(state, { from, to }) {
            const piece = state.game.board[from.y][from.x];
            state.game.lastMove = {
                from,
                to,
                piece: Object.assign({}, piece),
            };
            state.game.board[to.y][to.x] = Object.assign({}, piece);
            state.game.board[from.y][from.x].type = null;
            state.game.board[from.y][from.x].color = null;
            // プレイヤーの切り替え
            state.game.currentPlayer = state.game.currentPlayer === 'Black' ? 'White' : 'Black';
        },
        setPossibleMoves(state, moves) {
            // console.log("setPossibleMoves")
        
            // 新しいボードを作成して、すべてのisPossibleMoveをfalseにリセット
            const newBoard = state.game.board.map(row => 
                row.map(cell => ({ ...cell, isPossibleMove: false }))
            );
            
            // moves配列に含まれる位置のisPossibleMoveをTrueに設定
            moves.forEach(({ x, y }) => {
                if (newBoard[y] && newBoard[y][x]) {
                    // 直接newBoardを更新
                    newBoard[y][x] = { ...newBoard[y][x], isPossibleMove: true };
                    // console.log(x, y);
                }
            });
            
            // 新しいボードでstate.game.boardを更新
            // この代入によりVueのリアクティブ性がトリガーされる
            state.game.board = newBoard;
        },
        
        clearPossibleMoves(state) {
            state.game.board = state.game.board.map(row => 
                row.map(cell => ({ ...cell, isPossibleMove: false }))
            );
            state.game.possibleMoves = null
        },

        promotePawn(state, { position, newType }) {
            // console.log("promotePawn" + position.x + position.y + newType);
            const { x, y } = position;
            state.game.board[y][x].type = newType;
        },

        setPromotionPosition(state, position) {
            state.game.promotionPosition = position;
        },
        updateShowPromotionDialog(state, value) {
            state.game.showPromotionDialog = value;
        },
    },
    actions: {
        showPromotionDialog({ commit }, { position }) {
            commit('setPromotionPosition', position);
            commit('updateShowPromotionDialog', true);
        },
        calculatePossibleMoves({ commit, state }, { piece, position }) {
            // 移動可能なマスを格納する配列
            let possibleMoves = [];
            if (piece.color === state.game.currentPlayer){                
                // ピースがポーンの場合のみ処理を実行
                if (piece.type === 'Pawn') {
                    const { x, y } = position;
                    const direction = piece.color === 'White' ? -1 : 1; // 白は上(-1)に、黒は下(1)に進む
                    // console.log(`Pawn move check ${x},${y},${direction}`);
                    
                    // ポーンの基本的な前進
                    if (state.game.board[y + direction]?.[x].type === null) {
                        possibleMoves.push({ x, y: y + direction });
                        // 初手での2マス移動
                        const startRow = piece.color === 'White' ? 6 : 1; // 白の開始行は6、黒の開始行は1
                        if (y === startRow && state.game.board[y + 2 * direction]?.[x].type === null) {
                            possibleMoves.push({ x, y: y + 2 * direction });
                        }
                    }
        
                    // 斜め前の敵ピースを取る
                    [-1, 1].forEach(dx => {
                        if (state.game.board[y + direction]?.[x + dx]?.color && state.game.board[y + direction][x + dx].color !== piece.color) {
                            possibleMoves.push({ x: x + dx, y: y + direction });
                        }
                    });

                    // アンパサン
                    const enemyMove = state.game.lastMove;
                    // console.log(enemyMove)
                    if (enemyMove !== null){
                        if (enemyMove.piece.type === 'Pawn' && Math.abs(enemyMove.from.y - enemyMove.to.y) === 2
                            && Math.abs(enemyMove.to.x - x) === 1 && enemyMove.to.y === y) {
                            const direction = piece.color === 'White' ? -1 : 1;
                            possibleMoves.push({ x: enemyMove.to.x, y: enemyMove.to.y + direction });
                        }
                    }
                }
                if (piece.type === 'Rook' | piece.type === 'Queen') {
                    const { x, y } = position;
                
                    // 水平方向の移動可能性をチェック
                    for (let dx = -1; dx <= 1; dx += 2) {
                        let newX = x + dx;
                        while (newX >= 0 && newX < 8 && state.game.board[y][newX].color === null) {
                            possibleMoves.push({ x: newX, y });
                            newX += dx;
                        }
                        // 他の色のピースを取ることができるかチェック
                        if (newX >= 0 && newX < 8 && state.game.board[y][newX].color !== piece.color) {
                            possibleMoves.push({ x: newX, y });
                        }
                    }
                
                    // 垂直方向の移動可能性をチェック
                    for (let dy = -1; dy <= 1; dy += 2) {
                        let newY = y + dy;
                        while (newY >= 0 && newY < 8 && state.game.board[newY][x].color === null) {
                            possibleMoves.push({ x, y: newY });
                            newY += dy;
                        }
                        // 他の色のピースを取ることができるかチェック
                        if (newY >= 0 && newY < 8 && state.game.board[newY][x].color !== piece.color) {
                            possibleMoves.push({ x, y: newY });
                        }
                    }
                }
                if (piece.type === 'Knight') {
                    const { x, y } = position;
                    // ナイトの移動可能な8方向
                    const moves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
                
                    moves.forEach(([dx, dy]) => {
                        const newX = x + dx, newY = y + dy;
                        // ボードの範囲内であるか、移動先に自分のピースがないことを確認
                        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && (state.game.board[newY][newX] === null || state.game.board[newY][newX].color !== piece.color)) {
                            possibleMoves.push({ x: newX, y: newY });
                        }
                    });
                }
                if (piece.type === 'Bishop' || piece.type === 'Queen') {
                    const { x, y } = position;
                    // ビショップまたはクイーンの移動可能な4つの斜め方向
                    const directions = [
                        { dx: 1, dy: -1 }, // 右上
                        { dx: 1, dy: 1 },  // 右下
                        { dx: -1, dy: -1 }, // 左上
                        { dx: -1, dy: 1 }  // 左下
                    ];
                
                    directions.forEach(({ dx, dy }) => {
                        let newX = x, newY = y; // 初期位置を設定
                        const flag = true;
                        while (flag) { // 無限ループ
                            newX += dx; // 次の位置へ移動
                            newY += dy;
                            
                            // 盤面の範囲を超えたらループを抜ける
                            if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) {
                                break;
                            }
                            
                            // 次のマスが空いていれば、可能な移動として追加
                            if (state.game.board[newY][newX].color === null) {
                                // console.log(`Bishop add ${newX},${newY}`)
                                possibleMoves.push({ x: newX, y: newY });
                            } else {
                                // 他の色のピースを取ることができるかチェックし、できれば追加してループを抜ける
                                if (state.game.board[newY][newX].color !== piece.color) {
                                    // console.log(`Bishop take ${newX},${newY}`)
                                    possibleMoves.push({ x: newX, y: newY });
                                }
                                break; // 自分のピースまたは相手のピースに遭遇したらループを抜ける
                            }
                        }
                    });
                }                              
                if (piece.type === 'King') {
                    const { x, y } = position;
                
                    // キングの移動可能な8方向（水平、垂直、斜め）
                    const moves = [
                        [1, 0], [1, 1], [0, 1], [-1, 1], 
                        [-1, 0], [-1, -1], [0, -1], [1, -1]
                    ];
                
                    moves.forEach(([dx, dy]) => {
                        const newX = x + dx, newY = y + dy;
                        // ボードの範囲内かつ移動先に自分のピースがないことを確認
                        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && (state.game.board[newY][newX] === null || state.game.board[newY][newX].color !== piece.color)) {
                            possibleMoves.push({ x: newX, y: newY });
                        }
                    });
                }            
            }
            // console.log(possibleMoves)
        
            // 計算した移動可能なマスをステートにコミット
            if(possibleMoves.length > 0){
                commit('setPossibleMoves', possibleMoves);
                commit('setFrom', position)
            }

            return possibleMoves
        },
        // ピースを移動させるアクション
        performMove({ dispatch, commit, state }, { from, to }) {
            if(state.game.showPromotionDialog === false){    
                const piece = state.game.board[from.y][from.x];
                // アンパサンによる取り除きの処理
                console.log(piece,from,to,state.game.board[from.y][to.x])
                if (piece.type === 'Pawn' && Math.abs(from.y - to.y) === 1 && Math.abs(from.x - to.x) === 1
                && state.game.board[to.y][to.x].type === null && state.game.board[from.y][to.x].type === 'Pawn' && state.game.board[from.y][to.x].color !== state.game.currentPlayer ) {
                    state.game.board[from.y][to.x].type = null;
                    state.game.board[from.y][to.x].color = null;
                }
                commit('movePiece', { from, to });
                // プロモーションの検出
                if (piece.type === 'Pawn' && (to.y === 0 || to.y === 7)) {
                    // console.log("Promotion");
                    // プロモーション処理のためのフラグを立てる、またはプロモーションUIを表示
                    // ここで、プロモーションUIを表示するロジックを追加します
                    dispatch('showPromotionDialog', { position: to });
                }
                dispatch('checkForEndGame');
                commit('clearPossibleMoves');
                commit('clearFrom');
            }
        },
        checkForEndGame({ dispatch, state, commit }) {
            // キングの存在確認
            let whiteKingPresent = false;
            let blackKingPresent = false;
            const movePromises = [];
        
            // 各ピースに対して可能な移動を計算
            state.game.board.forEach((row, y) => {
              row.forEach((cell, x) => {
                if (cell.type === "King") {
                  if (cell.color === "White") whiteKingPresent = true;
                  if (cell.color === "Black") blackKingPresent = true;
                }
        
                // 合法的な移動が存在するかどうかを計算
                if (cell.type) {
                    const movePromise = dispatch('calculatePossibleMoves', { piece: cell, position: { x, y } })
                    .then(moves => {
                      if (moves.length > 0) {
                        return true; // 可能な移動がある
                      }
                      return false; // 可能な移動がない
                    });
                    movePromises.push(movePromise);
                }
              });
            });
        
            // 勝敗の決定
            // 全ての可能な移動の計算後に実行
            Promise.all(movePromises).then(results => {
                const possibleMoves = results.filter(result => result === true).length;
                if (!whiteKingPresent) {
                  commit('setWinner', 'Black');
                } else if (!blackKingPresent) {
                  commit('setWinner', 'White');
                } else if (possibleMoves === 0) {
                  commit('setWinner', 'Draw');
                }
            });
        },
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
        /*
        async sendMessage({ commit, state }, message) {
            commit('setIsChatLoading', true); // ローディング開始
            commit('addMessage', { text: message, sender: 'user' })
            const validMoves = calculateValidMoves(state.game.board, state.game.currentPlayer);
            const post_response = await axios.post(SERVER_URL+'chess/chat', {
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
                var response = await axios.get(SERVER_URL+'chess/chat', {
                    headers: {
                        'x-api-key': API_KEY, // ヘッダーにAPIキーを追加
                        'x-thread-id': post_response.data.threadId,
                        'x-run-id': post_response.data.runId,
                    }
                });
                while (response.status!=200){
                    response = await axios.get(SERVER_URL+'chess/chat', {
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
                const post_response = await axios.post(SERVER_URL+'chess/move', {
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
                    var response = await axios.get(SERVER_URL+'chess/move', {
                        headers: {
                          'x-api-key': API_KEY, // ヘッダーにAPIキーを追加
                          'x-thread-id': post_response.data.threadId,
                          'x-run-id': post_response.data.runId,
                        }
                    });
                    while (response.status!=200){
                        response = await axios.get(SERVER_URL+'chess/move', {
                            headers: {
                                'x-api-key': API_KEY, // ヘッダーにAPIキーを追加
                                'x-thread-id': post_response.data.threadId,
                                'x-run-id': post_response.data.runId,
                            }
                        });
                    }
                }
                // APIから次の手の情報を受け取る
                // const { x, y } = response.data;
        
            } catch (error) {
              console.error('Error fetching next move:', error);
            }
            commit('setIsNextMoveLoading', false); // ローディング終了
        }, */       
    },
}
