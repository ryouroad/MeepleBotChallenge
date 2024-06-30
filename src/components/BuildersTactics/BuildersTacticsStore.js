// buildersTacticsStore.js
export const buildersTacticsStore = {
    namespaced: true,
    state: {
        currentGameId: null,
        gameInfo: {
            field: null,
        },
        builds: [
            {
                build_id: "",
                build_name: "",
            },
        ],
        teamInfo:{
            colors: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33'],
            icons: ['mdi-bat', 'mdi-snake', 'mdi-dolphin', 'mdi-jellyfish'],
        },
    },
    mutations: {
        setCurrentGameId(state, gameId) {
            state.currentGameId = gameId;
        },
        setGameInfo(state, gameInfo) {
            state.gameInfo = gameInfo;
        },
        setBuilds(state, builds) {
            state.builds = builds;
        },
        setField(state, field) {
            state.gameInfo.field = field;
        },
    },
    actions: {
        setCurrentGameId({ commit }, gameId) {
            commit('setCurrentGameId', gameId);
        },
        setGameInfo({ commit }, gameInfo) {
            commit('setGameInfo', gameInfo);
        },
        setBuilds({ commit }, builds) {
            commit('setBuilds', builds);
        },
        setField({ commit }, field) {
            commit('setField', field);
        },
    },
    getters: {
        currentGameId: state => state.currentGameId,
        gameInfo: state => state.gameInfo,
        builds: state => state.builds,
        field: state => state.gameInfo.field,
        teamInfo: state => state.teamInfo,
    },
};
