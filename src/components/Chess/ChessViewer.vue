<template>
  <div id="chess-viewer">
    <PlayerIndicator :currentPlayer="game.currentPlayer" :winner="game.winner" />
    <ChessBoard :board="game.board" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ChessBoard from './ChessBoard.vue';
import PlayerIndicator from './PlayerIndicator.vue';

export default {
  components: { ChessBoard, PlayerIndicator, /* ChatWindow, ChatInput, AINextMoveButton, ChatButton, FeedbackInput*/ },
  computed: mapState({
    game: state => state.chessStore.game,
    chat: state => state.chessStore.chat
  }),
  methods: mapActions(['sendMessage', 'sendFeedback']),
}

</script>