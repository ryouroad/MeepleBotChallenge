<template>
    <v-container fluid>
        <div class="grid-container" :style="gridStyle">
            <div v-for="(row, rowIndex) in field" :key="rowIndex" class="grid-row">
                <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="grid-cell">
                    <v-tooltip bottom :open-on-focus=false :open-on-hover=true :open-on-click=true>
                        <template v-slot:activator="{ props }">
                            <v-card v-bind="props" :class="{ 'pa-2': true, 'square-card': true }" @click="selectCell(rowIndex, cellIndex)"
                                :style="{ borderColor: getTeamColor(cell.unit), borderWidth: '2px', borderStyle: 'solid' }">
                                <v-card-title>
                                    <div v-if="cell.unit" class="unit-container">
                                        <v-img :src="getUnitImage(cell.unit)" alt="unit image" :class="{ 'unit-image': true }">
                                            <v-icon :color="getTeamColor(cell.unit)" :style="iconStyle"
                                                class="team-icon-overlay">
                                                {{ getTeamIcon(cell.unit) }}
                                            </v-icon>
                                            <v-icon v-if="!getAttacked(cell.unit)" :color="getTeamColor(cell.unit)"
                                                :style="iconStyle" class="attacked-icon-overlay">
                                                mdi-sword-cross
                                            </v-icon>
                                            <v-icon v-if="!getMoved(cell.unit)" :color="getTeamColor(cell.unit)"
                                                :style="iconStyle" class="moved-icon-overlay">
                                                mdi-shoe-print
                                            </v-icon>
                                        </v-img>
                                    </div>
                                    <div v-if="cell.initial_area && !cell.unit && gameInfo.phase == 'initialize'"
                                        class="unit-container">
                                        <v-icon :color="getTeamColor(cell.initial_area)" :style="iconStyle"
                                            class="team-icon-overlay">
                                            {{ getTeamIcon(cell.initial_area) }}
                                        </v-icon>
                                    </div>
                                </v-card-title>
                                <v-img v-if="canSelect(rowIndex, cellIndex)" :src="highlightImage" class="overlay"></v-img>
                            </v-card>
                        </template>
                        <span>{{ getUnitInfo(cell.unit) }}</span>
                    </v-tooltip>
                </div>
            </div>
        </div>
        <v-dialog v-model="showPartsDialog" persistent max-width="600px">
            <v-card>
                <v-card-text>攻撃パーツを選択</v-card-text>
                <v-list>
                    <v-list-item v-for="part in filteredParts()" :key="part.part_id" @click="selectPart(part)">
                        <v-list-item-content>
                            <strong class="mx-2">{{ part.parts_name }}</strong>
                            <v-icon left class="mx-2">mdi-sword</v-icon>
                            <span class="mx-2">{{ part.full_attack }}</span>
                            <v-icon left class="mx-2">mdi-shield</v-icon>
                            <span class="mx-2">{{ part.defense }}</span>
                            <v-icon left class="mx-2">mdi-flash</v-icon>
                            <span class="mx-2">{{ part.blitz }}</span>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-card-actions>
                    <v-btn color="blue darken-1" text @click="closePartsDialog">キャンセル</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { computed, defineEmits, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';

const emit = defineEmits(['action', 'fetchParts']);

const store = useStore();
const field = computed(() => store.getters['buildersTacticsStore/field']);
const gameInfo = computed(() => store.getters['buildersTacticsStore/gameInfo']);
const builds = computed(() => store.getters['buildersTacticsStore/builds']);
const units = computed(() => store.getters['buildersTacticsStore/units']);
const parts = computed(() => store.getters['buildersTacticsStore/parts']);
const teamInfo = computed(() => store.getters['buildersTacticsStore/teamInfo']);
const selectedBuild = computed(() => store.getters['buildersTacticsStore/selectedBuild']);
const selectedUnit = computed(() => store.getters['buildersTacticsStore/selectedUnit']);
const player_id = computed(() => store.getters['authStore/getName']);
const iconSize = ref(0);
const targetCell = ref(null);
const selectedPart = ref(null);
const showPartsDialog = ref(false);
const highlightImage = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="lightblue"/></svg>')

const selectCell = async(rowIndex, cellIndex) => {
    const newField = JSON.parse(JSON.stringify(field.value));
    if (gameInfo.value.status === 'in_game') {
        const player = gameInfo.value.teams.flat().find(player => player.player_id === player_id.value);
        if (gameInfo.value.phase === 'initialize' && player.agreement === 'agree') {
            if (newField[rowIndex][cellIndex].initial_area == player_id.value && selectedBuild.value) {
                newField[rowIndex][cellIndex].unit = selectedBuild.value.build_id;
                store.dispatch('buildersTacticsStore/setField', newField);
            } else {
                newField[rowIndex][cellIndex].unit = null;
                store.dispatch('buildersTacticsStore/setField', newField);
            }
        } else if (gameInfo.value.phase !== 'initialize' && gameInfo.value.phase_player == player_id.value) {
            if (selectedUnit.value == null || selectedPart.value == null) {
                if (newField[rowIndex][cellIndex].unit != null) {
                    store.dispatch('buildersTacticsStore/setSelectedUnit', newField[rowIndex][cellIndex].unit)
                    const unit = units.value.find(u => u.unit_id === selectedUnit.value);
                    const build = builds.value.find(b => b.build_id === unit.build_id);
                    if (build != selectedBuild.value){
                        store.dispatch('buildersTacticsStore/setSelectedBuild', build)
                        const fetchParts = () => {
                            return new Promise((resolve) => {
                                emit('fetchParts', resolve);
                            });
                        };
                        await fetchParts();
                    }
                    if (gameInfo.value.phase !== 'move' && unit.can_attack) {
                        openPartsDialog(parts.value);
                    } else if (gameInfo.value.phase === 'move' && unit.can_attack && unit.can_move) {
                        const legPart = parts.value.find(part => part.part_type === 'legs');
                        if (legPart) {
                            selectedPart.value = legPart.part_id;
                        }
                    }
                }
            } else if (selectedUnit.value == newField[rowIndex][cellIndex].unit) {
                store.dispatch('buildersTacticsStore/setSelectedUnit', null)
                selectedPart.value = null
            } else {
                if (canSelect(rowIndex, cellIndex)) {
                    targetCell.value = {
                        row: rowIndex,
                        col: cellIndex
                    }
                    emit('action', { phase: gameInfo.value.phase, actionUnit: selectedUnit.value, target_cell: targetCell.value, part_id: selectedPart.value })
                    targetCell.value = null
                }
                store.dispatch('buildersTacticsStore/setSelectedUnit', null)
                selectedPart.value = null
            }
        }
    }
};

const getUnitInfo = (unitId) => {
    const unit = units.value.find(u => u.unit_id === unitId);
    if (unit){
        const build = builds.value.find(b => b.build_id === unit.build_id);
        return "HP:"+unit.hp+"\nCost:"+build.total_cost+"\nPower:"+build.total_power;
    } else if(unitId != null) {
        const build = builds.value.find(b => b.build_id === unitId);
        if (build){
            return "HP:"+build.max_hp+"\nCost:"+build.total_cost+"\nPower:"+build.total_power;
        } else {
            return "No your unit";
        }
    } else {
        return "No your unit";
    }
};

const getUnitImage = (unitId) => {
    const unit = units.value.find(u => u.unit_id === unitId);
    if (unit) {
        if (unit.is_exist){
            const build = builds.value.find(b => b.build_id === unit.build_id);
            return build ? build.build_image_url : '';
        } else {
            return '';
        }
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
        if (!unit.is_exist) return 'transparent';
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
        if (!unit.is_exist) return '';
    }
    for (let i = 0; i < gameInfo.value.teams.length; i++) {
        const team = gameInfo.value.teams[i];
        if (team.some(player => player.player_id === targetId)) {
            return teamInfo.value.icons[i];
        }
    }
    return '';
};

const getAttacked = (Id) => {
    const unit = units.value.find(u => u.unit_id === Id);
    if (unit) {
        if (!unit.is_exist) return false;
        return unit.can_attack;
    }
    if (gameInfo.value.phase == 'initialize') {
        return true;
    } else {
        return false;
    }
};

const getMoved = (Id) => {
    const unit = units.value.find(u => u.unit_id === Id);
    if (unit) {
        if (!unit.is_exist) return false;
        return unit.can_move;
    }
    if (gameInfo.value.phase == 'initialize') {
        return true;
    } else {
        return false;
    }
};

const canSelect = (row, col) => {
    if (selectedUnit.value != null && selectedPart.value != null && gameInfo.value.phase_player == player_id.value) {
        try{
            var unit_row = -1
            var unit_col = -1
            for (let i = 0; i < field.value.length; i++) {
                for (let j = 0; j < field.value[i].length; j++) {
                    if (field.value[i][j].unit === selectedUnit.value) {
                        unit_row = i;
                        unit_col = j;
                        break;
                    }
                }
                if (unit_row !== -1 && unit_col !== -1) break;
            }
            const part = parts.value.find(part => part.part_id == selectedPart.value);
            if (unit_row == -1 || unit_col == -1) {
                return false;
            } else if(part.part_type == 'legs' && gameInfo.value.phase == 'move'){
                let move_type_flag = false;
                const move_y = Math.abs(row - unit_row);
                const move_x = Math.abs(col - unit_col);
                const distance = move_y + move_x;
                const range = part.move_area;
                if(part.move_type == 'cross'){
                    move_type_flag = (move_y == move_x);
                }else if(part.move_type == 'straight'){
                    move_type_flag = (move_y == 0) || (move_x == 0);
                }else if(part.move_type == 'free'){
                    move_type_flag = true;
                }
                return (distance <= range) && move_type_flag;
    
            } else if(part.part_type == 'weapon' && gameInfo.value.phase != 'move') {
                const distance = Math.abs(row - unit_row) + Math.abs(col - unit_col);
                const range = part.attack_area;
                return distance <= range;
            } else {
                return false;
            }
        }catch{
            store.dispatch('buildersTacticsStore/setSelectedUnit', null)
            selectedPart.value = null
            return false;
        }
    } else {
        return false;
    }
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
    iconSize.value = cellWidth * 0.4;
};

const closePartsDialog = () => {
    showPartsDialog.value = false;
};

const openPartsDialog = () => {
    showPartsDialog.value = true;
};

const selectPart = (part) => {
    selectedPart.value = part.part_id;
    showPartsDialog.value = false;
};

const filteredParts = () => {
    const filteredParts = parts.value.filter(part => part.part_type === 'weapon')
    return filteredParts;
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

.team-icon-overlay {
    position: absolute;
    bottom: 0;
    right: 0;
    opacity: 0.8;
    color: inherit;
}

.attacked-icon-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: 0.8;
    color: inherit;
}

.moved-icon-overlay {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.8;
    color: inherit;
}

.overlay {
    opacity: 0.4;
}
</style>
