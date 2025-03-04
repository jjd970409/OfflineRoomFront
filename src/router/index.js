import { createRouter, createWebHistory } from 'vue-router';
import LoginMain from '@/components/LoginMain.vue'; 
import MainOffline from '@/components/MainOffline.vue'; 

const routes = [
  { path: '/',name:'Home', component: MainOffline },
  { path: '/login',name:'login', component: LoginMain },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;