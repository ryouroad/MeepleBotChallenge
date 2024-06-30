<template>
    <v-container>
        <v-row class="d-flex justify-center mb-4">
            <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
                <v-btn @click="fetchGames" color="primary" class="mx-2">ゲーム一覧取得</v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
                <v-btn @click="handleCreateGame" color="primary" class="mx-2">ゲーム作成</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="game in games" :key="game.game_id" cols="12" sm="6" md="4" lg="3" class="mb-4">
                <v-card>
                    <v-card-title>
                        参加者: {{ getPlayerCount(game) }} / {{ game.setting.player_number }}
                    </v-card-title>
                    <v-card-subtitle>{{ game.status }}</v-card-subtitle>
                    <v-card-text>
                        <v-list>
                            <v-list-item v-for="(team, index) in game.teams" :key="index">
                                <v-list-item-content>
                                    <v-list-item-title><strong>Team {{ index + 1 }}:</strong></v-list-item-title>
                                    <v-list-item-subtitle>
                                        <v-list dense>
                                            <v-list-item v-for="player in team" :key="player.player_id">
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ player.player_id }} ({{ player.agreement }})</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="handleJoinGame(game.game_id)" color="primary">参加</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { useStore } from 'vuex';
import { getGames, createGame, joinGame } from './BuildersTacticsApi';

const props = defineProps({
    toTactics: Function
});

const store = useStore();
const games = ref([]);

const fetchGames = async () => {
    try {
        const response = await getGames();
        games.value = response.games;
    } catch (error) {
        console.error('ゲーム一覧の取得に失敗しました:', error);
    }
};

const handleCreateGame = async () => {
    try {
        const newGame = await createGame();
        games.value.push(newGame);
    } catch (error) {
        console.error('ゲームの作成に失敗しました:', error);
    }
};

const handleJoinGame = async (gameId) => {
    try {
        await joinGame(gameId);
        store.dispatch('buildersTacticsStore/setCurrentGameId', gameId);
        // 参加後にtactics画面に遷移
        props.toTactics();
    } catch (error) {
        console.error(`ゲーム ${gameId} への参加に失敗しました:`, error);
    }
};

// 参加者数をカウントするヘルパー関数
const getPlayerCount = (game) => {
    return game.teams.reduce((count, team) => count + team.length, 0);
};
</script>