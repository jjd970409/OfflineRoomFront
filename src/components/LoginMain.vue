<template>
  <div class="login-page">
    <v-container fluid class="login-container">
      <v-row align="center" justify="center" class="h-100">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12 login-card">
            <v-card-text class="text-center">
              <img src="@/assets/MainLogo.png" style="max-width: 200px; max-height: 200px;" />
              <v-text-field
                label="아이디"
                v-model="userId"
                prepend-icon="mdi-account"
                class="input-field"
                :disabled="loading"
              ></v-text-field>
              <v-text-field
                label="비밀번호"
                v-model="password"
                type="password"
                prepend-icon="mdi-lock"
                class="input-field"
                :disabled="loading"
              ></v-text-field>
              <v-btn color="primary" @click="login" class="login-button mt-4" :loading="loading">
                로그인
              </v-btn>
            </v-card-text>
            <v-card-actions class="justify-center">
            <v-btn class="ma-2" outlined color="primary" @click="naverLogin" :disabled="loading">
              <img src="@/assets/login_naver.png" style="max-width: 50px; max-height: 50px;" />
            </v-btn>
            <v-btn class="ma-2" outlined color="yellow" @click="kakaoLogin" :disabled="loading">
              <img src="@/assets/login_kakao.png" style="max-width: 50px; max-height: 50px;" />
            </v-btn>
            <v-btn text :disabled="loading" @click="account_create()">회원가입</v-btn>
            <v-btn text @click="testProxy">Proxy Test</v-btn>
          </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: '',
      password: '',
      loading: false, // 로딩 상태 추가
      errorMessage: '', // 에러 메시지 추가
    };
  },
   methods: {
    login() {
      this.loading = true;
      this.errorMessage = ''; 

      this.$axios
        .post('http://localhost:8080/api/login', { // <-- 상대 경로 '/login' 사용 (pathRewrite 설정에 따라)
          userId: this.userId,
          password: this.password,
        })
       .then((response) => {
          // 로그인 성공 처리
          console.log('로그인 성공:', response.data);
          
          // localStorage에 저장
          localStorage.setItem('accessToken', response.data.accessToken);

          alert(response.data.response_msg);
          this.$router.push('/');
        })
        .catch((error) => {
          // 로그인 실패 처리
          console.error('로그인 실패:', error);
          if (error.response && error.response.status === 401) {
                    // 401 Unauthorized 에러 처리
                    if (error.response.data) {
                        alert(error.response.data); // 서버 메시지 표시
                    } else {
                        alert("인증에 실패했습니다.");
                    }
                } else {
                    // 기타 에러 처리
                    alert("로그인 중 오류가 발생했습니다.");
                    console.error(error); // 자세한 에러 정보 출력
                    // this.$router.push('/');
                }
        }).finally(() => {
        this.loading = false; // 요청 완료 후 (성공/실패 모두) 로딩 종료
      });
    },

    account_create(){
         this.$router.push('/signup');
    },

    testProxy() {
       this.$axios.get('/test') // <--  '/test'로 GET 요청
         .then(response => {
           console.log('Proxy Test Response:', response.data);
           alert(response.data); // 응답 메시지 표시
         })
         .catch(error => {
           console.error('Proxy Test Error:', error);
         });
     },
  },
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e0f2f7, #cce0ff);
}

.login-container {
  width: 100%;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  padding: 2rem;
}

.logo {
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 1.5rem;
}

.input-field {
  margin-bottom: 1.5rem;
}

.login-button {
  width: 100%;
  border-radius: 24px;
  padding: 1rem 2rem 1 2;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.login-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.h-100 {
  height: 100%;
}
</style>