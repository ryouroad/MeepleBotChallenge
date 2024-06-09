<template>
  <div class="board-square" @click="squareClicked" :class="squareClass">
    <!-- <p>{{isPossibleMove}}</p> -->
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps({
  isPossibleMove : Boolean,
  isPossibleAttack : Boolean,
})

const squareClass = computed(() => {
  if(props.isPossibleMove) return 'possible-move';
  if(props.isPossibleAttack) return 'possible-attack';
  return 'board-square-dark';
});

const squareClicked = () => {
    // console.log(`Square clicked: ${props.position.x}, ${props.position.y}, ${props.piece?.type}, ${props.piece?.color}, `);
    if(store.state.chessStore.game.winner != null) return;
};
</script>


<style scoped>
.board-square {
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  cursor: pointer; /* クリック可能なことを示す */
}
.possible-move {
  background-color: #aff; /* ハイライト表示用の色 */
}
.possible-move {
  background-color: rgb(209, 14, 14); /* ハイライト表示用の色 */
}
.board-square-dark {
  background-color: #8B4513; /* 濃い色 */
}
</style>