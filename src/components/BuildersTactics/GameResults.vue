<template>
    <div>
        <h3>ゲーム結果</h3>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title>勝者: {{ props.winner }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    winner: String
});
</script>
