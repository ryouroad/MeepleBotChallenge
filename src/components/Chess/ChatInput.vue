<!-- ChatInput.vue -->
<template>
    <div class="chat-input">
        <!-- ローディング中はインジケータを表示 -->
        <p v-if="isChatLoading">ミープルボットが考え中...</p>
        <!-- ローディングでないときはボタンを表示 -->
        <v-text-field  v-else  v-model="input" @keyup.enter="send" placeholder="ミープルボットへの質問を入れてください..." min-width="400"/>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return { input: '' }
    },
    computed: {
        ...mapState({
            isChatLoading: state => state.chessStore.isChatLoading,
        }),
    },
    methods: {
        send() {
            this.$emit('send', this.input)
            this.input = ''
        },
    },
}
</script>
  