<template>
    <v-container fluid>
        <div class="grid-container" :style="gridStyle">
            <div v-for="(row, rowIndex) in field" :key="rowIndex" class="grid-row">
                <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="grid-cell">
                    <v-card 
                        class="pa-2 square-card" 
                        @click="selectCell(rowIndex, cellIndex)"
                        :style="{ borderColor: getTeamColor(cell.unit), borderWidth: '2px', borderStyle: 'solid' }"
                    >
                        <v-card-title>
                            <div v-if="cell.unit" class="unit-container">
                                <v-img :src="getUnitImage(cell.unit)" alt="unit image" class="unit-image">
                                    <v-icon :color="getTeamColor(cell.unit)" :style="iconStyle" class="icon-overlay">
                                        {{ getTeamIcon(cell.unit) }}
                                    </v-icon>
                                </v-img>
                            </div>
                            <div v-if="cell.initial_area && !cell.unit && gameInfo.phase == 'initialize'" class="unit-container">
                                <v-icon :color="getTeamColor(cell.initial_area)" :style="iconStyle" class="icon-overlay">
                                    {{ getTeamIcon(cell.initial_area) }}
                                </v-icon>
                            </div>
                        </v-card-title>
                    </v-card>
                </div>
            </div>
        </div>
    </v-container>
</template>

<script setup>
import { computed, defineEmits, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';

const emit = defineEmits(['fetchUnitInfo']);
const store = useStore();
const field = computed(() => store.getters['buildersTacticsStore/field']);
const gameInfo = computed(() => store.getters['buildersTacticsStore/gameInfo']);
const builds = computed(() => store.getters['buildersTacticsStore/builds']);
const units = computed(() => store.getters['buildersTacticsStore/units']);
const teamInfo = computed(() => store.getters['buildersTacticsStore/teamInfo']);
const selectedBuild = computed(() => store.getters['buildersTacticsStore/selectedBuild']);
const player_id = computed(() => store.getters['authStore/getName']);

const iconSize = ref(0);

const selectCell = (rowIndex, cellIndex) => {
    const newField = JSON.parse(JSON.stringify(field.value));
    if (gameInfo.value.phase === 'initialize') {
        if (newField[rowIndex][cellIndex].initial_area == player_id.value){
            newField[rowIndex][cellIndex].unit = selectedBuild.value?.build_id;
            store.dispatch('buildersTacticsStore/setField', newField);
        }
    } else {
        emit('fetchUnitInfo', field.value[rowIndex][cellIndex].unit);
    }
};

const getUnitImage = (unitId) => {
    const unit = units.value.find(u => u.unit_id === unitId);
    if (unit) {
        const build = builds.value.find(b => b.build_id === unit.build_id);
        return build ? build.build_image_url : '';
    } else {
        const build = builds.value.find(b => b.build_id === unitId);
        return build ? build.build_image_url : '';
    }
};

const getTeamColor = (Id) => {
    var targetId = Id;
    const unit = units.value.find(u => u.unit_id === Id);
    if (unit) {
        targetId = unit.owner_player
    }
    for (let i = 0; i < gameInfo.value.teams.length; i++) {
        const team = gameInfo.value.teams[i];
        if (team.some(player => player.player_id === targetId)) {
            return teamInfo.value.colors[i];
        }
    }
    return 'transparent';
};

const getTeamIcon = (Id) => {
    var targetId = Id;
    const unit = units.value.find(u => u.unit_id === Id);
    if (unit) {
        targetId = unit.owner_player
    }
    for (let i = 0; i < gameInfo.value.teams.length; i++) {
        const team = gameInfo.value.teams[i];
        if (team.some(player => player.player_id === targetId)) {
            return teamInfo.value.icons[i];
        }
    }
    return '';
};

const gridStyle = computed(() => {
    const rows = field.value.length;
    const cols = field.value[0].length;
    return {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '2px'
    };
});

const iconStyle = computed(() => {
    return {
        fontSize: `${iconSize.value}px`
    };
});

const calculateIconSize = () => {
    const cols = field.value[0].length;
    const gridWidth = document.querySelector('.grid-container').offsetWidth;
    const cellWidth = gridWidth / cols;
    iconSize.value = cellWidth * 0.4; // アイコンのサイズをセルの幅の40%に設定
};

onMounted(() => {
    calculateIconSize();
    window.addEventListener('resize', calculateIconSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', calculateIconSize);
});
</script>

<style scoped>
.grid-container {
    width: 100%;
    height: 100%;
    display: grid;
}

.grid-row {
    display: contents;
}

.grid-cell {
    position: relative;
    padding-bottom: 100%;
}

.square-card {
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
}

.v-card-title {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.unit-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.unit-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
}

.icon-overlay {
    position: absolute;
    bottom: 0;
    right: 0;
    opacity: 0.8;
    color: inherit;
}
</style>
