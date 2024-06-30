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
        <TacticsField :field="gameInfo.field" :selectedUnit="localSelectedUnit" @fetchUnitInfo="fetchUnitInfo"/>
        <v-select v-if="gameInfo.phase == 'initialize'" v-model="localSelectedUnit" :items="builds" item-title="build_name" item-value="build_id" label="ビルドを選択" return-object></v-select>
        <v-btn v-if="gameInfo.phase === 'initialize'" @click="completePlacement" color="primary">ユニット配置完了</v-btn>
        <BuildViewer />
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue';
import TacticsField from './TacticsField.vue'; // ここを確認
import BuildViewer from './BuildViewer.vue'; // ここを確認

// Propsの定義
const props = defineProps({
    gameInfo: {
        type: Object,
        required: true
    },
    builds: {
        type: Array,
        required: true
    }
});

// Emitsの定義
const emit = defineEmits(['completePlacement', 'fetchGameInfo', 'fetchUnitInfo', 'surrender']);

// ローカルの状態
const localSelectedUnit = ref(props.builds[0]); // 例として最初のビルドを初期値に設定

// メソッドの定義
const completePlacement = () => {
    emit('completePlacement');
};

const fetchGameInfo = () => {
    emit('fetchGameInfo');
};

const fetchUnitInfo = (unitId) => {
    emit('fetchUnitInfo', unitId);
};

const surrender = () => {
    emit('surrender');
};
</script>
