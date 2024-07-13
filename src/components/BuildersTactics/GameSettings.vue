<template>
    <div>
        <h3>ゲーム設定</h3>
        <v-card-text v-if="gameInfo.status !== 'setting'" class="mt-5">
            <v-row class="pt-3">
                <v-col cols="12" md="4">
                <strong>ルール:</strong> {{ gameInfo.setting.rule }}
                </v-col>
                <v-col cols="12" md="4">
                <strong>プレイヤー順:</strong> {{ gameInfo.setting.player_order }}
                </v-col>
                <v-col cols="12" md="4">
                <strong>初期エリア:</strong> {{ gameInfo.setting.initial_area }}
                </v-col>
                <v-col cols="12" md="4">
                <strong>プレイヤー数:</strong> {{ gameInfo.setting.player_number }}
                </v-col>
                <v-col cols="12" md="4">
                <strong>チーム数:</strong> {{ gameInfo.setting.team_number }}
                </v-col>
                <v-col cols="12" md="4">
                <strong>最大ターン数:</strong> {{ gameInfo.setting.max_turn }}
                </v-col>
                <v-col cols="12" md="4">
                <strong>フィールドサイズ:</strong> {{ gameInfo.setting.field_size }}
                </v-col>
                <v-col cols="12" md="4">
                <strong>最大コスト:</strong> {{ gameInfo.setting.max_cost }}
                </v-col>
                <v-col cols="12" md="4">
                <strong>最大ビルド数:</strong> {{ gameInfo.setting.max_build }}
                </v-col>
            </v-row>
        </v-card-text>
        <v-list v-if="gameInfo.status === 'setting'" dense>
            <v-list-item>
                <v-list-item-content>
                    <v-select v-model="gameInfo.setting.rule" :items="['normal']" label="ルール"></v-select>
                    <v-select v-model="gameInfo.setting.player_order" :items="['fix']" label="プレイヤー順"></v-select>
                    <v-select v-model="gameInfo.setting.initial_area" :items="['normal']" label="初期エリア"></v-select>
                    <v-text-field v-model="gameInfo.setting.player_number" label="プレイヤー数" type="number" min="2" max="2"></v-text-field>
                    <v-text-field v-model="gameInfo.setting.team_number" label="チーム数" type="number" min="2" max="2"></v-text-field>
                    <v-text-field v-model="gameInfo.setting.max_turn" label="最大ターン数" type="number" min="1" max="100"></v-text-field>
                    <v-text-field v-model="gameInfo.setting.field_size" label="フィールドサイズ" type="number" min="7" max="20"></v-text-field>
                    <v-text-field v-model="gameInfo.setting.max_cost" label="最大コスト" type="number" min="3" max="1000"></v-text-field>
                    <v-text-field v-model="gameInfo.setting.max_build" label="最大ビルド数" type="number" min="1" max="10"></v-text-field>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-row v-if="gameInfo.status === 'setting'" id="menu-viewer" class="d-flex justify-center" cols="12">
            <v-col cols="12" md="3" class="d-flex justify-center">
                <v-btn @click="fetchSettings" color="primary">ゲーム情報の取得</v-btn>
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-center">
                <v-btn @click="updateSettings" color="primary">ゲーム設定の更新</v-btn>
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-center">
                <v-btn @click="agree" color="primary">ゲーム設定に同意</v-btn>
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-center">
                <v-btn @click="leave" color="primary">ゲームから退出</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { defineEmits, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const gameInfo = computed(() => store.getters['buildersTacticsStore/gameInfo']);

const emit = defineEmits(['fetch', 'update', 'agree', 'leave']);

const fetchSettings = () => {
    emit('fetch');
};

const updateSettings = () => {
    emit('update', gameInfo.value.setting);
};

const agree = () => {
    emit('agree');
};

const leave = () => {
    emit('leave');
};
</script>
