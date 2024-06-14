<!-- FeedbackInput.vue -->
<template>
    <div class="Feedback-input">
        <p>ゲームやAI、このサイトへのご意見をお聞かせください。</p>
        <!-- ローディング中はインジケータを表示 -->
        <p v-if="isFeedbackLoading">送信中...</p>
        <!-- ローディングでないときはボタンを表示 -->
        <v-text-field  v-else  v-model="input" @keyup.enter="send" placeholder="ご意見を入力してください。。。" min-width="400"/>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
    data() {
        return { input: '' }
    },
    computed: {
        ...mapState({
            isFeedbackLoading: state => state.commonStore.isFeedbackLoading,
        }),
        ...mapGetters({
            getUserName: 'authStore/getName',
        })
    },
    methods: {
        send() {
            const message = this.input
            const name = this.getUserName? this.getUserName : "MeepleBotChallenge"
            const page = this.$route.path
            // console.log(message,name,page)
            this.$emit('send', {message, name , page })
            this.input = ''
        },
    },
}
</script>
  