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
        <v-row id="menu-viewer" class="d-flex justify-center" cols="12">
            <v-col cols="12" md="3" class="d-flex justify-center">
                <v-btn @click="fetchGameInfo" color="primary">フィールド更新</v-btn>
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-center">
                <v-btn v-if="gameInfo.phase === 'initialize' && getAgreement() === 'agree'" @click="completePlacement" color="primary">
                    ユニット配置完了
                    <v-tooltip bottom activator="parent">
                        <span v-if="!costOver && !buildOver">Are you ready?</span>
                        <span v-if="costOver">Cost over! </span>
                        <span v-if="buildOver">Build number over!</span>
                    </v-tooltip>
                </v-btn>
                <v-btn v-if="gameInfo.phase !== 'initialize' && gameInfo.phase_player === playerId" @click="nextPhase" color="primary">フェイズ終了</v-btn>
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-center">
                <v-btn v-if="gameInfo.phase !== 'initialize'" @click="switchDisplaySearch" color="primary">索敵表示切替</v-btn>
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-center">
                <v-text v-if="gameInfo.phase === 'initialize' && getAgreement() === 'agree'">コスト：{{ totalCost }}</v-text>
                <v-text v-if="gameInfo.phase === 'initialize' && getAgreement() === 'agree'">ビルド数：{{ totalBuild }}</v-text>
                <v-btn v-if="gameInfo.phase !== 'initialize'" @click="surrender" color="primary">降参</v-btn>
            </v-col>
        </v-row>
        <TacticsField :field="gameInfo.field" @action="unitAction" @fetchParts="fetchParts" />
        <BuildViewer />
    </div>
</template>

<script setup>
import { computed, defineEmits } from 'vue';
import { useStore } from 'vuex';
import TacticsField from './TacticsField.vue';
import BuildViewer from './BuildViewer.vue';

const store = useStore();
const gameInfo = computed(() => store.getters['buildersTacticsStore/gameInfo']);
const playerId = computed(() => store.getters['authStore/getName']);
const builds = computed(() => store.getters['buildersTacticsStore/builds']);
const displaySearch = computed(() => store.getters['buildersTacticsStore/displaySearch']);
const buildOver = computed(() => {
    return (totalBuild.value > gameInfo.value.setting.max_build)
}) ;
const totalBuild = computed(() => {
    let buildIds = [];

    gameInfo.value.field.forEach(row => {
        row.forEach(cell => {
            const build = builds.value.find(b => b.build_id === cell.unit);
            if (build) {
                if (!buildIds.includes(build.build_id)) {
                    buildIds.push(build.build_id);
                }
            }
        });
    });

    return buildIds.length;
});
const costOver = computed(() => {
    return (totalCost.value > gameInfo.value.setting.max_cost)
}) ;
const totalCost = computed(() => {
    let costSum = 0;

    gameInfo.value.field.forEach(row => {
        row.forEach(cell => {
            const build = builds.value.find(b => b.build_id === cell.unit);
            if (build) {
                costSum += build.total_cost;
            }
        });
    });

    return costSum;
});

const emit = defineEmits(['completePlacement', 'nextPhase', 'fetchGameInfo', 'surrender', 'unitAction', 'fetchParts']);

const completePlacement = () => {
    if(!costOver.value && !buildOver.value){
        emit('completePlacement');
    }
};

const nextPhase = () => {
    emit('nextPhase');
};

const fetchGameInfo = () => {
    emit('fetchGameInfo');
};

const surrender = () => {
    emit('surrender');
};

const unitAction = (actionDetail) => {
    emit('unitAction', actionDetail);
};

const fetchParts = (resolve) => {
    emit('fetchParts',resolve);
};

const getAgreement = () => {
    const player = gameInfo.value.teams.flat().find(player => player.player_id === playerId.value);
    return player?.agreement
}

const switchDisplaySearch = () => {
    store.dispatch('buildersTacticsStore/setDisplaySearch', !displaySearch.value);
}

</script>
