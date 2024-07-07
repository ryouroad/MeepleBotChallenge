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
                <GameSettings :settings="gameInfo.setting" @fetch="fetchGameInfo" @update="updateGameSettings" @agree="handleAgreement" @leave="handleLeaveGame" />
                <v-divider v-if="gameInfo.status !== 'setting'" class="my-4"></v-divider>
                <GameResults v-if="gameInfo.status === 'completed'" :winner="gameInfo.winner" />
                <v-divider v-if="gameInfo.status === 'completed'" class="my-4"></v-divider>
                <InGame v-if="gameInfo.status !== 'setting'" :gameInfo="gameInfo" :builds="builds" @completePlacement="completeUnitPlacement" @fetchGameInfo="fetchGameInfo" @surrender="handleSurrender" @unitAction="unitAction" @fetchParts="fetchParts"/>
            </v-card-text>
        </v-card>

        <!-- Error Dialog -->
        <v-dialog v-model="errorDialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">エラー</v-card-title>
                <v-card-text>
                    {{ errorMessage }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="closeErrorDialog">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue';
import { useStore } from 'vuex';
import { getPlayerGame, leaveGame, updateGameSetting, proceedGame, getBuilds, placeUnit, getUnits, postMove, postAttack, getPart } from './BuildersTacticsApi';
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
const selectedBuild = computed(() => store.getters['buildersTacticsStore/selectedBuild']);

const errorDialog = ref(false);
const errorMessage = ref('');

const fetchGameInfo = async () => {
    if (currentGameId.value && playerId.value) {
        try {
            const gameInfoData = await getPlayerGame(currentGameId.value, playerId.value);
            store.dispatch('buildersTacticsStore/setGameInfo', gameInfoData);
            await fetchUnits();
        } catch (error) {
            console.error('Error fetching game info:', error);
        }
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

const fetchUnits = async () => {
    try {
        const unitsInfo = await getUnits(currentGameId.value);
        store.dispatch('buildersTacticsStore/setUnits', unitsInfo);
    } catch (error) {
        console.error('Error fetching game info:', error);
    }
};

const updateGameSettings = async (setting) => {
    try {
        const response = await updateGameSetting(currentGameId.value, setting);
        store.dispatch('buildersTacticsStore/setGameInfo', response);
    } catch (error) {
        console.error('Error updating game settings:', error);
        errorMessage.value = 'ゲーム設定の更新中にエラーが発生しました。設定値が範囲外の可能性があります。もう一度お試しください。';
        showErrorDialog();
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
        const fieldInfo = await placeUnit(currentGameId.value, fieldData);
        console.error(fieldInfo);
        await fetchGameInfo();
    } catch (error) {
        console.error('Error placing units:', error);
    }
};

const unitAction = async (actionDetail) => {
    try {
        var response = null;
        if (actionDetail.phase == "move"){
            response = await postMove(currentGameId.value, actionDetail.actionUnit, actionDetail.target)
        }else{
            response = await postAttack(currentGameId.value, actionDetail.actionUnit, actionDetail)
        }
        store.dispatch('buildersTacticsStore/setGameInfo', response);
        await fetchUnits();
    } catch (error){
        console.error('Error action unit:', error);
    }
}

const fetchPartsDetails = async (partsIds) => {
  try {
    const partsDetails = await Promise.all(partsIds.map(partId => getPart(partId)));
    store.dispatch('buildersTacticsStore/setParts',partsDetails.map(response => response));
  } catch (error) {
    console.error('Failed to fetch parts details:', error);
  }
};

const fetchParts = async () => {
    const build = selectedBuild.value
    await fetchPartsDetails([
        build.head_id,
        build.core_id,
        build.leg_id,
        ...build.option_parts
    ]);

};

const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
        fetchGameInfo();
    }
};

const showErrorDialog = () => {
    errorDialog.value = true;
};

const closeErrorDialog = () => {
    errorDialog.value = false;
};

onMounted(() => {
    fetchGameInfo();
    fetchBuilds();
    fetchUnits();
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
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
