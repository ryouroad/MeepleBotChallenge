<template>
  <div class="chess-piece" :class="{ 'invert-color': piece.color === 'White' }">
    <img v-if=piece.type :src="pieceImageSrc" :alt="piece.type" />
  </div>
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
    pieceImageSrc() {
      if (this.piece.type === null) {
        return '';
      }
      return `/Chess/${this.piece.type}.webp`;
    },
  },
};
</script>

<style scoped>
.chess-piece {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chess-piece img {
  width: 100%;
  height: 100%;
}

/* 白い駒の色を反転 */
.invert-color img {
  filter: invert(1);
}

</style>
