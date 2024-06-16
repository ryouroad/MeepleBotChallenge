<template>
  <v-icon :class="['chess-piece', { 'invert-color': piece.color === 'White' }]">
    mdi-chess-{{ pieceName }}
  </v-icon>
</template>

<script>
export default {
  props: {
    piece: {
      type: Object,
      required: true, // { type: 'Pawn', color: 'White' } などの形式
    },
  },
  computed: {
    pieceName() {
      if (!this.piece.type) {
        return '';
      }
      return this.piece.type.toLowerCase(); // Example: 'Pawn' -> 'pawn'
    },
  },
};
</script>

<style scoped>
.chess-piece {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.4rem; /* Adjust size as needed */
  color: black; /* Default color for black pieces */
}

/* 白い駒の色を反転 */
.invert-color {
  color: white
}
</style>
