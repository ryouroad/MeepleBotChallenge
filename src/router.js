import { createRouter, createWebHistory } from 'vue-router';
import ArticleViewer from '@/components/ArticleViewer.vue'; // 正しいパスを確認してください

const routes = [
  {
    path: '/article/:id',
    name: 'Article',
    component: ArticleViewer
  }
  // 他のルート定義
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
