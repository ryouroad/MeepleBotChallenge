<template>
    <div>
        <h3>ゲーム設定</h3>
        <v-list dense>
            <v-list-item>
                <v-list-item-content>
                    <v-select v-model="localSettings.rule" :items="['normal', 'advanced']" label="ルール"></v-select>
                    <v-select v-model="localSettings.player_order" :items="['random', 'fixed']" label="プレイヤー順"></v-select>
                    <v-select v-model="localSettings.initial_area" :items="['normal', 'extended']" label="初期エリア"></v-select>
                    <v-text-field v-model="localSettings.player_number" label="プレイヤー数" type="number" min="2" max="8"></v-text-field>
                    <v-text-field v-model="localSettings.team_number" label="チーム数" type="number" min="2" max="4"></v-text-field>
                    <v-text-field v-model="localSettings.max_turn" label="最大ターン数" type="number" min="1" max="100"></v-text-field>
                    <v-text-field v-model="localSettings.field_size" label="フィールドサイズ" type="number" min="3" max="20"></v-text-field>
                    <v-text-field v-model="localSettings.max_cost" label="最大コスト" type="number" min="3" max="1000"></v-text-field>
                    <v-text-field v-model="localSettings.max_build" label="最大ビルド数" type="number" min="1" max="10"></v-text-field>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-btn @click="fetchSettings" color="primary">ゲーム設定の取得</v-btn>
        <v-btn @click="updateSettings" color="primary">ゲーム設定の更新</v-btn>
        <v-btn @click="agree" color="primary">ゲーム設定に同意</v-btn>
        <v-btn @click="leave" color="primary">ゲームから退出</v-btn>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from 'vue';

const props = defineProps({
    settings: Object
});

const emit = defineEmits(['update', 'agree', 'leave']);

// props.settingsを元にローカルデータを作成
const localSettings = reactive({ ...props.settings });

const fetchSettings = () => {
    emit('fetch');
};

const updateSettings = () => {
    emit('update', localSettings);
};

const agree = () => {
    emit('agree');
};

const leave = () => {
    emit('leave');
};

// props.settingsが変更された場合にlocalSettingsを更新
watch(() => props.settings, (newSettings) => {
    Object.assign(localSettings, newSettings);
});
</script>
