<template>
  <div id="chess-viewer">
    <PlayerIndicator :currentPlayer="game.currentPlayer" :winner="game.winner" />
    <ChessBoard :board="game.board" />
    <PromotionDialog v-if="game.showPromotionDialog" @select="handlePromotionSelect" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ChessBoard from './ChessBoard.vue';
import PlayerIndicator from './PlayerIndicator.vue';
import PromotionDialog from './PromotionDialog.vue';

export default {
  components: { ChessBoard, PlayerIndicator, PromotionDialog, /* ChatWindow, ChatInput, AINextMoveButton, ChatButton, FeedbackInput*/ },
  computed: mapState({
    game: state => state.chessStore.game,
    chat: state => state.chessStore.chat
  }),
  methods: {
    ...mapActions(['sendMessage', 'sendFeedback']),
    handlePromotionSelect({ pieceType }) {
      console.log("handlePromotionSelect:"+pieceType+this.game.promotionPosition.x+this.game.promotionPosition.y);
      this.$store.commit('chessStore/promotePawn', { position: this.game.promotionPosition, newType: pieceType });
      this.$store.commit('chessStore/updateShowPromotionDialog', false);
    },
  },
}

</script>