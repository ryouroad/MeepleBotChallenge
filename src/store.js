import { createStore } from 'vuex';
import { articleStore } from './components/Article/ArticleStore';
import { reversiStore } from './components/Reversi/ReversiStore';
import { chessStore } from './components/Chess/ChessStore';
import { buildersTacticsStore } from './components/BuildersTactics/BuildersTacticsStore';
import VueJwtDecode from 'vue-jwt-decode';
import createPersistedState from 'vuex-persistedstate';
import { enableUserTracking, disableUserTracking } from './tag.js';

export const authStore = {
  namespaced: true,
  state: () => ({
    token: "",
    name: ""
  }),
  mutations: {
    saveToken(state, { token, name }) {
      state.token = token;
      state.name = name;
      enableUserTracking(name);
    },
    removeToken(state) {
      state.token = "";
      state.name = "";
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
    getToken: state => state.token,
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
  },
  plugins: [createPersistedState()],
});
