<template>
  <div>
    <!-- ローディング中はインジケータを表示 -->
    <p v-if="isNextMoveLoading">ミープルボットが次の手を計算中...</p>
    <!-- ローディングでないときはボタンを表示 -->
    <v-btn v-else @click="askAINextMove">ミープルボットに次の手を決めさせる</v-btn>
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
