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
        units: [],
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
        setUnitInfo(state, unit) {
            const index = state.units.findIndex(u => u.unit_id === unit.unit_id);
            if (index !== -1) {
                // Update existing unit
                state.units.splice(index, 1, unit);
            } else {
                // Add new unit
                state.units.push(unit);
            }
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
        setUnitInfo({ commit }, unit) {
            commit('setUnitInfo', unit);
        },
    },
    getters: {
        currentGameId: state => state.currentGameId,
        gameInfo: state => state.gameInfo,
        builds: state => state.builds,
        field: state => state.gameInfo.field,
        teamInfo: state => state.teamInfo,
        units: state => state.units,
    },
};
