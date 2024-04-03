<!-- Cell.vue -->
<template>
  <div class="cell">
    <div v-if="state === 'black'" class="disk black"></div>
    <div v-if="state === 'white'" class="disk white"></div>
  </div>
</template>

<script>
export default {
  props: ['state'],
}
</script>

<style scoped>
.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #008000;
  border: 1px solid #000;
  box-sizing: border-box; 
}

.disk {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.black {
  background-color: #000;
}

.white {
  background-color: #fff;
}
</style>