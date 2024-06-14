import { createStore } from 'vuex';
import { articleStore } from './components/Article/ArticleStore';
import { reversiStore } from './components/Reversi/ReversiStore';
import { chessStore } from './components/Chess/ChessStore';
import { buildersTacticsStore } from './components/BuildersTactics/BuildersTacticsStore';
import VueJwtDecode from 'vue-jwt-decode';
import createPersistedState from 'vuex-persistedstate';
import { enableUserTracking, disableUserTracking } from './tag.js';
import { commonStore } from './components/Common/commonStore';

export const authStore = {
  namespaced: true,
  state: () => ({
    refresh_token : null,
    id_token : null,
    access_token : null,
    name: null
  }),
  mutations: {
    saveToken(state, { token, name }) {
      if(token.refresh_token){
        state.refresh_token = token.refresh_token;
      }
      state.id_token = token.id_token;
      state.access_token = token.access_token;
      state.name = name;
      enableUserTracking(name);
    },
    removeToken(state) {
      state.refresh_token = null,
      state.id_token = null,
      state.access_token = null,
      state.name = null;
      disableUserTracking();
    }
  },
  actions: {
    saveToken({ commit }, token) {
      if (token?.id_token) {
        try {
          const payload = VueJwtDecode.decode(token.id_token);
          const name = payload['cognito:username'];
          commit("saveToken", { token, name });
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      } else {
        console.error("id_token is undefined. Token object:", token);
      }
    },
    removeToken({ commit }) {
      commit("removeToken");
    }
  },
  getters: {
    getRefreshToken: state => state.refresh_token,
    getIdToken: state => state.id_token,
    getAccessToken: state => state.access_token,
    getName: state => state.name
  }
};

// Create and export the Vuex store
export default createStore({
  modules: {
    articleStore,
    reversiStore,
    chessStore,
    buildersTacticsStore,
    authStore,
    commonStore,
  },
  plugins: [createPersistedState()],
});
