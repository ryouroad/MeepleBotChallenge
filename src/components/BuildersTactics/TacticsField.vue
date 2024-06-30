<template>
    <v-container>
        <v-row v-for="(row, rowIndex) in field" :key="rowIndex">
            <v-col v-for="(cell, cellIndex) in row" :key="cellIndex" cols="1">
                <v-card class="pa-2" @click="selectCell(rowIndex, cellIndex)">
                    <span>{{ cell }}</span>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
    selectedUnit: {
        type: String,
        required: true
    }
});

const store = useStore();

// Vuexストアのフィールド状態を取得
const field = computed(() => store.getters['buildersTacticsStore/field']);

// セルを選択した際にユニットIDを配置し、フィールドを更新
const selectCell = (rowIndex, cellIndex) => {
    const newField = JSON.parse(JSON.stringify(field.value));
    console.error(props.selectedUnit)
    newField[rowIndex][cellIndex].unit = props.selectedUnit.build_id;
    store.dispatch('buildersTacticsStore/setField', newField);
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
    height: 50px;
}
</style>
