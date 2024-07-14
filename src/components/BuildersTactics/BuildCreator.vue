<template>
  <v-app>
    <v-main>
      <v-container v-if="!pageLoading">
        <v-card>
          <v-card-title>Create a New Build</v-card-title>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="newBuild.build_name" :rules="nameRules" label="Build Name" required></v-text-field>
            <v-select v-model="newBuild.head_id" :items="filteredParts('head')" item-title="parts_name"
              item-value="part_id" label="Select Head"></v-select>
            <v-select v-model="newBuild.core_id" :items="filteredParts('core')" item-title="parts_name"
              item-value="part_id" label="Select Core"></v-select>
            <v-select v-model="newBuild.leg_id" :items="filteredParts('legs')" item-title="parts_name"
              item-value="part_id" label="Select Leg"></v-select>
            <v-select v-model="newBuild.option_parts" :items="filteredParts('weapon')" item-title="parts_name"
              item-value="part_id" label="Select Option Parts" multiple></v-select>
            <v-btn :disabled="!valid || loading || costOver || powerOver || optionPartsOver" @click="submit"
              color="primary">
              <v-progress-circular v-if="loading" indeterminate size="24" class="mr-2"></v-progress-circular>
              Submit
              <v-tooltip bottom :activator="parent">
                <span>Build is valid!</span>
              </v-tooltip>
            </v-btn>
          </v-form>
        </v-card>
      </v-container>
      <v-card v-if="!pageLoading">
        <v-card-title>Build Summary</v-card-title>
        <v-card-subtitle>HP: {{ maxHP }}</v-card-subtitle>
        <v-card-subtitle v-if="legParts" :class="{ 'red-text': costOver }">
          Cost: {{ totalCost }} / {{ legParts.max_cost }}
        </v-card-subtitle>
        <v-card-subtitle v-if="coreParts" :class="{ 'red-text': powerOver }">
          Power: {{ totalPower }} / {{ coreParts.max_power }}
        </v-card-subtitle>
        <v-card-subtitle v-if="coreParts" :class="{ 'red-text': optionPartsOver }">
          OptionParts: {{ optionParts.length }} / {{ coreParts.option_parts_number }}
        </v-card-subtitle>
        <v-divider class="my-4"></v-divider>
        <v-card-title>Parts</v-card-title>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-card v-if="headParts">
              <v-card-title>{{ headParts.parts_name }}</v-card-title>
              <v-card-subtitle>Type: {{ headParts.part_type }}</v-card-subtitle>
              <v-card-subtitle>Power: {{ headParts.power }}</v-card-subtitle>
              <v-card-subtitle>Cost: {{ headParts.cost }}</v-card-subtitle>
              <v-card-subtitle>HP: {{ headParts.hp }}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card v-if="coreParts">
              <v-card-title>{{ coreParts.parts_name }}</v-card-title>
              <v-card-subtitle>Type: {{ coreParts.part_type }}</v-card-subtitle>
              <v-card-subtitle>Power: {{ coreParts.power }}</v-card-subtitle>
              <v-card-subtitle>Cost: {{ coreParts.cost }}</v-card-subtitle>
              <v-card-subtitle>HP: {{ coreParts.hp }}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card v-if="legParts">
              <v-card-title>{{ legParts.parts_name }}</v-card-title>
              <v-card-subtitle>Type: {{ legParts.part_type }}</v-card-subtitle>
              <v-card-subtitle>Power: {{ legParts.power }}</v-card-subtitle>
              <v-card-subtitle>Cost: {{ legParts.cost }}</v-card-subtitle>
              <v-card-subtitle>HP: {{ legParts.hp }}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col v-for="part in optionParts" :key="part.part_id" cols="12" md="4">
            <v-card>
              <v-card-title>{{ part.parts_name }}</v-card-title>
              <v-card-subtitle>Type: {{ part.part_type }}</v-card-subtitle>
              <v-card-subtitle>Power: {{ part.power }}</v-card-subtitle>
              <v-card-subtitle>Cost: {{ part.cost }}</v-card-subtitle>
              <v-card-subtitle>HP: {{ part.hp }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getParts, createBuild } from './BuildersTacticsApi';

const pageLoading = ref(true);
const newBuild = ref({
  build_name: '',
  head_id: '',
  core_id: '',
  leg_id: '',
  option_parts: []
});
const parts = ref([]);
const valid = ref(false);
const loading = ref(false);
const headParts = computed(() => {
  return parts.value.find(part => part.part_id === newBuild.value.head_id) || null;
});
const coreParts = computed(() => {
  return parts.value.find(part => part.part_id === newBuild.value.core_id) || null;
});
const legParts = computed(() => {
  return parts.value.find(part => part.part_id === newBuild.value.leg_id) || null;
});
const optionParts = computed(() => {
  return newBuild.value.option_parts.map(option_id => parts.value.find(part => part.part_id === option_id)).filter(part => part !== undefined);
});
const costOver = computed(() => {
  return legParts.value ? totalCost.value > legParts.value.max_cost : true;
});
const totalCost = computed(() => {
  let costSum = 0;
  costSum += headParts.value?.cost || 0;
  costSum += coreParts.value?.cost || 0;
  costSum += legParts.value?.cost || 0;
  if (optionParts.value.length > 0) {
    costSum += optionParts.value.reduce((total, option) => total + option.cost, 0);
  }
  return costSum;
});
const powerOver = computed(() => {
  return coreParts.value ? totalPower.value > coreParts.value.max_power : true;
});
const totalPower = computed(() => {
  let powerSum = 0;
  powerSum += headParts.value?.power || 0;
  powerSum += coreParts.value?.power || 0;
  powerSum += legParts.value?.power || 0;
  if (optionParts.value.length > 0) {
    powerSum += optionParts.value.reduce((total, option) => total + option.power, 0);
  }
  return powerSum;
});
const optionPartsOver = computed(() => {
  return coreParts.value ? optionParts.value.length > coreParts.value.option_parts_number : true;
});
const maxHP = computed(() => {
  let hpSum = 0;
  hpSum += headParts.value?.hp || 0;
  hpSum += coreParts.value?.hp || 0;
  hpSum += legParts.value?.hp || 0;
  if (optionParts.value.length > 0) {
    hpSum += optionParts.value.reduce((total, option) => total + option.hp, 0);
  }
  return hpSum;
});

const nameRules = [
  v => !!v || 'Name is required',
  v => (v && v.length <= 10) || 'Name must be less than 10 characters'
];

const fetchParts = async () => {
  try {
    const data = await getParts();
    parts.value = data.parts;
  } catch (error) {
    console.error('Failed to fetch parts:', error);
  }
};

const filteredParts = (type) => {
  return parts.value.filter(part => part.part_type === type);
};

const submit = async () => {
  if (valid.value) {
    loading.value = true;
    try {
      await createBuild(newBuild.value);
      alert('Build created successfully!');
      newBuild.value = {
        build_name: '',
        head_id: '',
        core_id: '',
        leg_id: '',
        option_parts: []
      };
    } catch (error) {
      console.error('Failed to create build:', error);
    } finally {
      loading.value = false;
    }
  }
};

onMounted(() => {
  fetchParts().finally(() => {
    pageLoading.value = false;
  });
});
</script>

<style scoped>
.red-text {
  color: red !important;
  font-weight: bold;
}
</style>