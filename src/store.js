import { createStore } from 'vuex';
import { articleStore } from './components/Article/ArticleStore';
import { reversiStore } from './components/Reversi/ReversiStore';
import { chessStore } from './components/Chess/ChessStore';
import VueJwtDecode from 'vue-jwt-decode';
import createPersistedState from 'vuex-persistedstate'

export const authStore = {
  namespaced: true,
  state () {
    return {
      token: "",
      name: ""
    }
  },
  mutations: {
    saveToken (state,{token,name}) {
      state.token = token
      state.name = name
    },
    removeToken(state){
      state.token = ""
      state.name = ""
    }
  },
  actions: {
    saveToken({commit}, token) {
      // console.log("Token object:", token);

      if (token && token.id_token) {
        const id_token = token.id_token;
        // console.log("ID Token:", id_token);

        try {
          const payload = VueJwtDecode.decode(id_token);
          // console.log("Decoded Payload:", payload);
          const name = payload['cognito:username'];
          // console.log("Name:", name);
          commit("saveToken",{ token, name });
        } catch (error) {
            console.error("Failed to decode token:", error);
        }
      } else {
        console.error("id_token is undefined. Token object:", token);
      }
    }, 
    removeToken({commit}){
        commit("removeToken")
    }
  },
  getters: {
    getToken: state => {
      return state.token
    },
    getName: state => {
      // console.log(state.name)
      return state.name
    }
  }
}

// Vuexストアの作成とモジュールの登録
export default createStore({
  modules: {
    articleStore,
    reversiStore,
    chessStore,
    authStore,
  },
  plugins: [createPersistedState()],
})