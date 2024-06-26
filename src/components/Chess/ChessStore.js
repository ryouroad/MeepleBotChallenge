import axios from 'axios'
const API_KEY = process.env.VUE_APP_API_KEY;
const SERVER_URL = process.env.VUE_APP_SERVER_URL;

// キングの位置を探す関数
function findKingPosition(board, color) {
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = board[y][x];
            if (piece.type === 'King' && piece.color === color) {
                return { x, y };
            }
        }
    }
    return null; // キングが見つからない場合（理論上は起こり得ないが）
}

// キングがチェックされているかどうかを判定する関数
function isKingChecked(board, color, lastMove) {
    const kingPosition = findKingPosition(board, color);
    if (!kingPosition) return false; // キングが見つからない場合はチェックされていないとする
    // console.log(kingPosition);
    const opponentColor = color === 'White' ? 'Black' : 'White';
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = board[y][x];
            if (piece.color === opponentColor) {
                const possibleMoves = calculatePossibleMoves(board, opponentColor, lastMove, piece, {x, y});
                // console.log(possibleMoves);
                for (const move of possibleMoves) {
                    if (move.x === kingPosition.x && move.y === kingPosition.y) {
                        // console.log("isKingChecked")
                        return true; // キングはチェックされている
                    }
                }
            }
        }
    }
    // console.log("isNotKingChecked")
    return false; // キングはチェックされていない
}

function calculatePossibleMoves(board, currentPlayer, lastMove, piece, position ) {
    // 移動可能なマスを格納する配列
    let possibleMoves = [];
    if (piece.color === currentPlayer){                
        // ピースがポーンの場合のみ処理を実行
        if (piece.type === 'Pawn') {
            const { x, y } = position;
            const direction = piece.color === 'White' ? -1 : 1; // 白は上(-1)に、黒は下(1)に進む
            // console.log(`Pawn move check ${x},${y},${direction}`);
            
            // ポーンの基本的な前進
            if (board[y + direction]?.[x].type === null) {
                possibleMoves.push({ x, y: y + direction });
                // 初手での2マス移動
                const startRow = piece.color === 'White' ? 6 : 1; // 白の開始行は6、黒の開始行は1
                if (y === startRow && board[y + 2 * direction]?.[x].type === null) {
                    possibleMoves.push({ x, y: y + 2 * direction });
                }
            }

            // 斜め前の敵ピースを取る
            [-1, 1].forEach(dx => {
                if (board[y + direction]?.[x + dx]?.color && board[y + direction][x + dx].color !== piece.color) {
                    possibleMoves.push({ x: x + dx, y: y + direction });
                }
            });

            // アンパサン
            const enemyMove = lastMove;
            // console.log("enemyMove",enemyMove)
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
                while (newX >= 0 && newX < 8 && board[y][newX].color === null) {
                    possibleMoves.push({ x: newX, y });
                    newX += dx;
                }
                // 他の色のピースを取ることができるかチェック
                if (newX >= 0 && newX < 8 && board[y][newX].color !== piece.color) {
                    possibleMoves.push({ x: newX, y });
                }
            }
        
            // 垂直方向の移動可能性をチェック
            for (let dy = -1; dy <= 1; dy += 2) {
                let newY = y + dy;
                while (newY >= 0 && newY < 8 && board[newY][x].color === null) {
                    possibleMoves.push({ x, y: newY });
                    newY += dy;
                }
                // 他の色のピースを取ることができるかチェック
                if (newY >= 0 && newY < 8 && board[newY][x].color !== piece.color) {
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
                if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && (board[newY][newX] === null || board[newY][newX].color !== piece.color)) {
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
                    if (board[newY][newX].color === null) {
                        // console.log(`Bishop add ${newX},${newY}`)
                        possibleMoves.push({ x: newX, y: newY });
                    } else {
                        // 他の色のピースを取ることができるかチェックし、できれば追加してループを抜ける
                        if (board[newY][newX].color !== piece.color) {
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
                if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && (board[newY][newX] === null || board[newY][newX].color !== piece.color)) {
                    possibleMoves.push({ x: newX, y: newY });
                }
            });

            // キャスリング
            if (!board[y][x].hasMoved) {
                const rookPositions = [0, 7]; // キングサイドとクイーンサイドのルークの位置
                rookPositions.forEach((rookX) => {
                    const rook = board[y][rookX];
                    if (rook && !rook.hasMoved && rook.type === 'Rook' && rook.color === piece.color) {
                        // キングとルークの間のマスをチェック
                        const step = rookX === 0 ? -1 : 1;
                        let canCastle = true;
                        for (let xCheck = x + step; xCheck !== rookX; xCheck += step) {
                            if (board[y][xCheck].type !== null) {
                                canCastle = false;
                                break;
                            }
                        }
                        if (canCastle) {
                            // キングのキャスリングの移動を追加
                            possibleMoves.push({ x: x + 2 * step, y: y });
                        }
                    }
                });
            }                    
        }            
    }
    return possibleMoves
}

function tempMovePiece(board, from, to) {
    // ボードの深いコピーを作成
    const newBoard = JSON.parse(JSON.stringify(board));
    // 移動する駒を取得
    const piece = newBoard[from.y][from.x];
    //ルークのキャスリングの動き
    if (piece.type === 'King' && Math.abs(from.x - to.x) === 2) {
        const rookX = to.x === 6 ? 7 : 0;
        const rookToX = to.x === 6 ? 5 : 3;
        const rook = newBoard[from.y][rookX];
        newBoard[from.y][rookToX] = rook;
        newBoard[from.y][rookToX].hasMoved = true;
        newBoard[from.y][rookX] = { type: null, color: null, isPossibleMove:false, hasMoved: false };
        // console.log("tempMoveCastling Rook")
    }
    // 移動先に駒を設置
    newBoard[to.y][to.x] = piece;
    // 元の位置を空にする
    newBoard[from.y][from.x] = { type: null, color: null, isPossibleMove: false, hasMoved: false };
    // 新しいボードの状態を返却
    return newBoard;
}


export const chessStore = {
    namespaced: true,
    state: {
        game: {
            board: Array(8).fill().map((_, i) => Array(8).fill().map((_, j) => {
                if (i === 0 & j === 0 | i === 0 & j === 7) return { type:"Rook", color: "Black", isPossibleMove: false, hasMoved: false }
                if (i === 0 & j === 1 | i === 0 & j === 6) return { type:"Knight", color: "Black", isPossibleMove: false, hasMoved: false }
                if (i === 0 & j === 2 | i === 0 & j === 5) return { type:"Bishop", color: "Black", isPossibleMove: false, hasMoved: false }
                if (i === 0 & j === 3) return { type:"Queen", color: "Black", isPossibleMove: false, hasMoved: false }
                if (i === 0 & j === 4) return { type:"King", color: "Black", isPossibleMove: false, hasMoved: false }
                if (i === 1) return { type:"Pawn", color: "Black", isPossibleMove: false, hasMoved: false }
                if (i === 6) return { type:"Pawn", color: "White", isPossibleMove: false, hasMoved: false }
                if (i === 7 & j === 0 | i === 7 & j === 7) return { type:"Rook", color: "White", isPossibleMove: false, hasMoved: false }
                if (i === 7 & j === 1 | i === 7 & j === 6) return { type:"Knight", color: "White", isPossibleMove: false, hasMoved: false }
                if (i === 7 & j === 2 | i === 7 & j === 5) return { type:"Bishop", color: "White", isPossibleMove: false, hasMoved: false }
                if (i === 7 & j === 3) return { type:"Queen", color: "White", isPossibleMove: false, hasMoved: false }
                if (i === 7 & j === 4) return { type:"King", color: "White", isPossibleMove: false, hasMoved: false }
                return { type:null, color: null, isPossibleMove: false, hasMoved: false }
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
        setGame(state) {
            const newGame = {
                board: Array(8).fill().map((_, i) => Array(8).fill().map((_, j) => {
                    if (i === 0 & j === 0 | i === 0 & j === 7) return { type:"Rook", color: "Black", isPossibleMove: false, hasMoved: false }
                    if (i === 0 & j === 1 | i === 0 & j === 6) return { type:"Knight", color: "Black", isPossibleMove: false, hasMoved: false }
                    if (i === 0 & j === 2 | i === 0 & j === 5) return { type:"Bishop", color: "Black", isPossibleMove: false, hasMoved: false }
                    if (i === 0 & j === 3) return { type:"Queen", color: "Black", isPossibleMove: false, hasMoved: false }
                    if (i === 0 & j === 4) return { type:"King", color: "Black", isPossibleMove: false, hasMoved: false }
                    if (i === 1) return { type:"Pawn", color: "Black", isPossibleMove: false, hasMoved: false }
                    if (i === 6) return { type:"Pawn", color: "White", isPossibleMove: false, hasMoved: false }
                    if (i === 7 & j === 0 | i === 7 & j === 7) return { type:"Rook", color: "White", isPossibleMove: false, hasMoved: false }
                    if (i === 7 & j === 1 | i === 7 & j === 6) return { type:"Knight", color: "White", isPossibleMove: false, hasMoved: false }
                    if (i === 7 & j === 2 | i === 7 & j === 5) return { type:"Bishop", color: "White", isPossibleMove: false, hasMoved: false }
                    if (i === 7 & j === 3) return { type:"Queen", color: "White", isPossibleMove: false, hasMoved: false }
                    if (i === 7 & j === 4) return { type:"King", color: "White", isPossibleMove: false, hasMoved: false }
                    return { type:null, color: null, isPossibleMove: false, hasMoved: false }
                })),
                currentPlayer: 'White',
                from: null,
                possibleMoves: null,
                showPromotionDialog: false,
                promotionPosition: null,
                lastMove: null,
            }
            state.game = newGame
            const newChat = {
                messages: [],
                threadId: null,
            }
            state.chat = newChat,
            state.isNextMoveLoading = false,
            state.isChatLoading = false
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
        setFrom(state, position){
            state.game.from = position
        },
        clearFrom(state){
            state.game.from = null
        },
        // ピースを移動させる
        movePiece(state, { from, to }) {
            const piece = state.game.board[from.y][from.x];
            piece.hasMoved = true;
            state.game.lastMove = {
                from,
                to,
                piece: Object.assign({}, piece),
            };
            state.game.board[to.y][to.x] = Object.assign({}, piece);
            state.game.board[from.y][from.x] = { type: null, color: null, isPossibleMove: false, hasMoved: false };
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
        checkSafeMoves({ commit, state }, {currentPlayer, piece, position }) {
            // `calculatePossibleMoves`から返されるPromiseを待機
            const possibleMoves = calculatePossibleMoves(state.game.board, currentPlayer, state.game.lastMove, piece, position)

            // `possibleMoves`が確実に配列であることを確認
            if (!Array.isArray(possibleMoves)) {
                console.error('possibleMoves is not an array:', possibleMoves);
                return; // 配列でなければ処理を中断
            }
    
            let safeMoves = possibleMoves.filter(move => {
                if(piece.type==='King' && Math.abs(move.x - position.x)===2){
                    return !isKingChecked(state.game.board, piece.color, state.game.lastMove);
                }
                const tempBoard = tempMovePiece(state.game.board, position, move);
                return !isKingChecked(tempBoard, piece.color, {from:position,to:move,piece:Object.assign({}, piece),});
            });
    
            if(safeMoves.length > 0){
                commit('setPossibleMoves', safeMoves);
                commit('setFrom', position);
            }

            return safeMoves
        },                
        // ピースを移動させるアクション
        performMove({ dispatch, commit, state }, { from, to }) {
            if(state.game.showPromotionDialog === false){    
                const piece = state.game.board[from.y][from.x];
                // アンパサンによる取り除きの処理
                // console.log(piece,from,to,state.game.board[from.y][to.x])
                if (piece.type === 'Pawn' && Math.abs(from.y - to.y) === 1 && Math.abs(from.x - to.x) === 1
                && state.game.board[to.y][to.x].type === null && state.game.board[from.y][to.x].type === 'Pawn' && state.game.board[from.y][to.x].color !== state.game.cur) {
                    state.game.board[from.y][to.x].type = null;
                    state.game.board[from.y][to.x].color = null;
                }
                //ルークのキャスリングの動き
                if (piece.type === 'King' && Math.abs(from.x - to.x) === 2) {
                    const rookX = to.x === 6 ? 7 : 0;
                    const rookToX = to.x === 6 ? 5 : 3;
                    const rook = state.game.board[from.y][rookX];
                    state.game.board[from.y][rookToX] = rook;
                    state.game.board[from.y][rookToX].hasMoved = true;
                    state.game.board[from.y][rookX] = { type: null, color: null, isPossibleMove:false, hasMoved: false };
                }
                commit('movePiece', { from, to });
                // プロモーションの検出
                if (piece.type === 'Pawn' && (to.y === 0 || to.y === 7)) {
                    dispatch('showPromotionDialog', { position: to });
                }
                dispatch('checkForEndGame');
                commit('clearPossibleMoves');
                commit('clearFrom');
            }
        },
        async checkAllSafeMoves({ state, dispatch, commit }) {
            let movePromises = [];
    
            // console.log("currentPlayer:",state.game.currentPlayer);
            // 盤上の各ピースに対して可能な移動を計算
            state.game.board.forEach((row, y) => {
                row.forEach((cell, x) => {
                    // console.log("from else:",x,y,cell.color,state.game.currentPlayer,cell.color===state.game.currentPlayer);
                    if (cell.color === state.game.currentPlayer) {
                        // 各駒に対して安全な移動をチェックするPromiseを生成
                        const from = { x, y }; // 移動元
                        // console.log("from:",from);
                        const movePromise = dispatch('checkSafeMoves', { currentPlayer:state.game.currentPlayer, piece: cell, position: from })
                            .then(moves => {
                                // 各移動先に対して{ from, to }の形式でオブジェクトを生成
                                return moves.map(to => ({ from, to }));
                            });
                        movePromises.push(movePromise);
                    }
                });
            });
    
            // Promise.allを使用して全てのプロミスが解決されるのを待ち、
            // 結果を平坦化して単一の配列にする
            const results = await Promise.all(movePromises);
            const flatResults = results.flat(); // 結果を平坦化
            // console.log(flatResults);
            commit('clearPossibleMoves');
            commit('clearFrom');
            return flatResults; // [{ from: {x, y}, to: {x, y} }, ...] 形式で返す
        },
        checkForEndGame({ dispatch, state, commit }) {
            // 白と黒の合法手を計算するためのPromise配列
            let whiteMovesPromises = [];
            let blackMovesPromises = [];
        
            // 盤上の各ピースに対して可能な移動を計算
            state.game.board.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell.type) {
                        if (cell.color === "White") {
                            const movePromise = dispatch('checkSafeMoves', {currentPlayer:"White", piece: cell, position: { x, y } }).then(moves => moves.length > 0); // 可能な移動があるかどうかを確認
                            // console.log(movePromise);
                            whiteMovesPromises.push(movePromise);
                        } else if (cell.color === "Black") {
                            const movePromise = dispatch('checkSafeMoves', {currentPlayer:"Black", piece: cell, position: { x, y } }).then(moves => moves.length > 0); // 可能な移動があるかどうかを確認
                            blackMovesPromises.push(movePromise);
                        }
                    }
                });
            });
        
            // 白の合法手が存在するか確認
            Promise.all(whiteMovesPromises).then(whiteResults => {
                const whiteHasLegalMoves = whiteResults.some(result => result);
                // console.log(whiteResults);
                // console.log(whiteHasLegalMoves);
                
                // 黒の合法手が存在するか確認
                Promise.all(blackMovesPromises).then(blackResults => {
                    const blackHasLegalMoves = blackResults.some(result => result);
                    // console.log(blackResults);
                    // console.log(blackHasLegalMoves);
        
                    // 勝敗の判定
                    if (!whiteHasLegalMoves && blackHasLegalMoves) {
                        commit('setWinner', 'Black'); // 白に合法手がなければ黒の勝ち
                    } else if (!blackHasLegalMoves && whiteHasLegalMoves) {
                        commit('setWinner', 'White'); // 黒に合法手がなければ白の勝ち
                    } else if (!whiteHasLegalMoves && !blackHasLegalMoves) {
                        commit('setWinner', 'Draw'); // どちらも合法手がなければ引き分け
                    }
                });
            });
        },
        async sendMessage({ dispatch, commit, state }, message) {
            commit('setIsChatLoading', true); // ローディング開始
            commit('addMessage', { text: message, sender: 'user' })
            const validMoves = await dispatch('checkAllSafeMoves');
            try{
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
            } catch (error) {
                console.error('Error fetching chat:', error);
            }
            commit('setIsChatLoading', false); // ローディング終了
        },
        async getNextMove({ commit, state, dispatch }) {
            const validMoves = await dispatch('checkAllSafeMoves');
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
                const { from, to } = response.data;
                if(state.game.board[from.y][from.x].color === state.game.currentPlayer){
                    dispatch('performMove',{from, to});
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
