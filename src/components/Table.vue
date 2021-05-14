<template>
	<div class="flex flex-col">
		<Button class="self-end" @click.native.prevent="columnPickerOpen = true" hover="true">+</Button>
		<div class="overflow-x-auto w-full relative border border-black mb-16">
			<table class="w-full" :class="{'table-fixed': fixed}">
				<thead>
					<tr>
						<th class="capitalize" v-show="header.show" :ref="'header-' + index" :style="header.style" :width="header.width || false" :class="[header.sticky ? 'sticky z-20' : 'relative z-10']" scope="col" v-for="(header, index) in headers" :key="`header-${index}`">
							<button @click="moveColumn(index, index-1)" v-if="index !== 0 && !header.sticky && canMoveLeft(index)" aria-label="Move this column 1 space to the left" class="absolute left-0 top-1 px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
								<i class="fas fa-arrow-left"></i>
							</button>

							<button @click="freezeColumn(header, index)" v-if="!header.sticky && canFreeze(index)" aria-label="Freeze this column so it does not scroll horizontally" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
								<i class="far fa-snowflake"></i>
							</button>

							<button @click="freezeColumn(header, index)" v-else-if="header.sticky && canFreeze(index)" aria-label="Unfreeze this column so it will scroll horizontally" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
								<i class="far fa-fire-alt"></i>
							</button>
							{{header.header}}
							<button @click="moveColumn(index, index+1)" v-if="index !== headers.length - 1 && !header.sticky" aria-label="Move this column 1 space to the right" class="absolute right-0 top-1 px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
								<i class="fas fa-arrow-right"></i>
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr :class="{'selected': selected.includes(data.id)}" tabindex="0" @click="handleClick(data)" v-for="(data, index) in columnData" :key="'row-'+index">
						<td class="whitespace-pre-wrap p-2" :ref="'columnData-'+ subIndex" :class="[headers[subIndex].sticky ? 'sticky z-20' : 'relative z-10']" :style="headers[subIndex].style"  v-show="headers[subIndex].show" :data-key="key" v-for="(value, key, subIndex) in data" :key="'key-'+subIndex">
							<span class="text-left" v-if="key == 'descriptions' || key == 'recommendations'" v-html="value"></span>
							<template v-else>{{displayValue(key, value)}}</template>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<Modal class="z-30" :open="columnPickerOpen">
			<div class="w-full p-3">
				<Button @click.native.prevent="columnPickerOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Button>
				<ul class="flex flex-wrap">
					<li class="flex w-5/12 mx-2 my-2 justify-center items-center" v-for="(header, index) in headers" :key="index">
						<Label :for="'showCol'+ (index+1)">Show {{header.header}}</Label>
						<Checkbox :value="header.show" :id="'showCol'+ (index+1)" @input="showHideColumn(index)"></Checkbox>
						<!-- <Checkbox :id="'showCol'+ (index+1)" @input="showHideColumn(index)" v-model="header.show"></Checkbox> -->
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
			selected: {
				type: Array,
				default: function(){
					return []
				}
			},
			fixed: {
				type: Boolean,
				default: true
			},
			rowsData:{
				type: Array,
				default: function(){
					return []
				}
			},
			headersData: {
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
				columnPickerOpen: false,
				headers: [],
				columnData: []
			}
		},
		methods: {
			showHideColumn( colIndex ){
				this.headers[colIndex].show = !this.headers[colIndex].show

				let allStickied = this.headers.filter( el => el.show && el.sticky )
				for( let i in allStickied ){
					let thisItem = this.headers.find( x => x.header == allStickied[i].header)
					let realIndex =  this.headers.indexOf( thisItem )
					if( parseInt(i) === 0 ){
						this.$set( this.headers[realIndex].style, "left", "0px" )
					}else{
						this.$set(this.headers[realIndex].style, "left", this.getLeftValue(realIndex))
					}
				}
			},
			handleClick(columnData){
				this.$emit('rowClick', columnData)
			},
			displayValue(key, data){
				let plainKeys = ["id", "issue_number", "status", "target", "descriptions", "recommendations", "priority", "effort", "how_discovered", "audit_id", "auditor_notes", "created_at", "updated_at", "created_by"]
				let specialKeys = ["articles", "techniques"]
				if( plainKeys.includes(key) ){
					return data
				}
				if( !plainKeys.includes(key) && !specialKeys.includes(key) ){
					return data.join("\n")
				}
				if( key == "articles" ){
					return this.$parent.articles.filter( a => data.includes(a.id)).map( a=> a.number).join("\n")
				}
				if( key == "techniques" ){
					return this.$parent.techniques.filter( t => data.includes(t.id)).map( t=> t.number).join("\n")
				}
			},
			canMoveLeft(colIndex){
				let nextColLeft = colIndex - 1
				if( nextColLeft < 0 ){
					return false
				}
				while( nextColLeft >= 0 ){
					if( !this.headers[nextColLeft].sticky && this.headers[nextColLeft].show ){
						return true
					}

					nextColLeft--
				}

				return false
			},
			getLeftValue(colIndex){
				let left = 0
				let nextColLeft = colIndex - 1
				while( nextColLeft >= 0 ){
					if( this.headers[nextColLeft].sticky && this.headers[nextColLeft].show ){
						left = parseInt(this.headers[nextColLeft].style.left.replace("px", "")) + parseInt(this.headers[nextColLeft].width.replace("px", ""))
						return left + 'px'
					}
					nextColLeft--
				}
				
				return left + 'px'
			},
			freezeColumn(header, index){
				header.sticky = !header.sticky
				if( index == "0" ){
					return
				}
				
				if( header.sticky ){
					this.$set(header.style, "left", this.getLeftValue(index))
				}else{
					this.$set(header.style, "left", "initial")
				}
			},
			getStickyClasses(){
				return "sticky z-10"
			},
			canFreeze(colIndex){
				let nextColLeft = colIndex - 1
				if( nextColLeft < 0 ){ //Always the first index can freeze
					return true
				}
				while( nextColLeft >= 0 ){
					if( this.headers[nextColLeft].sticky && this.headers[nextColLeft].show ){
						return true
					}
					if( !this.headers[nextColLeft].sticky && this.headers[nextColLeft].show ){
						return false
					}

					nextColLeft--
				}

				return true
			},
			moveColumn(oldIndex, newIndex) {
				if( !this.headers[newIndex].sticky && this.columnData ){
					let arr = JSON.parse(JSON.stringify(this.headers))
					let obToMove = arr.splice(oldIndex, 1)[0]
					arr.splice(newIndex, 0, obToMove)
					this.headers = arr

					for( let row in this.columnData ){
						let keys = Object.keys(this.columnData[row])
						let arrangedProperties = {}
						obToMove = keys.splice( oldIndex, 1 )[0]
						keys.splice(newIndex, 0, obToMove)
						for( let i in keys ){
							arrangedProperties[ keys[i] ] = this.columnData[row][ keys[i] ]
						}

						this.$set( this.columnData, row, arrangedProperties )
					}
				}
			}
		},
		mounted(){
			this.headers = JSON.parse(JSON.stringify(this.headersData))
			this.columnData = JSON.parse(JSON.stringify(this.rowsData))
			let that = this
			
			this.$nextTick(()=>{
				for( let c in that.headers ){
					if( that.headers[c].sticky && c == "0" ){
						that.$set(that.headers[c].style, "left", 0)
					}

					if( that.headers[c].sticky && c != "0" && that.headers[c].show ){
						let col = that.$refs['header-' + (c-1)][0]
						that.$set(that.headers[c].style, "left", col.offsetWidth + 'px')
					}
				}
			})
		},
		watch:{
			rowsData(newVal){
				this.columnData = JSON.parse(JSON.stringify(newVal))
			}
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
	tr{
		transition:transform .2s;
		transform:translateY(0)
	}
	tr.selected {
		transform:translateY(-2px);
	}
	tr.selected td {
		background-color: rgb(235, 140, 47);
	}
  	td, th{
    	background-color:white;
    	border:1px solid black;
		transition:background-color .2s
  	}
  	table{
   		border-collapse:separate;
    	border-spacing:0;
    	min-width:2000px;
    	z-index:1
  	}
</style>