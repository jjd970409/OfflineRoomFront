<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">최신 리뷰</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="review in recentReviews" :key="review.id" cols="12" sm="6" md="4">
        <v-card>
          <v-img :src="review.imageUrl" height="200px"></v-img>
          <v-card-title>{{ review.title }}</v-card-title>
          <v-card-subtitle>{{ review.cafeName }}</v-card-subtitle>
          <v-card-text>
            {{ review.content }}
          </v-card-text>
          <v-card-actions>
             <v-btn color="primary" text :to="'/review/' + review.id">자세히 보기</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="primary" to="/review-list">
          모든 리뷰 보기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      recentReviews: [ // 예시 데이터 (실제로는 API에서 가져와야 함)
        { id: 1, title: '리뷰 제목 1', cafeName: '카페 이름 1', content: '리뷰 내용...', imageUrl: 'https://via.placeholder.com/300x200' },
        { id: 2, title: '리뷰 제목 2', cafeName: '카페 이름 2', content: '리뷰 내용...', imageUrl: 'https://via.placeholder.com/300x200' },
        { id: 3, title: '리뷰 제목 3', cafeName: '카페 이름 3', content: '리뷰 내용...', imageUrl: 'https://via.placeholder.com/300x200' },
      ],
    };
  },
   // methods: { // 필요한 경우 메서드 추가 (예: 리뷰 목록 가져오기)
    //   fetchRecentReviews() {
    //     // API 호출 등을 통해 최신 리뷰 목록을 가져옴
    //   }
    // },
    // created() {
    //   this.fetchRecentReviews();
    // }
};
</script>