<template>
	<div class="flex flex-col relative">
		<span class="absolute left-0 top-0 bold" v-if="$parent.selectedRows.length">Selected: {{$parent.selectedRows.length}}</span>
		<div class="flex w-full justify-end mb-2">
			<div class="flex flex-wrap w-1/2 pr-52 items-end">
				<h2 class="w-full text-base">
					<div class="text-2xl">Search</div>
					<small>First choose which column you want to search from the dropdown, then enter your search criteria, then click submit</small>
				</h2>
				<div class="w-full flex justify-start">
					<Label for="case-sensitive">Case Sensitive</Label>
					<Checkbox v-model="search.caseSensitive" id="case-sensitive"></Checkbox>
				</div>
				<div class="flex flex-col flex-1 mr-1">
					<Label for="search-column">Search column</Label>
					<select v-model="search.column" id="search-column" name="search-column" class="flex-1">
						<option v-for=" (column, index) in headers.filter( h=>h.show ) " :value="column.header" :key="'search-columns-'+index">{{column.header}}</option>
					</select>
				</div>
				<div class="flex flex-col flex-1 mx-1">
					<Label for="search-term">Search criteria</Label>
					<TextInput style="max-height:39px;" v-model="search.term" name="search-criteria" id="search-criteria" class="flex-1"></TextInput>
				</div>
				<Button style="margin-bottom:5px" class="ml-1" @click.native.prevent="submitTableSearch" :hover="true" color="orange">Submit</Button>
			</div>
			<Button aria-label="Show or hide columns" class="self-end" @click.native.prevent="columnPickerOpen = true" hover="true">+</Button>
		</div>
		<div class="overflow-x-auto w-full relative border border-black mb-16">
			<table class="w-full" :class="{'table-fixed': fixed}">
				<thead>
					<tr>
						<th class="capitalize pt-5" v-show="header.show" :ref="'header-' + index" :style="header.style" :width="header.width || false" :class="[header.sticky ? 'sticky z-20' : 'relative z-10']" scope="col" v-for="(header, index) in headers" :key="`header-${index}`">
							<div class="flex absolute top-1 justify-between w-full">
								<button @click="moveColumn(index, index-1)" :class="[index !== 0 && !header.sticky && canMoveLeft(index) ? 'visible' : 'invisible']" aria-label="Move this column 1 space to the left" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
									<i class="fas fa-arrow-left"></i>
								</button>

								<div class="flex">
									<button @click="freezeColumn(header, index)" v-if="!header.sticky && canFreeze(index)" aria-label="Freeze this column so it does not scroll horizontally" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
										<i class="far fa-snowflake"></i>
									</button>

									<button @click="freezeColumn(header, index)" v-else-if="header.sticky && canFreeze(index)" aria-label="Unfreeze this column so it will scroll horizontally" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
										<i class="far fa-fire-alt"></i>
									</button>

									<button 
										@click="sort(header.header)" 
										v-if="!sortData.columns.includes(header.header)" 
										:aria-label="`Currently unsorted. Click to sort column ${header.header} by ascending`" 
										class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
										<i class="fas fa-sort"></i>
									</button>
									<button 
										@click="sort(header.header)" 
										v-if="sortData.columns.includes(header.header) && sortData.orders[ sortData.columns.indexOf(header.header) ] == 'asc'"
										:aria-label="`Currently sorted by ascending. Click to sort column ${header.header} descending`" 
										class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
										<i class="fas fa-sort-up"></i>
									</button>
									<button 
										@click="sort(header.header)"
										v-if="sortData.columns.includes(header.header) && sortData.orders[ sortData.columns.indexOf(header.header) ] == 'desc'"
										:aria-label="`Currently sorted by descending. Click to remove sorting for ${header.header} column`" 
										class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
										<i class="fas fa-sort-down"></i>
									</button>
								</div>
								
								<button @click="moveColumn(index, index+1)" :class="[index !== headers.length - 1 && !header.sticky ? 'visible' : 'invisible']" aria-label="Move this column 1 space to the right" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
									<i class="fas fa-arrow-right"></i>
								</button>
							</div>
							{{header.header}}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr :class="rowClasses(data)" tabindex="0" @click="handleClick(data)" v-for="(data, index) in rows" :key="'row-'+index">
						<td class="whitespace-pre-wrap p-2" :ref="'columnData-'+ subIndex" :class="[headers[subIndex].sticky ? 'sticky z-20' : 'relative z-10', listKeys.includes(key) ? 'pl-5' : '']" :style="headers[subIndex].style"  v-show="headers[subIndex].show" :data-key="key" v-for="(value, key, subIndex) in data" :key="'key-'+subIndex">
							<span class="text-left" v-if="listKeys.includes(key)" v-html="displayValue(key, value)"></span>
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
	import Label from "../components/Label"
	import TextInput from "../components/TextInput"
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
				sortData: {
					columns: [], //click once: add to columns, click twice: check if in columns, if so, add desc. Click third: remove from column
					orders: []
				},
				columnPickerOpen: false,
				headers: [],
				columnData: [],
				listKeys: ['descriptions', 'recommendations', 'articles', 'techniques', 'pages', 'levels', 'audit_states', 'essential_functionality'],
				filteredRows: [],
				filtering: false,
				search: {
					term: "",
					column: null,
					caseSensitive: false
				}
			}
		},
		computed: {
			rows(){
				if( this.filtering ){
					return this.filteredRows
				}

				return this.columnData
			},
		},
		methods: {
			sort( column ){
				let index = this.sortData.columns.indexOf(column)
				
				if( index < 0 ){ //If sort.columns does not currently have this column
					this.sortData.columns.push(column)
					this.sortData.orders.push("asc")
				} else if( index >= 0 && this.sortData.orders[index] == 'asc' ){ //If sort.columns currently has this column
					this.sortData.orders[index] = 'desc'
				} else {
					this.sortData.columns.splice(index, 1)
					this.sortData.orders.splice(index, 1)
				}

				this.filteredRows = this._.orderBy(this.filteredRows, this.sortData.columns, this.sortData.orders)
				this.columnData = this._.orderBy(this.columnData, this.sortData.columns, this.sortData.orders)
			},
			submitTableSearch(){
				if( this.search.term ){
					this.filtering = true
					let self = this
					this.filteredRows = this.columnData.filter( c => {
						let column = self.search.column.replaceAll(/[ ]/g, "_")
						
						if( Array.isArray(c[column]) ){
							if( !self.search.caseSensitive ){
								return c[column].join("").toLowerCase().includes(self.search.term)
							}
							return c[column].join("").includes(self.search.term)
						}else{
							if( !self.search.caseSensitive ){
								return c[column].toLowerCase().includes(self.search.term)
							}
							return c[column].includes(self.search.term)
						}
					})
				}else{
					this.filtering = false
					this.filteredRows = []
				}
			},
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
				let plainKeys = ["id", "issue_number", "descriptions", "recommendations", "status", "target", "priority", "effort", "how_discovered", "audit_id", "auditor_notes", "created_at", "updated_at", "created_by"]
				let specialKeys = ["articles", "techniques"]
				if( plainKeys.includes(key) ){
					return data
				}
				if( !plainKeys.includes(key) && !specialKeys.includes(key) ){
					let output = "<ul><li class='list-disc'>"
					output += data.join("</li><li class='list-disc'>")
					output += "</li></ul>"
					return output
				}
				if(  specialKeys.includes(key) ){
					let mapped = data.map( d => d.display )
					let output = "<ul><li class='list-disc'>"
					output += mapped.join("</li><li class='list-disc'>")
					output += "</li></ul>"
					return output
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
			},
			rowClasses(data){
				let classes = []
				this.selected.includes(data.id) ? classes.push('selected') : ''
				classes.push( data.status.toLowerCase().replaceAll(/[ ]/g, "-") )
				return classes.join(" ")
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

			this.search.column = this.headers.filter( h=>h.show )[0].header
		},
		watch:{
			rowsData(newVal){
				this.columnData = JSON.parse(JSON.stringify(newVal))
			}
		},
		components: {
			Modal,
			Button,
			Checkbox,
			TextInput,
			Label
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
		background-color: rgb(235, 140, 47) !important;
	}
	td, th{
		border:1px solid black;
		transition:background-color .2s
	}
	th{
		background-color: #FFFFFF;
	}
	table{
		border-collapse:separate;
		border-spacing:0;
		min-width:2000px;
		z-index:1
	}
	tr.new td{ background-color: #FFFFFF; }
	tr.resolved td{ background-color: #C5F8BE; }
	tr.partly-resolved td{ background-color: #FFF2CC; }
	tr.remains td{ background-color: #F4CCCC; }
	tr.regression td{ background-color: #D9D2E9; }
	tr.best-practice td{ background-color: #CFE2F3; }
	tr.third-party-problem td{ background-color: #D9D9D9; }
	tr.resolved-by-removal td{ background-color: #D9D9D9; }
	
</style>