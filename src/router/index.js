import { createRouter, createWebHistory } from 'vue-router';
import LoginMain from '@/components/LoginMain.vue'; 
import MainOffline from '@/components/MainOffline.vue'; 
import WriteReview from '@/components/review/ReviewWrite.vue'; 
import ReviewList from '@/components/main/MainReviewList.vue'; 
import AccountCreate from '@/components/AccountCreate.vue'; 

const routes = [
  {
    path: '/',
    component: MainOffline, // 이제 Home은 레이아웃 컴포넌트가 됩니다.
    children: [ // 자식 라우트
      {
        path: '', //  '/' 경로에 빈 path를 설정하면, 부모('/')로 접근했을 때 기본적으로 표시
        name: 'Home',
        component: ReviewList, // 기본 페이지는 리뷰 목록.  Home.vue는 빈 껍데기.
      },
      {
        path: 'review-list', //  '/review-list' 경로는 부모 경로('/')에 상대적
        name: 'ReviewList',
        component: ReviewList,
      },
      {
        path: 'write-review',
        name: 'WriteReview',
        component: WriteReview,
        meta: { requiresAuth: true },
      },     
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginMain,
  },
  {
    path: '/signup',
    name: 'signup',
    component: AccountCreate,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAuth && !localStorage.getItem('token')) { // 토큰 확인
//     next('/login'); // 로그인 페이지로 리디렉션
//   } else {
//     next(); // 다음 훅으로 이동
//   }
// });

export default router;