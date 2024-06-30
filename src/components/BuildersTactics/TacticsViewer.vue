<template>
    <v-container>
        <v-card v-if="gameInfo" class="mt-5">
            <v-card-title>
                <v-row justify="space-between">
                    <span>ゲームステータス: {{ gameInfo.status }}</span>
                </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <PlayerInfo :teams="gameInfo.teams" />
                <v-divider class="my-4"></v-divider>
                <GameSettings v-if="gameInfo.status === 'setting'" :settings="gameInfo.setting" @update="updateGameSettings" @agree="handleAgreement" @leave="handleLeaveGame" />
                <GameResults v-if="gameInfo.status === 'completed'" :winner="gameInfo.winner" />
                <InGame v-if="gameInfo.status === 'in_game'" :gameInfo="gameInfo" :builds="builds" @completePlacement="completeUnitPlacement" @fetchGameInfo="fetchGameInfo" @surrender="handleSurrender" @fetchUnitInfo="fetchUnitInfo"/>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { computed, onMounted, ref, onUnmounted, defineProps } from 'vue';
import { useStore } from 'vuex';
import { getPlayerGame, leaveGame, updateGameSetting, proceedGame, getBuilds, placeUnit, getUnitInfo } from './BuildersTacticsApi';
import PlayerInfo from './PlayerInfo.vue';
import GameSettings from './GameSettings.vue';
import GameResults from './GameResults.vue';
import InGame from './InGame.vue';

const props = defineProps({
    toGames: Function
});

const store = useStore();
const gameInfo = computed(() => store.getters['buildersTacticsStore/gameInfo']);
const currentGameId = computed(() => store.getters['buildersTacticsStore/currentGameId']);
const playerId = computed(() => store.getters['authStore/getName']);
const builds = computed(() => store.getters['buildersTacticsStore/builds']);

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

const fetchUnitInfo = async (unitId) => {
    try {
        const unitInfoData = await getUnitInfo(currentGameId.value, unitId);
        store.dispatch('buildersTacticsStore/setUnitInfo', unitInfoData);
    } catch (error) {
        console.error('Error fetching game info:', error);
    }
};

const fetchBuilds = async () => {
    try {
        const response = await getBuilds();
        store.dispatch('buildersTacticsStore/setBuilds', response.builds);
    } catch (error) {
        console.error('Error fetching builds:', error);
    }
};

const updateGameSettings = async () => {
    try {
        await updateGameSetting(currentGameId.value, gameInfo.value.setting);
    } catch (error) {
        console.error('Error updating game settings:', error);
    }
};

const handleAgreement = async () => {
    try {
        const param = {
            status: gameInfo.value.status,
            agreement: "agree"
        }
        const response = await proceedGame(currentGameId.value, param);
        store.dispatch('buildersTacticsStore/setGameInfo', response);
        console.log('Game proceeded successfully');
    } catch (error) {
        console.error('Error proceeding game:', error);
    }
};

const handleSurrender = async () => {
    try {
        const param = {
            status: gameInfo.value.status,
            agreement: "surrender"
        }
        const response = await proceedGame(currentGameId.value, param);
        store.dispatch('buildersTacticsStore/setGameInfo', response);
        console.log('Game proceeded successfully');
    } catch (error) {
        console.error('Error proceeding game:', error);
    }
};

const handleLeaveGame = async () => {
    try {
        await leaveGame(currentGameId.value, playerId.value);
        props.toGames();
    } catch (error) {
        console.error('Error leaving game:', error);
    }
};

const completeUnitPlacement = async () => {
    try {
        const fieldData = {
            field: gameInfo.value.field,
            agreement: "battle"
        };
        const response = await placeUnit(currentGameId.value, fieldData);
        console.log('Units placed successfully:', response);
    } catch (error) {
        console.error('Error placing units:', error);
    }
};

const intervalId = ref(null);

onMounted(() => {
    fetchGameInfo();
    fetchBuilds();
    intervalId.value = setInterval(fetchGameInfo, 300000);
});

onUnmounted(() => {
    clearInterval(intervalId.value);
});
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
