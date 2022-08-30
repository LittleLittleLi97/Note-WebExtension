<template>
    <div
        @mouseenter="enter" 
        @mouseleave="leave" 
        @mousemove="move">
        鼠标触碰元素
    </div>
 
 
<div v-show="popUpShow" class="hover_con" :style="positionStyle">
悬浮框
</div>
</template>

<script>
export default {
    name: '',
    data() {
      return {
        popUpShow:false,
        
        positionStyle:{top:'0px',left:'0px'}
      }
    },
    methods: {
      enter() {
        this.popUpShow = true
      },
      leave() {
        this.popUpShow = false
      },
      move(event) {
        const x = event.pageX + 15 + 'px'
        const y = event.pageY + 10 + 'px'
        this.positionStyle = { top: y, left: x }  
      }
    }
}
</script>

<style>
.hover_con{
    position: fixed;
    max-width: 220px;
    padding: 10px;
    border: 1px solid #666;
    background: #ccc;
}
</style>
