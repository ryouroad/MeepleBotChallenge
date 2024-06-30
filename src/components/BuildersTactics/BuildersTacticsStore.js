// buildersTacticsStore.js
export const buildersTacticsStore = {
    namespaced: true,
    state: {
        currentGameId: null,
        gameInfo: null,
    },
    mutations: {
        setCurrentGameId(state, gameId) {
            state.currentGameId = gameId;
        },
        setGameInfo(state, gameInfo) {
            state.gameInfo = gameInfo;
        },
    },
    actions: {
        setCurrentGameId({ commit }, gameId) {
            commit('setCurrentGameId', gameId);
        },
        setGameInfo({ commit }, gameInfo) {
            commit('setGameInfo', gameInfo);
        },
    },
    getters: {
        currentGameId: state => state.currentGameId,
        gameInfo: state => state.gameInfo,
    },
};
