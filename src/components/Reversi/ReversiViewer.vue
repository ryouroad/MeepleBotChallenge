<!-- Reversi.vue -->
<template>
  <div id="reversi">
    <ReversiBoard :board="game.board"/>
    <PlayerIndicator :player="game.currentPlayer" />
    <ScoreBoard :board="game.board" />
    <img :src="meepleBotImage" alt="ミープルボット" style="width: 200px;">
    <AINextMoveButton />
    <ChatWindow :messages="chat.messages" />
    <ChatButton @send="sendMessage"/>
    <ChatInput @send="sendMessage" />
    <FeedbackInput @send="sendFeedback" />
  </div>
</template>

<script setup>
import meepleBotImage from '@/assets/MeepleBotBoardGame.jpg';
</script>


<script>
import { mapState, mapActions } from 'vuex'
import ReversiBoard from './ReversiBoard.vue'
import PlayerIndicator from './PlayerIndicator.vue'
import ScoreBoard from './ScoreBoard.vue'
import ChatWindow from './ChatWindow.vue'
import ChatInput from './ChatInput.vue'
import FeedbackInput from './FeedbackInput.vue'
import AINextMoveButton from './AINextMoveButton.vue';
import ChatButton from './ChatButton.vue';

export default {
  components: { ReversiBoard, PlayerIndicator, ScoreBoard, ChatWindow, ChatInput, AINextMoveButton, ChatButton, FeedbackInput },
  computed: mapState({
    game: state => state.reversiStore.game,
    chat: state => state.reversiStore.chat
  }),
  methods: mapActions(['sendMessage', 'sendFeedback']),
}
</script>

<style scoped>
#reversi {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>