<template>
    <div id="player-indicator">
      <div v-if="winner === 'Draw'">引き分け</div>
      <div v-else-if="winner === 'White'">白の勝ち</div>
      <div v-else-if="winner === 'Black'">黒の勝ち</div>
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
  