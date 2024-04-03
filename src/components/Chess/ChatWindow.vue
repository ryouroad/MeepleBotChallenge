<!-- ChatWindow.vue -->
<template>
<div class="chat-window">
    <ChatMessage v-for="(message, i) in messages" :key="i" :message="message.text" :sender="message.sender" />
</div>
</template>

<script>
import ChatMessage from './ChatMessage.vue'

export default {
components: { ChatMessage },
props: ['messages'],
}
</script>
  