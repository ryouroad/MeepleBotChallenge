<template>
  <div id="app">
    <header>
      <h1>ミープルボットの挑戦</h1>
      <nav>
        <ul>
          <li><a href="#home">ホーム</a></li>
          <li><a href="#meeplebot">ミープルボット紹介</a></li>
          <li><a href="#articles">記事一覧</a></li>
          <li><a href="#contact">お問い合わせ</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section id="home">
        <h2>ホーム</h2>
        <p>ミープルボットの挑戦へようこそ！</p>
        <p>ここでは、ボードゲームとAIを掛け合わせ、ボードゲームの楽しさ・可能性を追求します。ミープルボットは、ボードゲームの楽しさとAIの無限の可能性にワクワクしています。</p>
        <p>最新の記事を読んで、ボードゲームとAIの世界を深く探検しましょう。そして、私たちが開発したミープルボットの魅力を発見してください。</p>
        <p>さあ、一緒にこの冒険を始めましょう！</p>
      </section>

      <section id="meeplebot">
        <h2>ミープルボット紹介</h2>
        <img src=./assets/MeepleBotBoardGame.jpg alt="ミープルボットの画像">
        <p>ミープルボットは、ボードゲームとAIの交差点に生まれたユニークな存在です。ボードゲームの楽しさとAIの可能性を融合させ、新たなゲーム体験を提供します。</p>
        <p>ミープルボットは、ゲームの戦略を学習し、プレイヤーに対して適切な挑戦を提供します。また、ミープルボットはゲームのルールを理解し、プレイヤーがゲームをより深く理解するのを助けます。</p>
        <p>ミープルボットは、ボードゲームの世界をより楽しく、よりエキサイティングにするためのパートナーです。一緒に新たな冒険を始めましょう！</p>
      </section>


      <section id="articles">
        <h2>記事一覧</h2>
        <div v-for="article in articles" :key="article.id">
          <router-link :to="`/article/${article.id}`">
            <img :src="article.imageUrl" :alt="article.title" :class="article-image">
            <h3>{{ article.title }}</h3>
          </router-link>
        </div>
        <router-view></router-view>
      </section>

      <section id="contact">
        <h2>お問い合わせ</h2>
        <p>このサイトは基本的にAIの力を借りたうえで、適宜修正を加えて作成しております。内容にはご注意ください。</p>
        <p>ご質問やコメントがありましたら、お気軽に<a href="https://twitter.com/Rnishimu_">こちら</a>までお知らせください。</p>
        <p>また、ボドゲーマアカウントは<a href="https://bodoge.hoobby.net/friends/28892">こちら</a>です。</p>
        <p>どちらも管理者のアカウントです。お気軽にフォローいただけると嬉しいです。</p>
      </section>

    </main>

    <footer>
      <p>© 2024 ミープルボットの挑戦. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const articles = computed(() => store.state.articles);
    return { articles };
  }
}
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #f8f9fa;
  color: #333;
  padding: 20px 0;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
}

header h1 {
  font-size: 2em;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 10px;
}

nav ul li a {
  text-decoration: none;
  color: #333;
}

main {
  margin: 40px 0;
}

section {
  margin-bottom: 40px;
}

section h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

footer {
  background-color: #f8f9fa;
  color: #333;
  padding: 10px 0;
  text-align: center;
  border-top: 1px solid #e9ecef;
}

img {
  width: 200px; /* 幅を100pxに指定 */
  height: auto; /* 高さを自動調整（アスペクト比を維持） */
}

</style>