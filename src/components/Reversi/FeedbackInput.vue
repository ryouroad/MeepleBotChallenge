<!-- FeedbackInput.vue -->
<template>
    <div class="Feedback-input">
        <p>ボードゲームAIやこのサイトへのご意見をお聞かせください。</p>
        <!-- ローディング中はインジケータを表示 -->
        <p v-if="isFeedbackLoading">送信中...</p>
        <!-- ローディングでないときはボタンを表示 -->
        <input v-else  v-model="input" @keyup.enter="send" placeholder="ご意見を入力してください。。。" />
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
            isFeedbackLoading: state => state.reversiStore.isFeedbackLoading,
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
  