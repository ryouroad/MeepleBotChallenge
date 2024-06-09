<template>
  <b-container id="builders-tactics-viewer" class="justify-content-center">
    <div v-if="screen === 'menu'" id="menu-viewer">
      <v-btn @click="toBuilds">ビルド</v-btn>
      <v-btn @click="toRooms">タクティクス（ルーム選択）</v-btn>
    </div>
    <div v-if="screen === 'builds'" id="builds-viewer">
    </div>
    <div v-if="screen === 'rooms'" id="rooms-viewer">
    </div>
    <div v-if="screen === 'tactics'" id="tactics-viewer">
      <PlayerIndicator :currentPlayer="game.currentPlayer" :winner="game.winner" />
      <BuildersTacticsBoard :board="game.board" />
    </div>
    <p></p>
    <img :src="meepleBotImage" alt="ミープルボット" style="width: 200px;" >
    <FeedbackInput @send="sendFeedback" />
  </b-container>
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
</style>