// buildersTacticsStore.js
export const buildersTacticsStore = {
    namespaced: true,
    state: {
        currentGameId: null,
        teamInfo:{
            colors: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33'],
            icons: ['mdi-bat', 'mdi-snake', 'mdi-dolphin', 'mdi-jellyfish'],
        },
        builds: [
            {
                build_id: "",
                build_name: "",
            },
        ],
        gameInfo: {
            setting: {
                rule: 'normal',
            },
            field: null,
        },
        units: [],
        selectedBuild: null,
        parts: [],
        selectedUnit: null,
        icons: { 
            enemy: 'mdi-skull',
            two_leg: 'mdi-foot-print',
            multi_leg: 'mdi-spiedr',
            caterpillar: 'mdi-tank',
            jet: 'mdi-airplane',
            propellar: 'mdi-wind-power',
            infight: 'mdi-sword',
            bullet: 'mdi-ammunition',
            enrgy: 'mdi-lighting-bolt',
            break: 'mdi-skull-crossbones',
            attack: 'mdi-sword-cross',
            move: 'mdi-shoe-print',
            optical: 'mdi-crosshairs-gps',
            sound: 'mdi-volume-medium',            
            heat: 'mdi-fire',
            full_attack: 'mdi-sword',
            defense: 'mdi-shield',
            blitz: 'mdi-flash',
        },
        displaySearch: true,
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
        setUnits(state, units) {
            state.units = units
        },
        setSelectedBuild(state, build){
            state.selectedBuild = build;
        },
        setParts(state, parts) {
            state.parts = parts
        },
        setSelectedUnit(state, unit){
            state.selectedUnit = unit;
        },
        setDisplaySearch(state, displaySearch){
            state.displaySearch = displaySearch;
        }
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
        setUnits({ commit }, units) {
            commit('setUnits', units);
        },
        setSelectedBuild({ commit }, build) {
            commit('setSelectedBuild', build);
        },
        setParts({ commit }, parts) {
            commit('setParts', parts);
        },
        setSelectedUnit({ commit }, unit) {
            commit('setSelectedUnit', unit);
        },
        setDisplaySearch({ commit }, displaySearch) {
            commit('setDisplaySearch', displaySearch);
        },
    },
    getters: {
        currentGameId: state => state.currentGameId,
        gameInfo: state => state.gameInfo,
        builds: state => state.builds,
        field: state => state.gameInfo.field,
        teamInfo: state => state.teamInfo,
        units: state => state.units,
        selectedBuild: state => state.selectedBuild,
        parts: state => state.parts,
        selectedUnit: state => state.selectedUnit,
        icons: state => state.icons,
        displaySearch: state => state.displaySearch,
    },
};
