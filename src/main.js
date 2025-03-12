import { createApp } from 'vue'
import axios from 'axios';
import App from './App.vue'
import router from './router';
import vuetify from './plugins/vuetify';
import VCalendar from 'v-calendar';
import './assets/css/common.css';
import 'v-calendar/style.css';
import StarRating from 'vue-star-rating';

const app = createApp(App);
app.component('star-rating', StarRating);
app.config.globalProperties.$axios = axios;

app.use(vuetify).use(VCalendar, {}).use(router).mount('#app')
