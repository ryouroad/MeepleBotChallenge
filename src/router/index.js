import { createRouter, createWebHistory } from 'vue-router';
import App from '@/App.vue'
import ArticleViewer from '@/components/Article/ArticleViewer.vue';
import ReversiViewer from '@/components/Reversi/ReversiViewer.vue';

const routes = [
  {
    path: '/',
    name: 'Top',
    component: App
  },
  {
    path: '/article/:id',
    name: 'Article',
    components: {
      Main: ArticleViewer
    },
  },
  {
    path: '/reversi',
    name: 'Reversi',
    components: {
      Main: ReversiViewer
    },
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;