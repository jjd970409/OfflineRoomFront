<template>
  <div class="signup-page">
    <v-container fluid class="signup-container">
      <v-row align="center" justify="center" class="h-100">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12 signup-card">
            <v-card-text class="text-center">
              <img
                src="@/assets/MainLogo.png"
                style="max-width: 200px; max-height: 200px"
                class="logo"
              />
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  prepend-icon="mdi-email"
                  class="input-field"
                  required
                >
                <template v-slot:append-outer>
                    <v-btn
                      v-if="!emailCheckResult"
                      :loading="loadingDuplicateCheck"
                      color="primary"
                      depressed
                      x-small
                      @click="checkDuplicate('email')"
                    >
                      중복 확인
                    </v-btn>
                   <v-icon v-else color="success">mdi-check-circle</v-icon>
                </template>
                </v-text-field>

                <v-text-field
                  v-model="userId"
                  :rules="userIdRules"
                  label="아이디"
                  prepend-icon="mdi-account"
                  class="input-field"
                  required
                >
                <template v-slot:append-outer>
                    <v-btn
                      v-if="!userIdCheckResult"
                      :loading="loadingDuplicateCheck"
                      color="primary"
                      depressed
                      x-small
                      @click="checkDuplicate('userId')"
                    >
                      중복 확인
                    </v-btn>
                    <v-icon v-else color="success">mdi-check-circle</v-icon>
                  </template>
                </v-text-field>

                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="비밀번호"
                  hint="최소 8자 이상"
                  counter
                  prepend-icon="mdi-lock"
                  class="input-field"
                  required
                  @click:append="show1 = !show1"
                ></v-text-field>

                <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show2 ? 'text' : 'password'"
                  label="비밀번호 확인"
                  prepend-icon="mdi-lock-check"
                  class="input-field"
                  required
                  @click:append="show2 = !show2"
                ></v-text-field>

                <v-btn
                  color="primary"
                  class="signup-button mt-4"
                  :disabled="!valid || !userIdCheckResult ||!emailCheckResult"
                  @click="submit"
                  :loading="loading"
                >
                  회원가입
                </v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn text @click="goToLogin">
                이미 계정이 있으신가요? 로그인
              </v-btn>
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
      email: "",
      userId: "",
      password: "",
      confirmPassword: "",
      show1: false,
      show2: false,
      valid: true,
      loading: false,
      loadingDuplicateCheck: false,
      userIdCheckResult: false, // 추가: 아이디 중복 확인 결과
      emailCheckResult: false, // 추가: 이메일 중복 확인 결과
      emailRules: [
        (v) => !!v || "이메일은 필수 입력 항목입니다.",
        (v) => /.+@.+\..+/.test(v) || "올바른 이메일 형식이 아닙니다.",
        (v) => { // vm 매개변수 제거, 로직 수정
            return !v || this.emailCheckResult === true  ? true : (this.emailCheckResult === false ? "이미 사용 중인 이메일입니다." : "중복 확인이 필요합니다.");
        }
      ],
      userIdRules: [
        (v) => !!v || "아이디는 필수 입력 항목입니다.",
        (v) =>
          (v && v.length >= 4) || "아이디는 최소 4자 이상이어야 합니다.",
          (v) => /^[a-zA-Z]+$/.test(v) || "아이디는 영문으로만 구성되어야 합니다.",
          (v) => { // vm 매개변수 제거, 로직 수정
            return !v || this.userIdCheckResult === true ? true : (this.userIdCheckResult === false ? "이미 사용중인 아이디 입니다." : "중복 확인이 필요합니다.");
        }
      ],
      passwordRules: [
        (v) => !!v || "비밀번호는 필수 입력 항목입니다.",
        (v) =>
          (v && v.length >= 8) || "비밀번호는 최소 8자 이상이어야 합니다.",
        // Add more password rules here, such as requiring numbers, special chars, etc.
      ],
      confirmPasswordRules: [
        (v) => !!v || "비밀번호 확인은 필수 입력 항목입니다.",
        (v) => v === this.password || "비밀번호가 일치하지 않습니다.",
      ],
    };
  },
  methods: {
     async checkDuplicate(type) {
      this.loadingDuplicateCheck = true; // 로딩 시작
      try {
          let value, apiUrl,resultKey;
        if(type === 'userId'){
            value = this.userId;
            apiUrl = `/api/check-duplicate/userid?userId=${value}`;
            resultKey = 'userIdCheckResult';
        }else if(type === 'email'){
            value = this.email;
            apiUrl = `/api/check-duplicate/email?email=${value}`;
            resultKey = 'emailCheckResult'
        }else{
            return;
        }
        if (!value) {
            alert(`${type === 'userId' ? '아이디' : '이메일'}를 입력해주세요.`);
            return;
        }

        const response = await this.$axios.get(apiUrl);

        if (response.data.isDuplicated) {
            this[resultKey] = false;
          alert(`${type === 'userId' ? '아이디' : '이메일'}가 이미 사용 중입니다.`);
        } else {

          this[resultKey] = true;
          alert(`${type === 'userId' ? '아이디' : '이메일'}를 사용할 수 있습니다.`);
        }
      } catch (error) {
        console.error("Duplicate check error:", error);
        alert("중복 확인 중 오류가 발생했습니다.");
        this.userIdCheckResult = false; // 오류 발생 시, 중복으로 간주하여 회원가입 버튼 비활성화
      } finally {
        this.loadingDuplicateCheck = false;
      }
    },

    async submit() {
        this.loading = true;
        if(this.$refs.form.validate()){
             this.$axios.post("http://localhost:8080/api/signup", {
                 userId: this.userId,
                 email: this.email,
                 password: this.password,
             }).then(() => {
                 alert("회원가입 성공!");
                 // 로그인 페이지 또는 홈 페이지로 리다이렉트
                  this.$router.push('/login');

             }).catch((error) => {
                 console.error("Signup error:", error);

                if (error.response && error.response.status === 409) {
                    // 이미 존재하는 아이디
                    alert(error.response.data); // 서버에서 보낸 메시지 표시
                }else {
                     // 기타 오류 처리
                    alert("회원가입 중 오류 발생.");
                }

             }).finally(()=>{
                 this.loading = false;
             });
        }else{
            this.loading = false;
            alert("입력값을 확인해주세요");
        }

    },
    goToLogin() {
      // 로그인 페이지로 이동하는 로직 (예: Vue Router 사용)
      this.$router.push("/login"); // '/login' 경로는 실제 로그인 페이지 경로로 변경
    },
  },
};
</script>

<style scoped>
.signup-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e0f2f7, #cce0ff);
}

.signup-container {
  width: 100%;
}

.signup-card {
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  padding: 2rem;
}

.logo {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 1.5rem;
}

.input-field {
  margin-bottom: 1.5rem;
}

.signup-button {
  width: 100%;
  border-radius: 24px;
  padding: 1rem 2rem 1 2;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.signup-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.h-100 {
  height: 100%;
}
</style>