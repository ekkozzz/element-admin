import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import http from './http'
import './assets/global.css'

import * as dayjs from 'dayjs'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

Vue.config.productionTip = false
Vue.prototype.$http = http

Vue.filter('dateFormat', function(date) {
  if (!date) return '---'
  return dayjs(date * 1000).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
