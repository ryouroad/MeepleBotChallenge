<template>
  <v-app>
    <v-container>
      <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon v-if="!isLargeScreen" @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>ミープルボットの挑戦</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text :href="twitterUrl">管理者Xアカウント</v-btn>
      </v-app-bar>
      
      <v-navigation-drawer v-model="drawer" :permanent="isLargeScreen" app>
        <v-list dense>
          <v-list-item link :href="`${baseUrl}`">
            <v-list-item-title>ホーム</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!getUserName" link :href="`${loginUrl}`">
            <v-list-item-title>ログイン</v-list-item-title>
          </v-list-item>
          <v-list-item v-else @click="removeToken" link :href="`${logoutUrl}`" target="_blank">
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="scrollToId('contact')">
            <v-list-item-title>お問い合わせ</v-list-item-title>
          </v-list-item>

          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-list-item-title>ボードゲームAI</v-list-item-title>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list-item>
                  <router-link :to="`/reversi`" style="text-decoration: none; color: inherit;">
                    <v-list-item-title>リバーシ</v-list-item-title>
                  </router-link>
                </v-list-item>
                <v-list-item>
                  <router-link :to="`/chess`" style="text-decoration: none;  color: inherit;">
                    <v-list-item-title>チェス</v-list-item-title>
                  </router-link>
                </v-list-item>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-list-item-title>オリジナル対人ゲーム</v-list-item-title>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list-item>
                  <router-link :to="`/buildersTactics`" style="text-decoration: none;  color: inherit;">
                    <v-list-item-title>Builders Tactics(開発中)</v-list-item-title>
                  </router-link>
                </v-list-item>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

        </v-list>
      </v-navigation-drawer>
      
      <v-main>
        <v-container>
          <v-alert v-if="getUserName" type="info">
            ようこそ{{ getUserName }}さん！一緒に楽しみましょう！
          </v-alert>
          <v-alert v-else type="info">
            ようこそ！ログインして新ゲームの先行プレイやオリジナルゲームを一緒に楽しみましょう！
          </v-alert>
          <router-view name="Main">
          </router-view>
          
          <section id="contact">
            <v-card>
              <v-card-title>注意</v-card-title>
              <v-card-text>
                <p>このサイトは基本的にAIの力を借りたうえで、適宜修正を加えて作成しております。<br>内容には十分ご注意ください。</p>
              </v-card-text>
              <v-card-title>目的・考え</v-card-title>
              <v-card-text>
                <p>ボードゲームにAI技術を活用して面白いことができないか<br>という思いから2024年3月20日に筆者はこのサイトを立ち上げました。</p>
                <p>面白いと思った方はなんでもいいのでメッセージいただけるとありがたいです。</p>
              </v-card-text>
              <v-card-title>お問い合わせ</v-card-title>
              <v-card-text>
                <p>ご質問やコメントがありましたら、お気軽に<a :href="twitterUrl">こちら</a>までお知らせください。</p>
                <p>管理者のXアカウントです。お気軽にフォローいただけると嬉しいです。</p>
              </v-card-text>
            </v-card>
          </section>
        </v-container>
      </v-main>
      
      <v-footer>
        <v-col class="text-center">
          <p>© 2024 ミープルボットの挑戦. All rights reserved.</p>
        </v-col>
      </v-footer>
    </v-container>
  </v-app>
</template>


<script>
import { useStore } from 'vuex';
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { useDisplay } from 'vuetify';
const CLIENT_ID = process.env.VUE_APP_COGNITO_CLIENT_ID;
const COGNITO_URL = process.env.VUE_APP_COGNITO_URL;
const TWITTER_URL = process.env.VUE_APP_TWITTER_URL;
const REDIRECT_URI = process.env.VUE_APP_BASE_URL;

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const drawer = ref(true);
    const getUserName = computed(() => store.getters['authStore/getName']);
    const getUserToken = computed(() => store.getters['authStore/getRefreshToken']);
    const baseUrl = process.env.BASE_URL;
    const loginUrl = `${COGNITO_URL}/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    const logoutUrl = `${COGNITO_URL}/logout?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    const twitterUrl = TWITTER_URL;
    const { mdAndUp } = useDisplay();
    const isLargeScreen = computed(() => {
      return mdAndUp.value
    });

    const scrollToId = id => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }else{
        this.$router.push('/');
      }
    };

    const handleLogin = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const refresh_token = getUserToken.value;
      if (code) {
        getToken(code);
      }
      if (refresh_token != null && !code) {
        // console.log("refresh_token:",refresh_token);
        refreshToken(refresh_token);
      }
    };

    const getToken = async code => {
      try {
        const response = await axios.post(`${COGNITO_URL}/oauth2/token`, new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        store.dispatch('authStore/saveToken', response.data);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    const refreshToken = async token => {
      try {
        const response = await axios.post(`${COGNITO_URL}/oauth2/token`, new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: token,
          client_id: CLIENT_ID,
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        store.dispatch('authStore/saveToken', response.data);
      } catch (error) {
        console.error('Error fetching token:', error);
        store.dispatch('authStore/removeToken');
      }
    };

    const removeToken = () => {
      store.dispatch('authStore/removeToken');
    };

    // onMounted hook
    onMounted(() => {
      document.title = 'ミープルボットの挑戦';
      handleLogin();
    });

    return {
      drawer,
      isLargeScreen,
      getUserName,
      baseUrl,
      loginUrl,
      logoutUrl,
      twitterUrl,
      scrollToId,
      removeToken,
    };
  }
};
</script>

<style scoped>
.v-app-bar {
  background-color: #1e88e5 !important;
  color: white !important;
}

.v-navigation-drawer {
  background-color: #f5f5f5;
}

.v-list-item-title {
  font-weight: bold;
}

.v-list-item {
  transition: background-color 0.3s;
}

.v-list-item:hover {
  background-color: #e0e0e0;
}
</style>