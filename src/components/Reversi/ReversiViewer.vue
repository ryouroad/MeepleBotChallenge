<!-- Reversi.vue -->
<template>
  <div id="reversi">
    <ReversiBoard :board="game.board"/>
    <PlayerIndicator :player="game.currentPlayer" />
    <ScoreBoard :board="game.board" />
    <ResetButton @send="resetGame" />
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
import { mapState, mapActions } from 'vuex';
import ReversiBoard from './ReversiBoard.vue';
import PlayerIndicator from './PlayerIndicator.vue';
import ScoreBoard from './ScoreBoard.vue';
import ChatWindow from './ChatWindow.vue';
import ChatInput from './ChatInput.vue';
import ResetButton from '@/components/Common/ResetButton.vue';
import FeedbackInput from '@/components/Common/FeedbackInput.vue';
import AINextMoveButton from './AINextMoveButton.vue';
import ChatButton from './ChatButton.vue';

export default {
  components: {
    ReversiBoard,
    PlayerIndicator,
    ScoreBoard,
    ChatWindow,
    ChatInput,
    AINextMoveButton,
    ChatButton,
    ResetButton,
    FeedbackInput,
  },
  computed: {
    ...mapState({
      game: state => state.reversiStore.game,
      chat: state => state.reversiStore.chat
    })
  },
  methods: {
    ...mapActions({
      sendMessage: 'reversiStore/sendMessage',
      resetGame: 'reversiStore/resetGame',
      sendFeedback: 'commonStore/sendFeedback'
    })
  }
}
</script>


<style scoped>
#reversi {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>