// main.js
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router/index'
import { VueGtag } from "vue-gtag";

const app = createApp(App)

app.use(VueGtag, {
    config: { id: "G-XKPT97SQ4C" },
    appName: 'MeepleBotChallenge',
    pageTrackerScreenviewEnabled: true,
    debug: process.env.NODE_ENV !== 'production', // 開発環境でデバッグモードを有効にする
}, router);

app.use(store).use(router).mount('#app')
