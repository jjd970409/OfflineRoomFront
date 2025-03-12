<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click.stop="drawer = !drawer" color="white">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title>
        <img src="@/assets/MainLogo.png" alt="로고" height="40">  <span>방탈출 리뷰</span> </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text v-if="!isLoggedIn" @click="goToLogin">로그인</v-btn>
        <v-btn text v-if="!isLoggedIn" @click="goToRegister">회원가입</v-btn>
        <v-menu v-show="isLoggedIn" bottom left :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn
              color="white"
              dark
              v-bind="props"
              v-on="on"
              text
            >
             <v-icon left color="white">mdi-account-circle</v-icon>
              {{ username }}
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="goToMyPage">
              <v-list-item-content>
                <v-list-item-title>마이페이지</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-content>
                <v-list-item-title>로그아웃</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item link :to="{ path: '/' }" exact-active>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>홈</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name : 'ReviewList'}">
          <v-list-item-icon>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>리뷰 목록</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name : 'WriteReview'}" v-if="isLoggedIn">
            <v-list-item-icon>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>리뷰 작성</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item link :to="{name: 'Statistics'}" v-if="isLoggedIn">
            <v-list-item-icon>
              <v-icon>mdi-database</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>테마별 통계</v-list-item-title>
            </v-list-item-content>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
       <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} 방탈출 리뷰 사이트</span>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  components:{
  },
  data() {
    return {
      drawer: true,  // 사이드 메뉴 열림/닫힘 상태
      isLoggedIn: true, // 로그인 상태 (실제 로그인 로직에 따라 변경)
      username: '사용자', // 사용자 이름 (로그인 상태에 따라 변경)

    };
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'Login' }); 
    },
    goToRegister() {
      this.$router.push({ name: 'Register' }); 
    },
    goToMyPage() {
      this.$router.push({ name: 'MyPage' }); 
    },
    logout() {
      localStorage.removeItem('token'); // 토큰 삭제
      localStorage.removeItem('username');
      this.isLoggedIn = false;
      this.username = '';
      this.$router.push({ name: 'Login' });
    },
  },
    created() { //created 훅에서 localStorage, vuex등을 이용해 로그인 여부 확인
        // 예시: localStorage에서 토큰 확인
        const token = localStorage.getItem('token');
        if (token) {
            this.isLoggedIn = true;
            // 사용자 정보를 가져오는 로직 (예: API 호출)
            // this.fetchUserInfo(token);
             this.username = localStorage.getItem('username') || '사용자'; // 로컬 스토리지에서 사용자 이름 가져오기
        }
    },

};
</script>

<style scoped>

</style>