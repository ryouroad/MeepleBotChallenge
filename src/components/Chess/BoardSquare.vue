<template>
  <div class="board-square" @click="squareClicked" :class="squareClass">
    <ChessPiece v-if="piece" :piece="piece" />
    <!-- <p>{{isPossibleMove}}</p> -->
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import ChessPiece from './ChessPiece.vue';
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps({
  piece: Object,
  position: Object,
  isPossibleMove: Boolean,
})

// isPossibleMoveを使用したロジック、例えば条件付きクラスを計算する
const squareClass = computed(() => {
  const isDark = (props.position.x + props.position.y) % 2 === 1;
  if(props.isPossibleMove) return 'possible-move'; // ここでリアクティブな参照を使用
  return {
    'board-square-dark': isDark,
    'board-square-light': !isDark,
  };
});

const squareClicked = () => {
    // console.log(`Square clicked: ${props.position.x}, ${props.position.y}, ${props.piece?.type}, ${props.piece?.color}, `);
    if(store.state.chessStore.game.winner != null) return;
    // 移動元を選択済の場合
    if(store.state.chessStore.game.from != null){
        // 動ければ移動先にコマを移動する
        // console.log(`from != null : ${props.position.x}, ${props.position.y}, ${props.piece?.type}, ${props.piece?.color}, `);
        // console.log(store.state.chessStore.game.from);
        if(store.state.chessStore.game.from.x === props.position.x & store.state.chessStore.game.from.y === props.position.y){
            // console.log(`clearPossibleMoves : ${props.position.x}, ${props.position.y}, ${props.piece?.type}, ${props.piece?.color}, `);
            store.commit('chessStore/clearPossibleMoves')
            store.commit('chessStore/clearFrom')
        }else if(props.isPossibleMove){
            // console.log(`performMove : ${props.position.x}, ${props.position.y}, ${props.piece?.type}, ${props.piece?.color}, `);
            store.dispatch('chessStore/performMove', {
                from: store.state.chessStore.game.from,
                to: props.position,
            });
            // 移動元の場合未選択状態に戻す
        }
    // 移動元を未選択の場合
    }else{
        // console.log()
        // console.log(`from === null : ${props.position.x}, ${props.position.y}, ${props.piece?.type}, ${props.piece?.color}, `);
        // 特定のピースとその位置に基づいて可能な移動先を計算する
        store.dispatch('chessStore/calculatePossibleMoves', {
            piece: props.piece, // 例えば白のポーン
            position: props.position // ピースの現在位置
        });
    }
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
.board-square-dark {
  background-color: #8B4513; /* 濃い色 */
}
.board-square-light {
  background-color: #F5DEB3; /* 明るい色 */
}
</style>