<template>
  <ul>
    <li v-for="review in reviews" :key="review.id">
      {{ review.content }}
    </li>
  </ul>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      reviews: []
    };
  },
  mounted() {
    axios.get('http://localhost:8080/reviews') // 백엔드 API URL
      .then(response => {
        this.reviews = response.data;
      });
  }
};
</script>