/* eslint-disable no-console */

import { register } from 'register-service-worker'
import Vue from 'vue'
import vuetify from './vuetify' // Vuetifyの設定があるファイルをインポート

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      showNotification('App is being served from cache by a service worker. For more details, visit https://goo.gl/AFskqB')
    },
    registered () {
      showNotification('Service worker has been registered.')
    },
    cached () {
      showNotification('Content has been cached for offline use.')
    },
    updatefound () {
      showNotification('New content is downloading.')
    },
    updated () {
      showNotification('New content is available; please refresh.')
    },
    offline () {
      showNotification('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
      showNotification('Error during service worker registration. Check the console for more details.')
    }
  })
}

function showNotification(message) {
  const NotificationComponent = Vue.extend({
    vuetify,
    data: () => ({ message }),
    template: '<v-snackbar v-model="value" :timeout="6000">{{ message }}</v-snackbar>',
    data() {
      return {
        value: true
      }
    }
  })

  const component = new NotificationComponent()
  component.$mount()
  document.body.appendChild(component.$el)
}
