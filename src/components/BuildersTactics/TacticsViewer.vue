<template>
    <v-container>
        <v-card v-if="gameInfo" class="mt-5">
            <v-card-title>
                <v-row justify="space-between">
                    <span>ゲームステータス: {{ gameInfo.status }}</span>
                    <span>フェイズ: {{ gameInfo.phase }}</span>
                </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>ターン: {{ gameInfo.turn }}</v-list-item-title>
                        <v-list-item-subtitle>ターンプレイヤー: {{ gameInfo.turn_player }}</v-list-item-subtitle>
                        <v-list-item-subtitle>フェイズプレイヤー: {{ gameInfo.phase_player }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider class="my-4"></v-divider>
                <div>
                    <h3>プレイヤー情報</h3>
                    <v-row>
                        <v-col v-for="(team, index) in gameInfo.teams" :key="index" cols="12" md="6">
                            <v-card outlined>
                                <v-card-title>Team {{ index + 1 }}</v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-list dense>
                                        <v-list-item v-for="player in team" :key="player.player_id">
                                            <v-list-item-content>
                                                <v-list-item-title>Player: {{ player.player_id }}</v-list-item-title>
                                                <v-list-item-subtitle>Score: {{ player.score }}</v-list-item-subtitle>
                                                <v-list-item-subtitle>Status: {{ player.agreement }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
                <v-divider class="my-4"></v-divider>
                <div v-if="gameInfo.status === 'setting'">
                    <h3>ゲーム設定</h3>
                    <v-list dense>
                        <v-list-item>
                            <v-list-item-content>
                                <v-select v-model="gameInfo.setting.rule" :items="['normal', 'advanced']" label="ルール"></v-select>
                                <v-select v-model="gameInfo.setting.player_order" :items="['random', 'fixed']" label="プレイヤー順"></v-select>
                                <v-select v-model="gameInfo.setting.initial_area" :items="['normal', 'extended']" label="初期エリア"></v-select>
                                <v-text-field v-model="gameInfo.setting.player_number" label="プレイヤー数" type="number" min="2" max="8"></v-text-field>
                                <v-text-field v-model="gameInfo.setting.team_number" label="チーム数" type="number" min="2" max="4"></v-text-field>
                                <v-text-field v-model="gameInfo.setting.max_turn" label="最大ターン数" type="number" min="1" max="100"></v-text-field>
                                <v-text-field v-model="gameInfo.setting.field_size" label="フィールドサイズ" type="number" min="3" max="20"></v-text-field>
                                <v-text-field v-model="gameInfo.setting.max_cost" label="最大コスト" type="number" min="3" max="1000"></v-text-field>
                                <v-text-field v-model="gameInfo.setting.max_build" label="最大ビルド数" type="number" min="1" max="10"></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-btn @click="updateGameSettings">ゲーム設定の更新</v-btn>
                    <v-btn @click="handleAgreement">ゲーム設定に同意</v-btn>
                    <v-btn @click="handleLeaveGame">ゲームから退出</v-btn>
                </div>
                <div v-if="gameInfo.status === 'completed'">
                    <h3>ゲーム結果</h3>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>勝者: {{ gameInfo.winner }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </div>
            </v-card-text>
        </v-card>
        <v-btn @click="fetchGameInfo" class="mt-4">更新</v-btn>
    </v-container>
</template>

<script setup>
import { defineProps, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getPlayerGame, leaveGame, updateGameSetting } from './BuildersTacticsApi';

const props = defineProps({
    toGames: Function
});

const store = useStore();
const gameInfo = computed(() => store.getters['buildersTacticsStore/gameInfo']);
const currentGameId = computed(() => store.getters['buildersTacticsStore/currentGameId']);
const playerId = computed(() => store.getters['authStore/getName']);

const fetchGameInfo = async () => {
    if (currentGameId.value && playerId.value) {
        try {
            const gameInfoData = await getPlayerGame(currentGameId.value, playerId.value);
            store.dispatch('buildersTacticsStore/setGameInfo', gameInfoData);
        } catch (error) {
            console.error('Error fetching game info:', error);
        }
    }
};

const updateGameSettings = async () => {
    try {
        await updateGameSetting(currentGameId.value, gameInfo.value.setting);
    } catch (error) {
        console.error('Error updating game settings:', error);
    }
};

const handleAgreement = () => {
    console.log('同意ボタンが押されました');
    // 実際には何も実行しない
};

const handleLeaveGame = async () => {
    try {
        await leaveGame(currentGameId.value, playerId.value);
        props.toGames();
    } catch (error) {
        console.error('Error leaving game:', error);
    }
};

onMounted(fetchGameInfo);
</script>

<style scoped>
.mt-5 {
    margin-top: 20px;
}

.mt-4 {
    margin-top: 16px;
}

.my-4 {
    margin-top: 16px;
    margin-bottom: 16px;
}
</style>
