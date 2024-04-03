<!-- ScoreBoard.vue -->
<template>
<div class="score-board">
    <div>Black: {{ score.black }}</div>
    <div>White: {{ score.white }}</div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            board: state => state.reversiStore.game.board,
        }),
        score() {
            let black = 0
            let white = 0
            for (const row of this.board) {
                for (const cell of row) {
                    if (cell === 'black') black++
                    if (cell === 'white') white++
                }
            }
            return { black, white }
        },
    },
}
</script>
