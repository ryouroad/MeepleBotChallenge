<template>
  <div class="builders-tactics-board">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="board-row">
      <BoardSquare
        v-for="(square, columnIndex) in row"
        :key="columnIndex"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import BoardSquare from './BoardSquare.vue';

const store = useStore();

// Vuex 4 のストアからチェス盤の状態を取得
const board = computed(() => store.state.buildersTacticsStore.game.board);
</script>

<style scoped>
.builders-tactics-board {
  display: flex;
  flex-wrap: wrap;
  width: 320px; /* または任意のサイズ */
  height: 320px; /* 盤面のサイズを指定 */
  margin: auto;
}
.board-row {
  display: flex;
  width: 100%;
}
</style>
