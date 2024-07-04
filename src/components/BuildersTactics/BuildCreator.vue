<template>
  <v-app>
    <v-main>
      <v-container>
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
            <v-btn :disabled="!valid || loading" @click="submit">
              <v-progress-circular v-if="loading" indeterminate size="24" class="mr-2"></v-progress-circular>
              Submit
            </v-btn>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getParts, createBuild } from './BuildersTacticsApi';

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

onMounted(fetchParts);
</script>