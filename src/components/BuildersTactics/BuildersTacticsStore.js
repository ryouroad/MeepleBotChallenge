import axios from 'axios'
const API_KEY = process.env.VUE_APP_API_KEY;
const SERVER_URL = process.env.VUE_APP_SERVER_URL;

export const buildersTacticsStore = {
    namespaced: true,
    state: {
        game: {
            board: Array(5).fill().map((_, i) => Array(5).fill().map((_, j) => {
                if (i === 0 & j === 2) return { type:"Queen", color: "Black", isPossibleMove: false, hasMoved: false }
                if (i === 4 & j === 2) return { type:"King", color: "Black", isPossibleMove: false, hasMoved: false }
            })),
            currentPlayer: 'White',
        },
    },
    mutations: {
        setGame(state, game) {
            state.game = game
        },
        switchPlayer(state) {
            state.game.currentPlayer = state.game.currentPlayer === 'Black' ? 'White' : 'Black'
        },
        setWinner(state, winner) {
            state.game.winner = winner; // winnerを状態に保存
        },
        setIsFeedbackLoading(state, isFeedbackLoading){
            state.isFeedbackLoading = isFeedbackLoading;
        },
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
    },
}
