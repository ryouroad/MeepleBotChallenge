<template>
  <v-container id="builders-tactics-viewer" class="d-flex flex-column align-center py-5">
    <v-card class="pa-5" outlined max-width="1600px" width="100%">
      <v-row v-if="screen === 'menu'" id="menu-viewer" class="d-flex justify-center">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <v-btn @click="toBuilds" color="primary" class="mx-2">Build（ロボット構築）</v-btn>
          <v-btn @click="toRooms" color="primary" class="mx-2">Tactics（対人戦）</v-btn>
        </v-col>
      </v-row>

      <v-row v-if="screen === 'builds'" id="builds-viewer">
        <!-- ビルド画面のコンテンツ -->
      </v-row>

      <v-row v-if="screen === 'rooms'" id="rooms-viewer">
        <!-- ルーム選択画面のコンテンツ -->
      </v-row>

      <v-row v-if="screen === 'tactics'" id="tactics-viewer" class="d-flex flex-column align-center">
        <v-col cols="12" md="8">
          <PlayerIndicator :currentPlayer="game.currentPlayer" :winner="game.winner" />
        </v-col>
        <v-col cols="12" md="8">
          <BuildersTacticsBoard :board="game.board" />
        </v-col>
      </v-row>
      
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <img :src="meepleBotImage" alt="ミープルボット" style="width: 200px;" class="mt-4">
        </v-col>
      </v-row>

      <v-row class="d-flex justify-center">
        <FeedbackInput @send="sendFeedback" />
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import meepleBotImage from '@/assets/MeepleBot/MeepleBotBoardGame.jpg';
var screen = 'menu'
</script>

<script>
import { mapState, mapActions } from 'vuex'
import BuildersTacticsBoard from './BuildersTacticsBoard.vue';
import PlayerIndicator from './PlayerIndicator.vue';
import FeedbackInput from './FeedbackInput.vue'

export default {
  components: { BuildersTacticsBoard, PlayerIndicator, FeedbackInput },
  computed: mapState({
    game: state => state.buildersTacticsStore.game
  }),
  methods: {
    ...mapActions('buildersTacticsStore', ['sendFeedback']),
  },
}

</script>

<style scoped>
#builders-tactics-viewer {
  max-width: 1200px;
  margin: auto;
}
</style>
