import { createStore } from 'vuex';

export default createStore({
  state: {
    articles: {
      '1': {
        id: "1",
        title: 'ボドゲAIの開発',
        imageUrl: require('@/assets/MeepleBotBoardGame.jpg'), // 適切なパスを設定
        content: 'ここに記事1の内容が入ります。HTMLマークアップも含めることができます。'
      },
      // 他の記事データ...
    }
  },
  getters: {
    getArticleById: (state) => (id) => {
      return state.articles[id] || null;
    }
  }
});
