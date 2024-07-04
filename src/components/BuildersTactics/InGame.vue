<template>
    <div>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title>ターン: {{ gameInfo.turn }}</v-list-item-title>
                <v-list-item-subtitle>ターンプレイヤー: {{ gameInfo.turn_player }}</v-list-item-subtitle>
                <v-list-item-title>フェイズ: {{ gameInfo.phase }}</v-list-item-title>
                <v-list-item-subtitle>フェイズプレイヤー: {{ gameInfo.phase_player }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-divider class="my-4"></v-divider>
        <v-btn @click="fetchGameInfo" color="primary">フィールド更新</v-btn>
        <v-btn v-if="gameInfo.phase !== 'initialize'" @click="surrender" color="primary">降参</v-btn>
        <TacticsField :field="gameInfo.field"/>
        <v-btn v-if="gameInfo.phase === 'initialize'" @click="completePlacement" color="primary">ユニット配置完了</v-btn>
        <BuildViewer />
    </div>
</template>

<script setup>
import { computed, defineEmits } from 'vue';
import { useStore } from 'vuex';
import TacticsField from './TacticsField.vue'; // ここを確認
import BuildViewer from './BuildViewer.vue'; // ここを確認

const store = useStore();
const gameInfo = computed(() => store.getters['buildersTacticsStore/gameInfo']);

// Emitsの定義
const emit = defineEmits(['completePlacement', 'fetchGameInfo', 'surrender']);

// メソッドの定義
const completePlacement = () => {
    emit('completePlacement');
};

const fetchGameInfo = () => {
    emit('fetchGameInfo');
};

const surrender = () => {
    emit('surrender');
};
</script>
