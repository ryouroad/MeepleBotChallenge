<template>
    <div v-if="article" class="article">
      <h1>{{ article.title }}</h1>
      <img :src="article.imageUrl" alt="Article image">
      <div v-html="article.content"></div>
    </div>
    <div v-else>
      <p>記事が見つかりません。</p>
    </div>
</template>
  
<script>
import { mapGetters } from 'vuex';
  
export default {
  computed: {
    ...mapGetters({
      getArticleById: 'articleStore/getArticleById'
    }),
    article() {
      // console.log(this.$route.params.id);
      // console.log(this.getArticleById(this.$route.params.id));
      const article = this.getArticleById(this.$route.params.id);
      console.log("article:",article); 
      return article;
    }
  }
};
</script>


<style>
  img {
    width: 200px; /* 幅を200pxに指定 */
    height: auto; /* 高さを自動調整（アスペクト比を維持） */
  }
  
</style>