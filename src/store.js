import { createStore } from 'vuex';
import { articleStore } from './components/Article/ArticleStore';
import { reversiStore } from './components/Reversi/ReversiStore';

// Vuexストアの作成とモジュールの登録
export default createStore({
  modules: {
    articleStore,
    reversiStore,
  }
});
