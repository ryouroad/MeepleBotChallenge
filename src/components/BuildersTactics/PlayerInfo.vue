<template>
    <div>
        <h3>プレイヤー情報</h3>
        <v-row>
            <v-col v-for="(team, index) in props.teams" :key="index" cols="12" md="6">
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
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    teams: Array
});
</script>
