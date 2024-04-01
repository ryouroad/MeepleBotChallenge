<!-- ReversiBoard.vue -->
<template>
  <div class="board">
    <div v-for="(row, i) in board" :key="i" class="row">
      <div v-for="(cell, j) in row" :key="j">
          <BoardCell :state="cell" @click="() => this.handleMove({ x: j, y: i })" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BoardCell from './BoardCell.vue'

export default {
  components: { BoardCell },
  computed: mapState({
    board: state => state.reversiStore.game.board,
  }),
  methods: {
    ...mapActions('reversiStore', ['handleMove']),
  },}
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 1px;
  width: 320px;
  height: 320px;
  background-color: #228b22;
  box-sizing: border-box; 
}
</style>