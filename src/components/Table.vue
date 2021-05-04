<template>
	<div>
		<Button @click.native.prevent="columnPickerOpen = true" hover="true">+</Button>
		<div class="overflow-x-auto w-full relative border border-black">
			<table class="w-full">
				<thead>
					<tr>
						<th class="capitalize" v-show="column.show" :ref="'column-' + index" :style="column.style" :width="column.width || false" :class="[column.sticky ? 'sticky z-20' : 'relative z-10']" scope="col" v-for="(column, index) in columns" :key="`header-${index}`">
							<button @click="moveColumn(index, index-1)" v-if="index !== 0 && !column.sticky" aria-label="Move this column 1 space to the left" class="absolute left-0 top-1 px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
								<i class="fas fa-arrow-left"></i>
							</button>

							<button @click="freezeColumn(column, index)" v-if="!column.sticky && canFreeze(index)" aria-label="Freeze this column so it does not scroll horizontally" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
								<i class="far fa-snowflake"></i>
							</button>

							<button @click="freezeColumn(column, index)" v-else-if="column.sticky && canFreeze(index)" aria-label="Un Freeze this column so it will scroll horizontally" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
								<i class="far fa-fire-alt"></i>
							</button>
							{{column.header}}
							<button @click="moveColumn(index, index+1)" v-if="index !== columns.length - 1 && !column.sticky" aria-label="Move this column 1 space to the right" class="absolute right-0 top-1 px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
								<i class="fas fa-arrow-right"></i>
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td v-show="column.show" :style="column.style" :class="[column.sticky ? 'sticky z-20' : 'relative z-10']" v-for="(column, index) in columns" :key="`body-${index}`">{{data[index][column.dataKey]}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<Modal class="z-30" :open="columnPickerOpen">
			<div class="w-full p-3">
				<ul class="flex flex-wrap">
					<li class="flex w-5/12 mx-2 my-2 justify-center items-center" v-for="(column, index) in columns" :key="index">
						<Label :for="'showCol'+ (index+1)">Show {{column.header}}</Label>
						<Checkbox :id="'showCol'+ (index+1)" v-model="column.show"></Checkbox>
					</li>
				</ul>
			</div>
		</Modal>
	</div>
</template>

<script>
	import Modal from "../components/Modal"
	import Button from "../components/Button"
	import Checkbox from "../components/Checkbox"
	export default {
		props:{
			data:{
				type: Array,
				default: function(){
					return []
				}
			},
			columns: {
				type: Array,
				default: function(){
					return [
						{width: "100px", show: true, header: 'Column 1', data: 'This is column 1', sticky: true, style: {}},
						{width: "10%", show: true, header: 'Column 2', data: 'This is column 2', sticky: true, style: {}},
						{width: "200px", show: true, header: 'Column 3', data: 'This is column 3', sticky: false, style: {}},
					]
				}
			}
		},
		data(){
			return {
				columnPickerOpen: false
			}
		},
		methods: {
			getLeftValue(colIndex){
				let elToLeft = this.$refs['column-' + (colIndex-1)][0]
				return elToLeft.offsetWidth + 'px'
			},
			freezeColumn(column, index){
				column.sticky = !column.sticky
				if( index == "0" ){
					return
				}
				
				if( column.sticky ){
					this.$set(column.style, "left", this.getLeftValue(index))
				}else{
					this.$set(column.style, "left", "initial")
				}
			},
			getStickyClasses(){
				return "sticky z-10"
			},
			canFreeze(index){
				if( index == 0 || this.columns[index - 1].sticky ){
					return true
				}
				return false
			},
			moveColumn(oldIndex, newIndex) {
				if( !this.columns[newIndex].sticky ){
					this.columns.splice(newIndex, 0, this.columns.splice(oldIndex, 1)[0])
				}
				
			}
		},
		mounted(){
			let that = this
			
			this.$nextTick(()=>{
				for( let c in that.columns ){
					if( that.columns[c].sticky && c == "0" ){
						that.$set(that.columns[c].style, "left", 0)
					}

					if( that.columns[c].sticky && c != "0" ){
						let col = that.$refs['column-' + (c-1)][0]
						that.$set(that.columns[c].style, "left", col.offsetWidth + 'px')
					}
				}
			})
		},
		computed: {

		},
		components: {
			Modal,
			Button,
			Checkbox
		}
	}
</script>

<style scoped>
  td, th{
    background-color:white;
    border:1px solid black;
  }
  table{
    border-collapse:separate;
    border-spacing:0;
    min-width:2000px;
    z-index:1
  }
</style>