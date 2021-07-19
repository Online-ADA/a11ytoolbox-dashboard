<template>
	<div class="flex flex-col relative px-5">
		<div class="flex w-full px-10 mb-2 relative overflow-y-auto h-1/3">
			<div class="flex flex-wrap items-end pb-3 w-full mx-auto">
				<h2 class="w-full text-2xl my-3">Table description (what should this say?)</h2>
				<div class="w-full flex">
					<div v-show="!condense" class="w-1/4"></div>
					<div :class="condense ? 'w-full' : 'w-2/4'">
						<p>Here is a list of the various functionality you can expect on the table below:</p>
						<ul class="list-disc text-left mb-3">
							<li><strong>Horizontal scrolling:</strong> at any point while focused inside the table, using the left and right arrow keys will scroll the table to the left and right</li>
							<li><strong>Freezing Columns:</strong> Each column has a button for freezing it in place, such that while scrolling the table left and right, the column will remain in its position while the rest of the unfrozen columns scroll like normal</li>
							<li><strong>Multi Column Sorting:</strong> The sort buttons have 3 modes: Unsorted, Ascending and Descending. If more than one column has been sorted, the columns will sort in order across all sorted columns, i.e. sorting by column A by ascending and column B by descending will sort both columns respectively first by column A then by column B.</li>
							<li><strong>Repositioning of Columns:</strong> Each column, while not frozen, can be moved left or right to reposition them within the table.</li>
						</ul>
					</div>
					<div v-show="!condense" class="w-1/4"></div>
				</div>
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
					<Label for="search-criteria">Search criteria</Label>
					<TextInput style="max-height:39px;" v-model="search.term" name="search-criteria" id="search-criteria" class="flex-1"></TextInput>
				</div>
				<Button style="margin-bottom:5px" class="ml-1" @click.native.prevent="submitTableSearch" :hover="true" color="orange">Submit</Button>
				<div class="text-right pl-2">
					<div style="margin-bottom:2px;"><Button style="padding-bottom:1px;padding-top:0px;" class="mx-1" aria-label="Show or hide columns" @click.native.prevent="columnPickerOpen = true" hover="true">+</Button></div>
					<div v-if="!locked" style="margin-bottom:2px;margin-top:1px;"><Button class="text-xs mx-1" @click.native.prevent="selectAll" hover="true">Select all</Button></div>
					<div v-if="!locked" style="margin-top:1px;"><Button class="text-xs mx-1" @click.native.prevent="deselectAll" hover="true">Deselect all</Button></div>
				</div>
			</div>
		</div>
		<div tabindex="-1" @mousemove="moving" v-dragscroll.x class="overflow-x-auto w-full relative border border-black mb-24 h-2/3">
			<a v-if="rows.length" class="skip-headers-row absolute top-2.5 left-2.5 p-3 rounded border border-black block bg-white z-10" :href="'#'+rows[0]['issue_number']">Skip headers row</a>
			<table v-show="rows.length && headers.length" class="w-full" :class="{'table-fixed': fixed, 'condensed': condense}">
				<thead>
					<tr>
						<th 
						class="capitalize pt-5" 
						v-show="columnsToShow.includes(header.header) && !header.hidePermanent" 
						:ref="'header-' + index" 
						:style="header.style" 
						:width="header.width || false" 
						:class="[header.sticky ? 'sticky z-20' : 'relative z-10']" 
						scope="col" 
						v-for="(header, index) in headers" 
						:key="`header-${index}`">
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
										v-if="!sortData.columns.includes(header.header.replaceAll(/[ ]/g, '_'))" 
										:aria-label="`Currently unsorted. Click to sort column ${header.header} by ascending`" 
										class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
										<i class="fas fa-sort"></i>
									</button>
									<button 
										@click="sort(header.header)" 
										v-if="sortData.columns.includes(header.header.replaceAll(/[ ]/g, '_')) && sortData.orders[ sortData.columns.indexOf(header.header.replaceAll(/[ ]/g, '_')) ] == 'asc'"
										:aria-label="`Currently sorted by ascending. Click to sort column ${header.header} descending`" 
										class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
										<i class="fas fa-sort-up"></i>
									</button>
									<button 
										@click="sort(header.header)"
										v-if="sortData.columns.includes(header.header.replaceAll(/[ ]/g, '_')) && sortData.orders[ sortData.columns.indexOf(header.header.replaceAll(/[ ]/g, '_')) ] == 'desc'"
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
					<tr 
					:aria-description="!data.hasOwnProperty('unique') ? 'This row cannot be selected because it cannot be removed.' : false"
					:aria-selected="selected.includes(data['unique']) ? true : false"
					:id="index == 0 ? 'a' + data['issue_number'] : false"
					:class="rowClasses(data)" 
					tabindex="0" 
					@mousedown="down" 
					@keydown="checkRowSelect(data, $event)" 
					@mouseup="up(data)" 
					v-for="(data, index) in rows" 
					:key="'row-'+index">
						<td 
						tabindex="-1" 
						class="p-2" 
						:ref="'columnData-'+ subIndex" 
						:class="headers.hasOwnProperty(subIndex) ? getTDClasses(subIndex, key) : false" 
						:style="headers.hasOwnProperty(subIndex) ? headers[subIndex].style : false" 
						v-show="headers.hasOwnProperty(subIndex) && columnsToShow.includes(headers[subIndex].header) && !headers[subIndex].hidePermanent ? true : false" 
						:data-key="key" v-for="(value, key, subIndex) in data" 
						:key="'key-'+subIndex">
							<span tabindex="-1">
								<span tabindex="-1" class="text-left block" :class="{'break-words': plainKeys.includes(key)}" v-if="listKeys.includes(key)" v-html="displayValue(key, value)"></span>
								<span class="block break-words" tabindex="-1" v-else-if="key == 'target'" >{{displayValue(key, value)}}</span>
								<span class="block" tabindex="-1" :class="{'text-left ql-editor': key == 'descriptions' || key == 'recommendations', 'break-words': plainKeys.includes(key)}" v-else v-html="displayValue(key, value)"></span>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
			<span v-show="!rows.length">No issues</span>
		</div>
		
		<Modal class="z-30" :open="columnPickerOpen">
			<div class="w-full p-3">
				<Button @click.native.prevent="columnPickerOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Button>
				<ul class="flex flex-wrap">
					<template v-for="(header, index) in headers">
						<li v-if="!header.hidePermanent" class="flex w-5/12 mx-2 my-2 justify-center items-center" :key="index">
							<Label :for="'showCol'+ (index+1)">Show {{header.header}}</Label>
							<Checkbox v-model="header.show" :id="'showCol'+ (index+1)"></Checkbox>
						</li>
					</template>
				</ul>
				<Button @click.native.prevent="showHideColumns">Submit</Button>
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
	import { dragscroll } from 'vue-dragscroll'
	export default {
		directives: {
			dragscroll
		},
		props:{
			importing: {
				type: Boolean,
				default: false
			},
			condense: {
				type: Boolean,
				default: false
			},
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
					return []
				}
			},
			locked: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				plainKeys : [
					"id", 
					"issue_number", 
					"group_id", 
					"descriptions", 
					"recommendations", 
					"status", 
					"target", 
					"priority", 
					"effort", 
					"how_discovered", 
					"audit_id", 
					"auditor_notes", 
					"second_audit_comments", 
					"third_audit_comments", 
					"created_at", 
					"updated_at", 
					"created_by"
				],
				specialKeys : ["articles", "techniques"],
				sortData: {
					columns: [ "id" ], //click once: add to columns, click twice: check if in columns, if so, add desc. Click third: remove from column
					orders: [ "asc" ]
				},
				columnPickerOpen: false,
				headers: [],
				columnData: [],
				listKeys: ['articles', 'techniques', 'pages', 'levels', 'audit_states', 'essential_functionality', "screenshots", "resources", "browser_combos"],
				filteredRows: [],
				filtering: false,
				search: {
					term: "",
					column: null,
					caseSensitive: false
				},
				dragData: {
					dragging: false,
					x: 0,
				},
				columnsToShow: [] //exists for accessibility purposes
			}
		},
		computed: {
			rows(){
				if( this.filtering ){
					return this.filteredRows
				}

				return this.columnData
			},
			originalRows(){
				return this.rows.filter( r=>!r.hasOwnProperty('unique') )
			},
			importingRows(){
				return this.rows.filter( r=>r.hasOwnProperty('unique') )
			}
		},
		methods: {
			getTDClasses(subIndex, key){
				let classes = "";
				if( this.headers[subIndex].sticky ){
					classes += 'sticky z-20'
				}else{
					classes += 'relative z-10'
				}

				return classes
			},
			selectAll(){
				if( this.importing ){
					this.$emit("selectAll", this.importingRows.map( c=>c.unique)  )
				}else{
					this.$emit("selectAll", this.columnData.map( c=>c.id))
				}
				
			},
			deselectAll(){
				if( this.importing ){
					this.$emit("deselectAll", this.importingRows.map( c=>c.unique))
				}else{
					this.$emit("deselectAll", this.columnData.map( c=>c.id))
				}
			},
			moving(event){
				if( this.dragData.dragging ){
					this.dragData.x = event.clientX
				}
			},
			down(){
				this.dragData.dragging = true
				this.dragData.x = 0
			},
			up(data){
				this.dragData.dragging = false
				if( this.dragData.x === 0 && !this.locked ){
					if( (this.importing && data.hasOwnProperty('unique')) || !this.importing ){
						this.$emit('rowClick', data)
					}
				}
			},
			checkRowSelect(data, e){
				if( e.code == "Space" || e.code == "Enter" ){
					e.preventDefault()
					if( (this.importing && data.hasOwnProperty('unique')) || !this.importing ){
						this.$emit('rowClick', data)
					}
				}
			},
			sort( column ){
				if( column ){
					column = column.replaceAll(/[ ]/g, "_")
					let index = this.sortData.columns.indexOf(column)
					let indexOfID = this.sortData.columns.indexOf('id')
					if( indexOfID >=0 ){
						this.sortData.columns.splice(indexOfID, 1)
						this.sortData.orders.splice(indexOfID, 1)
					}
					
					if( index < 0 ){ //If sort.columns does not currently have this column
						this.sortData.columns.push(column)
						this.sortData.orders.push("asc")
					} else if( index >= 0 && this.sortData.orders[index] == 'asc' ){ //If sort.columns currently has this column
						this.sortData.orders[index] = 'desc'
					} else {
						this.sortData.columns.splice(index, 1)
						this.sortData.orders.splice(index, 1)
					}

					if( !this.sortData.columns.length ){
						this.sortData.columns.push('id')
						this.sortData.orders.push('asc')
					}
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
			showHideColumns(){
				this.columnsToShow = this.headers.filter( h=>h.show ).map( h=>h.header)
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

				this.columnPickerOpen = false
			},
			displayValue(key, data){
				if( key == "unique" ){
					return ""
				}
				if( this.plainKeys.includes(key) ){
					return data
				}
				if( !this.plainKeys.includes(key) && !this.specialKeys.includes(key) ){
					let output = ""
					if( data && data.length ){
						output = "<ul><li class='list-disc break-words'>"
						output += data.join("</li><li class='list-disc break-words'>")
						output += "</li></ul>"
					}
					
					return output
				}
				if( this.specialKeys.includes(key) ){
					let output = ""
					if( data ){
						let mapped = data.map( d => d.display)
						
						if( mapped.length ){
							output = "<ul><li class='list-disc break-words'>"
							output += mapped.join("</li><li class='list-disc break-words'>")
							output += "</li></ul>"
						}
					}
					
					
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
				if( this.importing ){
					let imported = data.hasOwnProperty('unique')
					imported && this.selected.includes(data.unique) ? classes.push('selected') : ''
					!imported ? classes.push("no-select") : ''
				}else{
					this.selected.includes(data.id) ? classes.push('selected') : ''
				}
				
				classes.push( data.status.toLowerCase().replaceAll(/[ ]/g, "-") )
				return classes.join(" ")
			},
		},
		mounted(){
			document.querySelector("table").addEventListener( "keydown", function(e){
				setTimeout(()=>{
					if( e.code == "Tab" ){
						let inline = "center"
						if( document.activeElement.nodeName == "TR"){
							inline="start"
						}
						document.activeElement.scrollIntoView({behavior: "smooth", inline:inline, block:"center"})
					}
				}, 1)
			})
		},
		created(){
			this.columnData = JSON.parse(JSON.stringify(this.rowsData))
			this.filteredRows = this._.orderBy(this.filteredRows, this.sortData.columns, this.sortData.orders)
			this.columnData = this._.orderBy(this.columnData, this.sortData.columns, this.sortData.orders)
			this.headers = JSON.parse(JSON.stringify(this.headersData))
		},
		watch:{
			rows(val){
				if( this.rows.length ){
					document.querySelector('.skip-headers-row').addEventListener( "click", function(e){
						let firstRow = document.querySelector('#a'+val[0].issue_number)
						firstRow.focus()
						firstRow.scrollIntoView({behavior: "smooth", inline:"start", block:"center"})
					})
				}
			},
			rowsData(newVal){
				this.columnData = JSON.parse(JSON.stringify(newVal))
				this.sort()
			},
			headers(newVal){
				this.search.column = newVal.filter( h=>h.show )[0].header
				this.columnsToShow = this.headers.filter( h=>h.show ).map( h=>h.header)
				for( let c in this.headers ){
					if( this.headers[c].sticky && c == "0" ){
						this.$set(this.headers[c].style, "left", 0)
					}
					if( this.headers[c].sticky && c != "0" && this.headers[c].show ){
						let col = this.$refs['header-' + (c-1)][0]
						this.$set(this.headers[c].style, "left", col.offsetWidth + 'px')
					}
				}
			},
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