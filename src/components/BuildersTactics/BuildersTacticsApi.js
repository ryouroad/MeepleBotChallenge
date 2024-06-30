import axios from 'axios';
import store from '@/store'; // Vuex store のインポート

const API_KEY = process.env.VUE_APP_API_KEY;
const SERVER_URL = process.env.VUE_APP_SERVER_URL;

const apiClient = axios.create({
  baseURL: SERVER_URL+"buildersTactics",
  headers: {
    'x-api-key': API_KEY,
  },
});

// リクエストインターセプターでAuthorizationヘッダーを追加
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getters['authStore/getIdToken'];
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ゲーム作成
export const createGame = async () => {
  try {
    const response = await apiClient.post('/games');
    return response.data;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

// ゲーム一覧取得
export const getGames = async () => {
  try {
    const response = await apiClient.get('/games');
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

// プレイヤー参加、チーム変更
export const joinGame = async (gameId) => {
  try {
    const response = await apiClient.post(`/games/${gameId}`, {});
    return response.data;
  } catch (error) {
    console.error(`Error joining game ${gameId}:`, error);
    throw error;
  }
};

// プレイヤー退出
export const leaveGame = async (gameId, playerId) => {
  try {
    const response = await apiClient.delete(`/games/${gameId}/${playerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error leaving game ${gameId} for player ${playerId}:`, error);
    throw error;
  }
};

// プレイヤー別ゲーム取得
export const getPlayerGame = async (gameId, playerId) => {
  try {
    const response = await apiClient.get(`/games/${gameId}/${playerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching game ${gameId} for player ${playerId}:`, error);
    throw error;
  }
};

// ゲーム設定取得
export const getGameSetting = async (gameId) => {
  try {
    const response = await apiClient.get(`/games/${gameId}/setting`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching game setting for game ${gameId}:`, error);
    throw error;
  }
};

// ゲーム設定更新
export const updateGameSetting = async (gameId, settings) => {
  try {
    const response = await apiClient.post(`/games/${gameId}/setting`, settings);
    return response.data;
  } catch (error) {
    console.error(`Error updating game setting for game ${gameId}:`, error);
    throw error;
  }
};

// ゲーム進行
export const proceedGame = async (gameId, status) => {
  try {
    const response = await apiClient.post(`/games/${gameId}/status`, status);
    return response.data;
  } catch (error) {
    console.error(`Error proceeding game status for game ${gameId}:`, error);
    throw error;
  }
};

// フェイズ進行
export const proceedPhase = async (gameId, phase) => {
  try {
    const response = await apiClient.post(`/games/${gameId}/phase`, { phase });
    return response.data;
  } catch (error) {
    console.error(`Error proceeding phase for game ${gameId}:`, error);
    throw error;
  }
};

// ユニット配置
export const placeUnit = async (gameId, units) => {
  try {
    const response = await apiClient.post(`/games/${gameId}/units`, units);
    return response.data;
  } catch (error) {
    console.error(`Error placing units for game ${gameId}:`, error);
    throw error;
  }
};

// ユニット情報取得
export const getUnitInfo = async (gameId, unitId) => {
  try {
    const response = await apiClient.get(`/games/${gameId}/units/${unitId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching unit info for unit ${unitId} in game ${gameId}:`, error);
    throw error;
  }
};

// ムーブ
export const moveUnit = async (gameId, unitId, newPosition) => {
  try {
    const response = await apiClient.post(`/games/${gameId}/units/${unitId}/move`, { new_position: newPosition });
    return response.data;
  } catch (error) {
    console.error(`Error moving unit ${unitId} in game ${gameId}:`, error);
    throw error;
  }
};

// アタック
export const attack = async (gameId, unitId, attackDetails) => {
  try {
    const response = await apiClient.post(`/games/${gameId}/units/${unitId}/attack`, attackDetails);
    return response.data;
  } catch (error) {
    console.error(`Error attacking with unit ${unitId} in game ${gameId}:`, error);
    throw error;
  }
};

// ビルド一覧取得
export const getBuilds = async () => {
  try {
    const response = await apiClient.get('/builds');
    return response.data;
  } catch (error) {
    console.error('Error fetching builds:', error);
    throw error;
  }
};

// ビルド登録
export const createBuild = async (build) => {
  try {
    const response = await apiClient.post('/builds', build);
    return response.data;
  } catch (error) {
    console.error('Error creating build:', error);
    throw error;
  }
};

// ビルド取得
export const getBuild = async (buildId) => {
  try {
    const response = await apiClient.get(`/builds/${buildId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching build ${buildId}:`, error);
    throw error;
  }
};

// パーツ情報取得
export const getParts = async () => {
  try {
    const response = await apiClient.get('/parts');
    return response.data;
  } catch (error) {
    console.error('Error fetching parts:', error);
    throw error;
  }
};

// パーツ情報取得
export const getPart = async (partId) => {
  try {
    const response = await apiClient.get(`/parts/${partId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching part ${partId}:`, error);
    throw error;
  }
};
