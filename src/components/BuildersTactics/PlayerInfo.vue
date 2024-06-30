<template>
    <div>
        <h3>プレイヤー情報</h3>
        <v-row>
            <v-col v-for="(team, index) in props.teams" :key="index" cols="12" md="6">
                <v-card :style="{ borderColor: teamInfo.colors[index], borderWidth: '2px', borderStyle: 'solid' }">
                    <v-card-title :style="{ color: teamInfo.colors[index] }">
                        <v-icon>{{ teamInfo.icons[index] }}</v-icon>
                        Team {{ index + 1 }}
                    </v-card-title>
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
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
    teams: Array
});
const store = useStore();
const teamInfo = computed(() => store.getters['buildersTacticsStore/teamInfo']);
</script>

<style scoped>
.v-card-title {
    display: flex;
    align-items: center;
    font-weight: bold;
}
.v-card-title v-icon {
    margin-right: 8px;
}
</style>
