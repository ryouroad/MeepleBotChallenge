<template>
  <div>
    <!-- ローディング中はインジケータを表示 -->
    <p v-if="isNextMoveLoading">ミープルボットが次の手を計算中...</p>
    <!-- ローディングでないときはボタンを表示 -->
    <button v-else @click="askAINextMove">ミープルボットに次の手を決めさせる</button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AINextMoveButton',
  computed: {
    ...mapState({
      isNextMoveLoading: state => state.chessStore.isNextMoveLoading,
    }),
  },
  methods: {
    ...mapActions('chessStore', ['getNextMove']),
        
    askAINextMove() {
      // VuexストアのgetNextMoveアクションをディスパッチする
      this.getNextMove();
    }
  }
};
</script>
