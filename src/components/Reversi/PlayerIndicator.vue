<template>
  <div>
    <!-- ゲーム終了時の勝者表示 -->
    <div v-if="isGameOver">
      <p>Game Over!</p>
      <p>{{ winnerMessage }}</p>
    </div>
    <!-- 通常のプレイヤー表示 -->
    <div v-else>
      <p>Current Player: {{ currentPlayer }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'PlayerIndicator',
  setup() {
    const store = useStore();
    const currentPlayer = computed(() => store.state.reversiStore.game.currentPlayer);
    const isGameOver = computed(() => store.state.reversiStore.game.isGameOver);
    const winner = computed(() => store.state.reversiStore.game.winner);

    const winnerMessage = computed(() => {
      if (winner.value) {
        return `Winner: ${winner.value.toUpperCase()}!`;
      }
      return 'It\'s a tie!';
    });

    return {
      currentPlayer,
      isGameOver,
      winnerMessage,
    };
  },
};
</script>
