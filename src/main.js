import { createApp } from 'vue'
import axios from 'axios';
import App from './App.vue'
import router from './router';
import vuetify from './plugins/vuetify';
import './assets/css/common.css';

const app = createApp(App);

app.config.globalProperties.$axios = axios;

app.use(vuetify).use(router).mount('#app')
