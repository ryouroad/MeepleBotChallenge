<template>
  <div id="chess-viewer">
    <PlayerIndicator :currentPlayer="game.currentPlayer" :winner="game.winner" />
    <ChessBoard :board="game.board" />
    <PromotionDialog v-if="game.showPromotionDialog" @select="handlePromotionSelect" />
    <img :src="meepleBotImage" alt="ミープルボット" style="width: 200px;">
    <AINextMoveButton />
    <ChatWindow :messages="chat.messages" />
    <ChatButton @send="sendMessage"/>
    <ChatInput @send="sendMessage" />
    <FeedbackInput @send="sendFeedback" />
  </div>
</template>

<script setup>
import meepleBotImage from '@/assets/MeepleBot/MeepleBotBoardGame.jpg';
</script>

<script>
import { mapState, mapActions } from 'vuex'
import ChessBoard from './ChessBoard.vue';
import PlayerIndicator from './PlayerIndicator.vue';
import PromotionDialog from './PromotionDialog.vue';
import ChatWindow from './ChatWindow.vue'
import ChatInput from './ChatInput.vue'
import FeedbackInput from './FeedbackInput.vue'
import AINextMoveButton from './AINextMoveButton.vue';
import ChatButton from './ChatButton.vue';

export default {
  components: { ChessBoard, PlayerIndicator, PromotionDialog,  ChatWindow, ChatInput, AINextMoveButton, ChatButton, FeedbackInput },
  computed: mapState({
    game: state => state.chessStore.game,
    chat: state => state.chessStore.chat
  }),
  methods: {
    ...mapActions('chessStore', ['sendMessage', 'sendFeedback']),
    handlePromotionSelect({ pieceType }) {
      // console.log("handlePromotionSelect:"+pieceType+this.game.promotionPosition.x+this.game.promotionPosition.y);
      this.$store.commit('chessStore/promotePawn', { position: this.game.promotionPosition, newType: pieceType });
      this.$store.commit('chessStore/updateShowPromotionDialog', false);
    },
  },
}

</script>

<style scoped>
#chess-viewer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>