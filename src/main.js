// main.js
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router/index'
import VueGtag from 'vue-gtag-next'

const app = createApp(App)

app.use(VueGtag, {
  property: {
    id: process.env.VUE_APP_GTAG_ID, 
    params:{
      user_id: null,
    }
  },
  useDebugger: process.env.NODE_ENV !== 'production',
}).use(store).use(router).mount('#app')
