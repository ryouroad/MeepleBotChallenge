<template>
  <div id="app">
    <header>
      <h1>ミープルボットの挑戦</h1>
      <p>筆者アカウント<a href="https://twitter.com/Rnishimu_">X(twitter)</a> <a href="https://bodoge.hoobby.net/friends/28892">ボドゲーマ</a></p>
      <nav>
        <ul>
          <li><a :href="`${baseUrl}`">ホーム</a></li>
          <li v-if="!getUserName"><a :href="`${loginUrl}`">ログイン</a></li>
          <li v-else ><a :href="`${logoutUrl}`" @click="removeToken">ログアウト</a></li>
          <li><router-link to="/" @click.prevent="scrollToId('boardgame')">ミープルボットとのゲーム</router-link></li>
          <li><router-link to="/" @click.prevent="scrollToId('meeplebot')">ミープルボット紹介</router-link></li>
          <li><router-link to="/" @click.prevent="scrollToId('articles')">記事一覧</router-link></li>
          <li><router-link to="/" @click.prevent="scrollToId('contact')">お問い合わせ</router-link></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <p v-if="getUserName">ようこそ{{getUserName}}さん！一緒に楽しみましょう！</p>
      <router-view name="Main" v-slot="{ Component }">
        <!-- Componentが存在する場合、動的にそのコンポーネントをレンダリング -->
        <component :is="Component" />
        <!-- Componentが存在しない場合、代替テキストを表示 -->
        <div v-if="!Component">
          <section id="boardgame">
            <h2>ミープルボットとのゲーム</h2>
            <li><router-link :to="`/reversi`">リバーシ</router-link></li>
            <li><router-link :to="`/chess`">チェス</router-link></li>
          </section>
          
          <section id="meeplebot">
            <h2>ミープルボット紹介（キャライメージ）</h2>
            <img src=./assets/MeepleBot/MeepleBotFriend.webp alt="ミープルボットの画像">
            <img src=./assets/MeepleBot/MeepleBotBoardGame.jpg alt="ミープルボットの画像">
            <img src=./assets/MeepleBot/MeepleBotGPTCore.webp alt="ミープルボットの画像">
            <img src=./assets/MeepleBot/MeepleBotStrategy.webp alt="ミープルボットの画像">
            <p>ミープルボットは、GPT（Generative Pre-trained Transformer）をメインロジックとして動作する愛らしいロボットキャラクターです。彼らの設計は、親しみやすさと機能性を兼ね備えており、ユーザーとの相互作用を重視しています。</p>
            <p>このミープルボットはただのキャラクターではなく、GPTをメインロジックとして活用して、ユーザーとの相互作用を豊かにします。特にボードゲームに関して強い関心を持ち、その知識と技能は単にゲームを楽しむだけでなく、学習と進化も含まれています。ミープルボットは様々なボードゲームのルールを覚え、ゲーム戦略に関するアドバイスを提供することができます。さらに、対戦相手としても機能し、ユーザーに挑戦的かつ教育的なゲーム体験を提供します。</p>
            <p>ミープルボットには多様性があり、それぞれが異なるボードゲームに特化している場合があります。この多様性により、ユーザーは自分の興味やスキルレベルに応じて最適なミープルボットを見つけ、ゲームを通じて学習や楽しみを深めることができます。ミープルボットは単なるゲームパートナーではなく、学習を促進し、戦略的思考を養うためのインテリジェントなロボットとして設計されています。</p>
            <p>このようにミープルボットは、技術と遊び心を融合させた、新しいタイプのロボットキャラクターであり、ユーザーにとって魅力的で有益な存在です。彼らはボードゲームを通じて、楽しみながら学び、成長することの価値を伝えます。</p>
          </section>
          
          <section id="articles">
            <h2>記事一覧</h2>
            <div class="tags-filter">
              <p>タグフィルター
                <button v-for="tag in availableTags" :key="tag" @click="filterByTag(tag)" class="tag-button">
                  {{ tag }}
                </button>
              </p>
            </div>
            <div class="articles-container">
              <div v-for="article in filteredArticles" :key="article.id" class="article-item">
                <router-link :to="`${article.id}`">
                  <img :src="article.imageUrl" :alt="article.title" class="article-image">
                  <h3>{{ article.title }}</h3>
                </router-link>
              </div>
            </div>
          </section>

        </div>
      </router-view>
      
      <section id="contact">
        <h2>注意</h2>
        <p>このサイトは基本的にAIの力を借りたうえで、適宜修正を加えて作成しております。<br>内容には十分ご注意ください。</p>
        <h2>目的・考え</h2>
        <p>ボードゲームにAI技術を活用して面白いことができないか<br>という思いから2024年3月20日に筆者はこのブログを立ち上げました。</p>
        <p>面白いと思った方はなんでもいいのでメッセージいただけるとありがたいです。</p>
        <h2>お問い合わせ</h2>
        <p>ご質問やコメントがありましたら、お気軽に<a href="https://twitter.com/Rnishimu_">こちら</a>までお知らせください。</p>
        <p>また、ボドゲーマアカウントは<a href="https://bodoge.hoobby.net/friends/28892">こちら</a>です。</p>
        <p>どちらも筆者のアカウントです。お気軽にフォローいただけると嬉しいです。</p>
      </section>
    </main>
    <footer>
      <p>© 2024 ミープルボットの挑戦. All rights reserved.</p>
    </footer>
  </div>
</template>
  
<script>
import { computed } from 'vue';
import { useStore, mapGetters } from 'vuex';
import axios from 'axios';
const CLIENT_ID = process.env.VUE_APP_COGNITO_CLIENT_ID;
const COGNITO_URL = process.env.VUE_APP_COGNITO_URL;
const REDIRECT_URI = process.env.VUE_APP_BASE_URL;

export default {
  name: 'App',
  mounted() {
    document.title = 'ミープルボットの挑戦';
    this.handleLogin();
  },
  data() {
    const store = useStore();
    const articles = computed(() => store.state.articleStore.articles);
    return { 
      articles,
      selectedTag: null,
      baseUrl: process.env.BASE_URL,
      loginUrl: COGNITO_URL+'/oauth2/authorize?response_type=code&client_id='+CLIENT_ID+'&redirect_uri='+REDIRECT_URI,
      logoutUrl: COGNITO_URL+'/logout?response_type=code&client_id='+CLIENT_ID+'&redirect_uri='+REDIRECT_URI,
    };
  },
  computed: {
    availableTags() {
      // 利用可能な全タグのリストを生成
      const tags = new Set();
      Object.values(this.articles).forEach(article => {
        article.tags.forEach(tag => tags.add(tag));
      });
      return Array.from(tags);
    },
    filteredArticles() {
      // 選択されたタグに基づいて記事をフィルタリング
      if (!this.selectedTag) {
        return Object.values(this.articles);
      }
      return Object.values(this.articles).filter(article =>
        article.tags.includes(this.selectedTag)
      );
    },
    ...mapGetters({
      getUserName: 'authStore/getName'
    })
    },
  methods: {
    filterByTag(tag) {
      this.selectedTag = tag;
    },
    scrollToId(id) {
    const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    handleLogin() {
      // URLのクエリパラメータから認証コードを取得
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        // 認証コードを使用してトークンを取得
        // console.log('Code:', code);
        this.getToken(code);
      } else {
        console.error('Authorization code not found in URL');
      }
    },
    async getToken(code) {
      const clientId = CLIENT_ID;
      const redirectUri = REDIRECT_URI;
      const store = useStore();
      
      try {
        const response = await axios.post(COGNITO_URL+'/oauth2/token', new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId,
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        // console.log('Token Response:', response.data);
        store.dispatch('authStore/saveToken', response.data);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    },
    removeToken(){
      const store = useStore();
      store.dispatch('authStore/removeToken');
    },
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
  width: 200; /* 幅を100pxに指定 */
  height: auto; /* 高さを自動調整（アスペクト比を維持） */
}

.articles-container {
  display: flex;
  overflow-x: auto;
  padding: 20px 0;
}

.article-item {
  flex: 0 0 auto;
  width: 300px; /* 各記事の幅を指定 */
  margin-right: 20px; /* 記事間のマージン */
  box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* オプショナル: 影を追加 */
}

.article-image {
  width: 100%;
  height: auto;
  display: block;
}

/* スクロールバーのスタイルをカスタマイズしたい場合 */
.articles-container::-webkit-scrollbar {
  height: 8px;
}

.articles-container::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  border-radius: 4px;
}

/* レスポンシブ対応 */
@media (max-width: 600px) {
  .article-item {
    width: 100%; /* スマートフォンなどの狭い画面では記事を幅いっぱいに表示 */
  }
}

.tags-filter {
  margin-bottom: 20px;
}

.tag-button {
  background-color: #f0f0f0;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-weight: bold;
  color: #333;
}

.tag-button:hover {
  background-color: #d0d0d0;
  transform: translateY(-2px);
}

.tag-button:active {
  background-color: #b0b0b0;
}

/* 選択されたタグのスタイルを追加 (オプション) */
.tag-button.active {
  background-color: #007BFF;
  color: white;
}

video {
  width: 100%;
  height: auto;
}
</style>