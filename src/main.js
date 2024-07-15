// main.js
import { createApp, computed } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router/index'
import VueGtag from 'vue-gtag-next'
import vuetify from './vuetify'

const getUserName = computed(() => store.getters['authStore/getName']);

const app = createApp(App)

app.use(VueGtag, {
  property: {
    id: process.env.VUE_APP_GTAG_ID, 
    params: {
      user_id: getUserName.value ? getUserName.value : null,
    }
  },
  useDebugger: process.env.NODE_ENV !== 'production',
}).use(store).use(router).use(vuetify).mount('#app')
