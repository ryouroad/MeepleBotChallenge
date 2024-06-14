<!-- ChatInput.vue -->
<template>
    <div class="reset">
        <v-btn @click="send()">ゲームをリセットする</v-btn>
    </div>
</template>

<script>
export default {
    methods: {
        send() {
            this.$emit('send')
        },
    },
}
</script>
  