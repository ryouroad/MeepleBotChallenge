import axios from 'axios';
import store from '@/store'; // Vuex store のインポート

const API_KEY = process.env.VUE_APP_API_KEY;
const SERVER_URL = process.env.VUE_APP_SERVER_URL;

const apiClient = axios.create({
  baseURL: SERVER_URL+"buildersTactics",
  headers: {
    'x-api-key': API_KEY
  }
});

// リクエストインターセプターでAuthorizationヘッダーを追加
apiClient.interceptors.request.use(config => {
  const token = store.getters['authStore/getIdToken'];
  if (token) {
    config.headers['Authorization'] = `${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const getBuilds = async () => {
  try {
    const response = await apiClient.get('/builds');
    return response.data;
  } catch (error) {
    console.error('Error fetching builds:', error);
    throw error;
  }
};

export const postBuild = async (build) => {
  try {
    const response = await apiClient.post('/builds', build);
    return response.data;
  } catch (error) {
    console.error(`Error creating build:`, error);
    throw error;
  }
};

export const getBuild = async (buildId) => {
  try {
    const response = await apiClient.get(`/builds/${buildId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching build ${buildId}:`, error);
    throw error;
  }
};

export const getParts = async () => {
  try {
    const response = await apiClient.get(`/parts`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching parts`, error);
    throw error;
  }
};

export const getPart = async (partId) => {
  try {
    const response = await apiClient.get(`/parts/${partId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching part ${partId}:`, error);
    throw error;
  }
};
