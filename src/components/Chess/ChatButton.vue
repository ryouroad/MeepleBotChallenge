<!-- ChatInput.vue -->
<template>
    <div class="chat-input">
        <button v-if="!isChatLoading" @click="send('戦況は？')">ミープルボットに戦況を聞く</button>
        <button v-if="!isChatLoading" @click="send('最善手は？')">ミープルボットに最善手を聞く</button>
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
        send(question) {
            this.$emit('send', question)
        },
    },
}
</script>
  