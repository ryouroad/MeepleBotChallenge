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
                                                <v-list-item-subtitle>Agreement: {{ player.agreement}}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
            </v-card-text>
        </v-card>
        <v-btn @click="fetchGameInfo" class="mt-4">Fetch Game Info</v-btn>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getPlayerGame } from './BuildersTacticsApi';

export default {
    name: 'GameInfo',
    computed: {
        ...mapGetters('buildersTacticsStore', [
            'currentGameId',
            'gameInfo',
        ]),
    },
    methods: {
        ...mapActions('buildersTacticsStore', [
            'setGameInfo',
        ]),
        async fetchGameInfo() {
            const playerId = this.$store.getters['authStore/getName'];
            if (this.currentGameId && playerId) {
                try {
                    const gameInfo = await getPlayerGame(this.currentGameId, playerId);
                    this.setGameInfo(gameInfo);
                } catch (error) {
                    console.error('Error fetching game info:', error);
                }
            }
        },
    },
    created() {
        this.fetchGameInfo();
    }
};
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