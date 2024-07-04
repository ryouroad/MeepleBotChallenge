<template>
    <v-container>
        <v-row v-for="(row, rowIndex) in field" :key="rowIndex">
            <v-col v-for="(cell, cellIndex) in row" :key="cellIndex">
                <v-card 
                    class="pa-2" 
                    @click="selectCell(rowIndex, cellIndex)"
                    :style="{ borderColor: getTeamColor(cell.unit), borderWidth: '2px', borderStyle: 'solid' }"
                >
                    <v-card-title>
                        <div v-if="cell.unit" class="unit-container">
                            <v-img :src="getUnitImage(cell.unit)" alt="unit image" class="unit-image">
                                <v-icon :color="getTeamColor(cell.unit)" class="icon-overlay">
                                    {{ getTeamIcon(cell.unit) }}
                                </v-icon>
                            </v-img>
                        </div>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed, defineEmits } from 'vue';
import { useStore } from 'vuex';

const emit = defineEmits(['fetchUnitInfo']);

const store = useStore();
const field = computed(() => store.getters['buildersTacticsStore/field']);
const gameInfo = computed(() => store.getters['buildersTacticsStore/gameInfo']);
const builds = computed(() => store.getters['buildersTacticsStore/builds']);
const units = computed(() => store.getters['buildersTacticsStore/units']);
const teamInfo = computed(() => store.getters['buildersTacticsStore/teamInfo']);
const selectedBuild = computed(() => store.getters['buildersTacticsStore/selectedBuild']);


const selectCell = (rowIndex, cellIndex) => {
    const newField = JSON.parse(JSON.stringify(field.value));
    if(gameInfo.value.phase === 'initialize'){
        newField[rowIndex][cellIndex].unit = selectedBuild.value.build_id;
        store.dispatch('buildersTacticsStore/setField', newField);
    }else{
        emit('fetchUnitInfo', field.value[rowIndex][cellIndex].unit);
    }
};

const getUnitImage = (unitId) => {
    const unit = units.value.find(u => u.unit_id === unitId);
    if(unit){
        const build = builds.value.find(b => b.build_id === unit.build_id);
        return build ? build.build_image_url : '';
    }else{
        const build = builds.value.find(b => b.build_id === unitId);
        return build ? build.build_image_url : '';
    }
};

const getTeamColor = (unitId) => {
    const unit = units.value.find(u => u.unit_id === unitId);
    if (unit) {
        for (let i = 0; i < gameInfo.value.teams.length; i++) {
            const team = gameInfo.value.teams[i];
            if (team.some(player => player.player_id === unit.owner_player)) {
                return teamInfo.value.colors[i];
            }
        }
    }
    return 'transparent';
};

const getTeamIcon = (unitId) => {
    const unit = units.value.find(u => u.unit_id === unitId);
    if (unit) {
        for (let i = 0; i < gameInfo.value.teams.length; i++) {
            const team = gameInfo.value.teams[i];
            if (team.some(player => player.player_id === unit.owner_player)) {
                return teamInfo.value.icons[i];
            }
        }
    }
    return '';
};
</script>

<style scoped>
.v-col {
    padding: 4px;
}

.v-card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    position: relative;
}

.v-card-title {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.unit-container {
    position: relative;
    width: 40px;
    height: 40px;
}

@media (max-width: 600px) {
    .unit-container {
        width: 30px;
        height: 30px;
    }
}

@media (max-width: 900px) {
    .unit-container {
        width: 40px;
        height: 40px;
    }
}

@media (max-width: 1200px) {
    .unit-container {
        width: 50px;
        height: 50px;
    }
}

@media (min-width: 1201px) {
    .unit-container {
        width: 60px;
        height: 60px;
    }
}


.unit-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
}

@media (max-width: 600px) {
    .unit-image {
        width: 30px;
        height: 30px;
    }
}

@media (max-width: 900px) {
    .unit-image {
        width: 40px;
        height: 40px;
    }
}

@media (max-width: 1200px) {
    .unit-image {
        width: 50px;
        height: 50px;
    }
}

@media (min-width: 1201px) {
    .unit-image {
        width: 60px;
        height: 60px;
    }
}


.icon-overlay {
    position: absolute;
    bottom: 0;
    right: 0;
    opacity: 0.8;
    font-size: 20px;
    color: inherit;
}
</style>
