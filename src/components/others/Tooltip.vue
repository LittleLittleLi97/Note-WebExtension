<template>
  	<div v-show="tooltipShow" class="hover_con" :style="positionStyle">{{tooltipText}}</div>
</template>

<script>
export default {
    name: 'Tooltip',
	// props: {
	// 	tooltipShow: Boolean,
	// 	tooltipText: String
	// },
    data() {
      return {
        tooltipShow: false,
        tooltipText: '',
        positionStyle: {top:'0px',left:'0px'}
      }
    },
    methods: {
      enter(str) {
        this.tooltipShow = true
		this.tooltipText = str
      },
      leave() {
        this.tooltipShow = false
      },
      move(event) {
        const x = this.event.pageX + 15 + 'px'
        const y = this.event.pageY + 10 + 'px'
        this.positionStyle = { top: y, left: x }  
      }
    }
}
</script>

<style scoped lang="less">
.hover_con{
    position: fixed;
    max-width: 220px;
    padding: 10px;
    border: 1px solid #666;
    background: #ccc;
}
</style>
