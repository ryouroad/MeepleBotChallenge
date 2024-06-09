import { createRouter, createWebHashHistory } from 'vue-router';
import App from '@/App.vue'
import MainViewer from '@/components/MainViewer.vue';
import ArticleViewer from '@/components/Article/ArticleViewer.vue';
import ReversiViewer from '@/components/Reversi/ReversiViewer.vue';
import ChessViewer from '@/components/Chess/ChessViewer.vue';
import BuildersTacticsViewer from '@/components/BuildersTactics/BuildersTacticsViewer.vue';
import { trackRouter } from "vue-gtag-next";

const routes = [
  {
    path: '/',
    name: 'Top',
    component: App,
    components: {
      Main: MainViewer
    },
  },
  {
    path: '/reversi',
    name: 'Reversi',
    components: {
      Main: ReversiViewer
    },
  },
  {
    path: '/chess',
    name: 'Chess',
    components: {
      Main: ChessViewer
    },
  },
  {
    path: '/buildersTactics',
    name: 'BuildersTactics',
    components: {
      Main: BuildersTacticsViewer
    },
  },
  {
    path: '/articles/:id',
    name: 'Article',
    components: {
      Main: ArticleViewer
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ selector: to.hash });
        }, 500); // 500ミリ秒後にハッシュへスクロール
      });
    }
  },
});
trackRouter(router);
export default router;