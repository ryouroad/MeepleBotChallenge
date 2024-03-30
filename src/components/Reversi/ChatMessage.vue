<!-- ChatMessage.vue -->
<template>
    <div class="chat-message" :class="sender">
        <div class="message">{{ message }}</div>
    </div>
</template>

<script>
export default {
    props: ['message', 'sender'],
}
</script>
  