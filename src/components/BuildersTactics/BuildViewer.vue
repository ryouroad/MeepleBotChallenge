<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { getBuilds, getPart } from './BuildersTacticsApi';

const store = useStore();
const selectedBuild = computed(() => store.getters['buildersTacticsStore/selectedBuild']);
const builds = ref([]);
const parts = ref([]);

const fetchBuilds = async () => {
  try {
    const data = await getBuilds();
    builds.value = data.builds;
  } catch (error) {
    console.error('Failed to fetch builds:', error);
  }
};

const fetchPartsDetails = async (partsIds) => {
  try {
    const partsDetails = await Promise.all(partsIds.map(partId => getPart(partId)));
    parts.value = partsDetails.map(response => response);
  } catch (error) {
    console.error('Failed to fetch parts details:', error);
  }
};

const selectBuild = async (build) => {
  store.dispatch("buildersTacticsStore/setSelectedBuild", build);
  await fetchPartsDetails([
    build.head_id,
    build.core_id,
    build.leg_id,
    ...build.option_parts
  ]);
};

const goBack = () => {
  store.dispatch("buildersTacticsStore/setSelectedBuild", null);
  parts.value = [];
};

onMounted(async () => {
  await fetchBuilds();
  if(selectedBuild.value){
    await selectBuild(selectedBuild.value);
  }
});
</script>

<template>
  <v-container>
    <div v-if="selectedBuild">
      <v-btn @click="goBack" color="primary">Back to Builds List</v-btn>
      <v-card>
        <v-img :src="selectedBuild.build_image_url" :alt="selectedBuild.build_name" contain></v-img>
        <v-card-title>{{ selectedBuild.build_name }} Details</v-card-title>
        <v-card-subtitle>HP: {{ selectedBuild.max_hp }}</v-card-subtitle>
        <v-card-subtitle>Power: {{ selectedBuild.total_power }}</v-card-subtitle>
        <v-card-subtitle>Cost: {{ selectedBuild.total_cost }}</v-card-subtitle>
        <v-divider class="my-4"></v-divider>
        <v-card-title>Parts</v-card-title>
        <v-row dense>
          <v-col v-for="part in parts" :key="part.part_id" cols="12" md="6">
            <v-card>
              <v-card-title>{{ part.parts_name }}</v-card-title>
              <v-card-subtitle>Type: {{ part.part_type }}</v-card-subtitle>
              <v-card-subtitle>Power: {{ part.power }}</v-card-subtitle>
              <v-card-subtitle>Cost: {{ part.cost }}</v-card-subtitle>
              <v-card-subtitle>HP: {{ part.hp }}</v-card-subtitle>
              <v-card-subtitle v-if="part.attack_area">Attack range: {{ part.attack_area }}</v-card-subtitle>
              <v-card-subtitle v-if="part.full_attack">Full attack: {{ part.full_attack }}</v-card-subtitle>
              <v-card-subtitle v-if="part.defense">Defense: {{ part.defense }}</v-card-subtitle>
              <v-card-subtitle v-if="part.blitz">Blitz: {{ part.blitz }}</v-card-subtitle>
              <v-card-subtitle v-if="part.max_power">Max power: {{ part.max_power }}</v-card-subtitle>
              <v-card-subtitle v-if="part.option_parts_number">Max option parts number: {{ part.option_parts_number }}</v-card-subtitle>
              <v-card-subtitle v-if="part.max_cost">Max cost: {{ part.max_cost }}</v-card-subtitle>
              <v-card-subtitle v-if="part.move_area">Move range: {{ part.move_area }}</v-card-subtitle>
              <v-card-subtitle v-if="part.move_type">Move type: {{ part.move_type }}</v-card-subtitle>
              <v-card-subtitle v-if="part.search_area">Search range: {{ part.search_area }}</v-card-subtitle>
              <v-card-subtitle v-if="part.search_level">Search level: {{ part.search_level }}</v-card-subtitle>
              <v-card-subtitle v-if="part.search_type">Search type: {{ part.search_type }}</v-card-subtitle>
              <v-card-subtitle v-if="part.sound">Sound: {{ part.sound }}</v-card-subtitle>
              <v-card-subtitle v-if="part.sound_type">Sound type: {{ part.sound_type }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <div v-else>
      <div v-if="builds.length > 0">
        <v-typography variant="h4">Builds</v-typography>
        <div class="builds-container">
          <div v-for="build in builds" :key="build.build_id" @click="selectBuild(build)" class="build-card">
            <v-card>
              <v-img :src="build.build_image_url" :alt="build.build_name" contain></v-img>
              <v-card-title class="small_font">{{ build.build_name }}</v-card-title>
              <v-card-subtitle>HP: {{ build.max_hp }}</v-card-subtitle>
              <v-card-subtitle>Power: {{ build.total_power }}</v-card-subtitle>
              <v-card-subtitle>Cost: {{ build.total_cost }}</v-card-subtitle>
            </v-card>
          </div>
        </div>
      </div>
      <div v-else>
        <v-typography>No builds available.</v-typography>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.builds-container {
  display: flex;
  overflow-x: scroll;
  gap: 16px;
  padding-bottom: 16px;
  white-space: nowrap;
  scrollbar-width: thin;
}

.small_font {
  font-size: 16px;
}

.build-card {
  display: inline-block;
  cursor: pointer;
  flex: 0 0 auto;
  width: 120px;
}

.build-image {
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
}
</style>
