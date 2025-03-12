<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card elevation="3" outlined>
          <v-card-title class="text-h5 text-center primary--text">
            <h2><v-icon left>mdi-pencil</v-icon>
            방구석 리뷰</h2>
          </v-card-title>
          <v-card-text>
            <v-alert v-if="errorMessage" type="error" dismissible>
              {{ errorMessage }}
            </v-alert>

            <v-form ref="form" @submit.prevent="uploadFiles">
              <v-text-field
                v-model="reviewData.themeName"
                label="테마 이름"
                :rules="[rules.required]"
                required
                prepend-icon="mdi-gamepad-variant"
                color="primary"
                outlined
                dense
              ></v-text-field>

              <v-text-field
                v-model="reviewData.title"
                label="제목"
                :rules="[rules.required]"
                required
                prepend-icon="mdi-format-title"
                color="primary"
                outlined
                dense
              ></v-text-field>

              <v-textarea
                v-model="reviewData.content"
                label="리뷰 내용"
                :rules="[rules.required, rules.maxLength]"
                :counter="maxLength"
                required
                prepend-icon="mdi-comment-text-outline"
                color="primary"
                outlined
                dense
                auto-grow
                rows="5"
                hint="자세하고 솔직한 리뷰를 작성해주세요!"
                persistent-hint
              ></v-textarea>

              <v-row>
                <v-col>
                  <v-text-field
                    :value="dateFormatted"
                    v-model="dateFormatted"
                    prepend-icon="mdi-calendar"
                    @blur="handleBlur"
                    outlined
                    dense
                    label="방문 일시"
                    readonly
                    @click="isCalendarOpen = !isCalendarOpen"
                  ></v-text-field>
                  <div
                    v-if="isCalendarOpen"
                    class="calendar-container"
                  >
                  <v-calendar
                    :value="reviewData.visitDate"
                    :attributes="attributes"
                    @dayclick="handleDayClick"
                    no-title
                    @blur="handleBlur"
                   />
                   </div>
                </v-col>
              </v-row>

              <v-row>
                <v-col
                    v-for="(image, index) in reviewData.images"
                    :key="index"
                    cols="12"
                    sm="4"
                    md="3"
                    lg="2"
                    >
                    <v-card>
                        <v-img
                        :src="image.preview"
                        aspect-ratio="1"
                        class="grey lighten-2"
                        ></v-img>

                        <v-card-actions>
                            <v-btn
                                icon
                                color="red"
                                @click="removeImage(index)"
                                >
                                <v-icon>mdi-close-circle</v-icon>
                            </v-btn>

                        </v-card-actions>
                    </v-card>
                </v-col>
                   <v-col cols="12" sm="4" md="3" lg="2">
                    <v-card
                        outlined
                        height="100%"
                        class="d-flex align-center justify-center"
                        @click="selectImage"
                        style="cursor: pointer"
                        >

                        <v-icon size="99">mdi-plus</v-icon>

                      </v-card>
                </v-col>

              </v-row>
                <input
                    type="file"
                    ref="imageInput"
                    accept="image/*"
                    multiple
                    @change="onImageChange"
                    style="display: none"
                />



              <v-row>
                <v-col cols="12" sm="4">
                  <v-slider
                    v-model="reviewData.difficulty"
                    label="난이도"
                    :min="0"
                    :max="5"
                    thumb-label="always"
                    :step="0.5"
                    color="indigo"
                    track-color="grey lighten-3"
                    class="mt-4"
                  ></v-slider>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-slider
                    v-model="reviewData.fear"
                    label="공포도"
                    :min="0"
                    :max="5"
                    thumb-label="always"
                    :step="0.5"
                    color="red"
                    track-color="grey lighten-3"
                    class="mt-4"
                  ></v-slider>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-slider
                    v-model="reviewData.activity"
                    label="활동성"
                    :min="0"
                    :max="5"
                    thumb-label="always"
                    :step="0.5"
                    color="green"
                    track-color="grey lighten-3"
                    class="mt-4"
                  ></v-slider>
                </v-col>
              </v-row>

              <div class="text-center my-4">
                <span class="text-subtitle-1 font-weight-bold mr-2"
                  >총점:</span
                >
                <div class="star-rating-wrapper">
                  <star-rating
                    v-model="reviewData.rating"
                    :increment="0.5"
                    :star-size="40"
                    :show-rating="true"
                    active-color="#fdd835"
                    inactive-color="#e0e0e0"
                    :padding="10"
                    :border-width="1"
                    border-color="#fdd835"
                    :rounded-corners="true"
                    :glow="1"
                    glow-color="#fdd835"
                  ></star-rating>
                </div>
              </div>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-checkbox
                    v-model="reviewData.spoiler"
                    label="스포일러 포함"
                    color="warning"
                    hide-details
                    dense
                    class="mt-0"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-checkbox
                    v-model="reviewData.private"
                    label="나만 보기"
                    color="secondary"
                    hide-details
                    dense
                    class="mt-0"
                  ></v-checkbox>
                </v-col>
              </v-row>

              <v-overlay :value="loading" absolute opacity="0.2">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
              </v-overlay>

              <v-divider class="my-4"></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="loading"
                  :disabled="loading"
                  elevation="2"
                  @click="uploadFiles"
                >
                  <v-icon left>mdi-check</v-icon>
                  작성 완료
                </v-btn>
                <v-btn
                  color="grey"
                  @click="goBack"
                  :disabled="loading"
                  elevation="2"
                  text
                >
                  <v-icon left>mdi-close</v-icon>
                  취소
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  components: {

  },
  data() {
    return {
      maxLength: 500,
      reviewData: {
        themeName: "",
        title: "",
        content: "",
        rating: 0,
        spoiler: false,
        private: false,
        images: [], // 이미지 파일들을 저장할 배열, 객체 형태로 변경
        visitDate: new Date(), // Date 객체로 초기화
        difficulty: 0, // 난이도
        fear: 0, // 공포도
        activity: 0, // 활동성
      },
      isCalendarOpen: false,
      loading: false,
      errorMessage: "",
      rules: {
        required: (value) => !!value || "필수 입력 항목입니다.",
        maxLength:
          (value) =>
          (value && value.length <= this.maxLength) ||
          `최대 ${this.maxLength}자까지 입력 가능합니다.`,
      },
      dateMenu: false, // 날짜 메뉴
      attributes: [ // 추가: v-calendar에 표시할 속성 (예: 특정 날짜 강조)
          {
            key: 'today',
            highlight: true, // true로 명시해야 강조됨.
          },
        ],
    };
  },
  computed: {
      dateFormatted() {
        const date = new Date(this.reviewData.visitDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}년 ${month}월 ${day}일`;

      },
  },
  methods: {
    goBack() {
      if (this.reviewData.title || this.reviewData.content) {
        this.$confirm("입력한 내용이 저장되지 않습니다. 정말 취소하시겠습니까?").then((confirmed) => {
          if (confirmed) this.$router.go(-1);
        });
      } else {
        this.$router.go(-1);
      }
    },
    selectImage() {
        this.$refs.imageInput.click(); //숨겨진 input[type="file"] 엘리먼트를 클릭
    },
    onImageChange(event) {
        const files = event.target.files;
        if (!files) return;

        if (this.reviewData.images.length + files.length > 3) { // 이미지 3장 제한
          this.errorMessage = "이미지는 최대 5장까지 업로드 가능합니다.";
          alert("이미지는 최대 5장까지 업로드 가능합니다.");
          return;
        }

        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 5 * 1024 * 1024) { // 5MB 제한
              this.errorMessage = "이미지 파일은 5MB 이하여야 합니다.";
              return;
            }

            const file = files[i];
            const reader = new FileReader(); //FileReader 객체는 웹 애플리케이션이 비동기적으로 데이터를 읽기 위하여 읽을 파일을 가리키는 File 혹은 Blob 객체를 이용해 파일의 내용을(혹은 raw data buffer) 읽고 사용자의 컴퓨터에 저장하는 것을 가능하게 해줍니다.

            reader.onload = (e) => { //reader에 onload 핸들러 추가, 읽기 동작이 완료된 경우 실행
                this.reviewData.images.push({
                file: file,
                preview: e.target.result,  // FileReader로 읽은 이미지 데이터 (Data URL)
                });
            };
            reader.readAsDataURL(file); //파일을 Data URL 형식으로 읽음
        }
        //console.log(this.reviewData.images);
        this.$refs.imageInput.value = null; //같은 이미지를 다시 선택할수 있게
    },
  removeImage(index) {
        this.reviewData.images.splice(index, 1);
    },
  toggleDateMenu() {
    console.log("dateMenu:", this.dateMenu);
    this.dateMenu = !this.dateMenu;
  },
  handleDayClick(day) { // v-calendar에서 날짜 클릭 시 호출
        console.log(day.date);
        this.reviewData.visitDate = new Date(day.date); // 선택한 날짜로 visitDate 업데이트
        this.isCalendarOpen = false; // 캘린더 닫기
      },
  handleBlur() {
      setTimeout(() => {
        this.isCalendarOpen = false;
      }, 150); // 약간의 지연 (밀리초 단위)
    },   
  async uploadFiles() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loading = true;
      this.errorMessage = "";

      // 이미지 업로드 (FormData 사용)
      const formData = new FormData();
        //이미지 파일들을 formData에 추가
      for (let i = 0; i < this.reviewData.images.length; i++) {
        formData.append("images", this.reviewData.images[i].file);
      }
      //다른 데이터 추가
      formData.append("themeName", this.reviewData.themeName);
      formData.append("title", this.reviewData.title);
      formData.append("content", this.reviewData.content);
      formData.append("rating", this.reviewData.rating);
      formData.append("spoiler", this.reviewData.spoiler);
      formData.append("private", this.reviewData.private);
      formData.append("visitDate", this.reviewData.visitDate);
      formData.append("difficulty", this.reviewData.difficulty);
      formData.append("fear", this.reviewData.fear);
      formData.append("activity", this.reviewData.activity);

      try {
        const token = localStorage.getItem("token");
        const response = await this.$axios.post("http://localhost:8080/api/reviews/write", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // FormData를 사용할 때 필요
          },
        });
        console.log("리뷰 작성 성공:", response.data);
        this.$router.push({ name: "ReviewList" });
      } catch (error) {
        console.error("리뷰 작성 실패:", error);
        if (error.response) {
          this.errorMessage =
            error.response.data.message || "리뷰 작성에 실패했습니다.";
        } else if (error.request) {
          this.errorMessage = "서버와 통신할 수 없습니다.";
        } else {
          this.errorMessage = "리뷰 작성 중 오류가 발생했습니다.";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* vuetify 스타일 커스터마이징은 deep selector 사용 */
:deep(.v-card) {
  border-radius: 10px; /* 카드 모서리 둥글게 */
}

:deep(.v-input--dense .v-input__control) {
  min-height: 36px; /* 밀집된 인풋 높이 조절. */
}

:deep(.v-text-field--outlined fieldset) {
  border-color: #888; /* 아웃라인 색상 */
}
:deep(.v-text-field--outlined.v-input--is-focused fieldset) {
  border-width: 2px;
  border-color: var(--v-primary-base); /* 활성화 시 아웃라인 두께와 색상 */
}

:deep(.v-textarea textarea) {
  line-height: 1.4; /* 텍스트 영역 줄 간격 */
}
:deep(.star-rating) {
  line-height: 1; /* 이걸 추가하면 별점이랑 텍스트랑 수직 정렬이 잘 됨 */
}
.star-rating-wrapper {
  display: inline-flex; /* 중요! */
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 (원하는 경우) */
}

.rating-display {
  margin-left: 8px; /* 별점과 총점 사이 간격 */
  font-size: 1rem; /* 총점 글꼴 크기 (필요에 따라 조정) */
  /* color: #666;  총점 글꼴 색상 (필요에 따라 조정) */
}

.v-img {
  max-width: 100%;
  max-height: 150px;
}

.v-card-actions {
  gap: 8px; /* 버튼 간 최소 간격 */
}

.calendar-container{
  position: absolute;
  z-index: 10;
}
</style>