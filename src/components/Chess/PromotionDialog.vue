<template>
    <div class="promotion-dialog">
        <p>他の操作をする前に、ポーンからプロモーションする駒を選択してください。</p>
        <div class="promotion-option" @click="select('Queen')">クイーン</div>
        <div class="promotion-option" @click="select('Rook')">ルーク</div>
        <div class="promotion-option" @click="select('Bishop')">ビショップ</div>
        <div class="promotion-option" @click="select('Knight')">ナイト</div>
    </div>
</template>

<script>
export default {
    name: 'PromotionDialog',
    methods: {
        select(pieceType) {
            // console.log('select:'+pieceType);
            this.$emit('select', { pieceType });
        }
    }
}
</script>

<style scoped>
.promotion-option {
    /* スタイル設定 */
    cursor: pointer;
}
</style>
  