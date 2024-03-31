<template>
    <div id="player-indicator">
      <div v-if="winner">
        勝者: {{ winner }}
      </div>
      <div v-else>
        現在のプレイヤー: {{ currentPlayer }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentPlayer: String,
      winner: String
    }
  };
  </script>
  
  <style>
  #player-indicator {
    margin-bottom: 20px;
  }
  </style>
  