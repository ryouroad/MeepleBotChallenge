<template>
  <section id="boardgame">
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="elevation-2 my-4">
          <v-card-title class="headline">ミープルボット（AI）とのゲーム</v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-checkbox-multiple-blank-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <router-link :to="`/reversi`">リバーシ</router-link>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-chess-queen</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <router-link :to="`/chess`">チェス</router-link>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="elevation-2 my-4">
          <v-card-title class="headline">オリジナルゲーム（対人戦、要ログイン）</v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-hammer-wrench</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <router-link :to="`/buildersTactics`">ビルダーズタクティクス</router-link>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-spacer></v-spacer>
  </section>

  <section id="meeplebot">
    <v-card class="my-4">
      <v-card-title>ミープルボット紹介（キャライメージ）</v-card-title>
      <v-row>
        <v-col cols="12" md="3">
          <v-img :src="meepleBotFriend" alt="ミープルボットの画像" :width="300"></v-img>
        </v-col>
        <v-col cols="12" md="3">
          <v-img :src="meepleBotBoardGame" alt="ミープルボットの画像" :width="300"></v-img>
        </v-col>
        <v-col cols="12" md="3">
          <v-img :src="meepleBotGPTCore" alt="ミープルボットの画像" :width="300"></v-img>
        </v-col>
        <v-col cols="12" md="3">
          <v-img :src="meepleBotStrategy" alt="ミープルボットの画像" :width="300"></v-img>
        </v-col>
      </v-row>
      <v-card-text>
        <p>ミープルボットは、GPT（Generative Pre-trained Transformer）をメインロジックとして動作する愛らしいロボットキャラクターです。彼らの設計は、親しみやすさと機能性を兼ね備えており、ユーザーとの相互作用を重視しています。</p>
        <p>このミープルボットはただのキャラクターではなく、GPTをメインロジックとして活用して、ユーザーとの相互作用を豊かにします。特にボードゲームに関して強い関心を持ち、その知識と技能は単にゲームを楽しむだけでなく、学習と進化も含まれています。ミープルボットは様々なボードゲームのルールを覚え、ゲーム戦略に関するアドバイスを提供することができます。さらに、対戦相手としても機能し、ユーザーに挑戦的かつ教育的なゲーム体験を提供します。</p>
        <p>ミープルボットには多様性があり、それぞれが異なるボードゲームに特化している場合があります。この多様性により、ユーザーは自分の興味やスキルレベルに応じて最適なミープルボットを見つけ、ゲームを通じて学習や楽しみを深めることができます。ミープルボットは単なるゲームパートナーではなく、学習を促進し、戦略的思考を養うためのインテリジェントなロボットとして設計されています。</p>
        <p>このようにミープルボットは、技術と遊び心を融合させた、新しいタイプのロボットキャラクターであり、ユーザーにとって魅力的で有益な存在です。彼らはボードゲームを通じて、楽しみながら学び、成長することの価値を伝えます。</p>
      </v-card-text>
    </v-card>
    <v-spacer></v-spacer>
  </section>

  <section id="articles">
    <v-card class="my-4">
      <v-card-title>記事一覧</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-chip-group>
              <v-chip v-for="tag in availableTags" :key="tag" :class="{ 'selected': selectedTag === tag }" @click="filterByTag(tag)">
                {{ tag }}
              </v-chip>
            </v-chip-group>
          </v-col>
          <v-col cols="12" md="6" lg="4" v-for="article in filteredArticles" :key="article.id">
            <v-card>
              <v-img :src="article.imageUrl" :alt="article.title" :width="400"></v-img>
              <v-card-title>{{ article.title }}</v-card-title>
              <v-card-actions>
                <router-link :to="`/articles/${article.id}`">Read more</router-link>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-spacer></v-spacer>
  </section>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';

// 画像のインポート
import meepleBotFriend from '@/assets/MeepleBot/MeepleBotFriend.webp';
import meepleBotBoardGame from '@/assets/MeepleBot/MeepleBotBoardGame.jpg';
import meepleBotGPTCore from '@/assets/MeepleBot/MeepleBotGPTCore.webp';
import meepleBotStrategy from '@/assets/MeepleBot/MeepleBotStrategy.webp';

// ストアの使用
const store = useStore();

// リアクティブなデータ
const articles = computed(() => {
  const articlesData = store.state.articleStore.articles;
  // console.log('Fetched articles:', articlesData);
  return articlesData;
});
const selectedTag = ref(null);

// メソッド
const filterByTag = tag => {
  // console.log("Current selectedTag.value:", selectedTag.value);
  // console.log("Clicked tag:", tag);

  if (String(selectedTag.value) === String(tag)) {
    // console.log("Tags match. Clearing selection.");
    selectedTag.value = null;  // 既に選択されているタグをクリックすると、選択を解除
  } else {
    // console.log("Tags do not match. Setting new selection.");
    selectedTag.value = tag;
  }

  // console.log("Updated selectedTag.value:", selectedTag.value);
};

  
const filteredArticles = computed(() => {
  // console.log("Articles before filtering:", articles.value);
  if (selectedTag.value === null) {
    return articles.value;
  }
  const filtered = articles.value.filter(article => article.tags.includes(selectedTag.value));
  // console.log("Filtered articles:", filtered);
  return filtered;
});

// computed properties
const availableTags = computed(() => {
  const tags = new Set();
  articles.value.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
});
</script>
