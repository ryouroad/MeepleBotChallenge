<template>
  <v-container id="builders-tactics-viewer" class="d-flex flex-column align-center py-5">
    <v-card class="pa-5" outlined max-width="1600px" width="100%">
      <v-row id="menu-viewer" class="d-flex justify-center">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <v-btn @click="toBuilds" color="primary" class="mx-2">Build List（ビルド確認）</v-btn>
          <v-btn @click="toBuildCreator" color="primary" class="mx-2">Create Build（ビルド作成）</v-btn>
          <v-btn @click="toRooms" color="primary" class="mx-2">Tactics（対人戦）</v-btn>
        </v-col>
      </v-row>

      <v-row v-if="isBuildsScreen" id="builds-viewer">
        <BuildViewer />
      </v-row>

      <v-row v-if="isBuildCreatorScreen" id="build-creator-viewer">
        <BuildCreator />
      </v-row>

      <v-row v-if="isRoomsScreen" id="rooms-viewer">
        <!-- ルーム選択画面のコンテンツ -->
      </v-row>

      <v-row v-if="isTacticsScreen" id="tactics-viewer" class="d-flex flex-column align-center">
      </v-row>
      
      <v-row class="d-flex justify-center">
        <img :src="meepleBotImage" alt="ミープルボット" class="mt-4" style="width: 200px;">
      </v-row>

      <v-row class="d-flex justify-center">
        <FeedbackInput @send="sendFeedback" />
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import meepleBotImage from '@/assets/MeepleBot/MeepleBotBoardGame.jpg';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import FeedbackInput from '@/components/Common/FeedbackInput.vue';
import BuildViewer from './BuildViewer.vue';
import BuildCreator from './BuildCreator.vue'; 

const store = useStore();
const screen = ref('menu');

const isBuildsScreen = computed(() => screen.value === 'builds');
const isRoomsScreen = computed(() => screen.value === 'rooms');
const isTacticsScreen = computed(() => screen.value === 'tactics');
const isBuildCreatorScreen = computed(() => screen.value === 'build-creator');

const sendFeedback = (message) => {
  store.dispatch('commonStore/sendFeedback', message);
};

const toBuilds = () => {
  screen.value = 'builds';
};

const toBuildCreator = () => {
  screen.value = 'build-creator'; // ビルド作成画面への切り替え
};

const toRooms = () => {
  screen.value = 'rooms';
};
</script>

<style scoped>
#builders-tactics-viewer {
  max-width: 1200px;
  margin: auto;
}
</style>
