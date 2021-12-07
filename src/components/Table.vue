<template>
	<div class="flex flex-col relative px-5">
		<!-- <div style="padding-right:1px;" class="flex w-full relative justify-end items-center">
			<div v-if="!locked">
				<button title="Select All Rows" class="text-lg leading-none" @click.prevent="selectAll" >
					<i class="fas fa-grip-horizontal"></i>
				</button>
			</div>
			<div v-if="!locked">
				<button class="text-lg leading-none mx-3.5" title="Deselect All Rows" @click.prevent="deselectAll">
					<i class="fal fa-grip-horizontal"></i>
				</button>
			</div>
			<div>
				<button class="text-base leading-none" title="Open Show or Hide Columns Modal" @click.prevent="openModal(()=>{columnPickerOpen = true})" >
					<i class="far fa-thumbtack"></i>
				</button>
			</div>
		</div> -->
		<div tabindex="-1" @mousemove="moving" v-dragscroll.x class="overflow-x-auto w-full relative border border-black h-2/3">
			<a v-if="rows.length" class="skip-headers-row absolute top-2.5 left-2.5 p-3 rounded border border-black block bg-white z-10" :href="'#'+rows[0]['issue_number']">Skip headers row</a>
			<table v-show="rows.length && headers.length" class="w-full" :class="{'table-fixed': fixed, 'condensed': condense, 'issues-table':issuesTable}">
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
										v-if="!sortData.reference.includes(header.header.replaceAll(/[ ]/g, '_'))" 
										:aria-label="`Currently unsorted. Click to sort column ${header.header} by ascending`" 
										class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
										<i class="fas fa-sort"></i>
									</button>
									<button 
										@click="sort(header.header)" 
										v-if="sortData.reference.includes(header.header.replaceAll(/[ ]/g, '_')) && sortData.orders[ sortData.reference.indexOf(header.header.replaceAll(/[ ]/g, '_')) ] == 'asc'"
										:aria-label="`Currently sorted by ascending. Click to sort column ${header.header} descending`" 
										class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
										<i class="fas fa-sort-up"></i>
									</button>
									<button 
										@click="sort(header.header)"
										v-if="sortData.reference.includes(header.header.replaceAll(/[ ]/g, '_')) && sortData.orders[ sortData.reference.indexOf(header.header.replaceAll(/[ ]/g, '_')) ] == 'desc'"
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
					:aria-description="!rowCanBeRemoved(data) ? 'This row cannot be selected because it cannot be removed.' : false"
					:aria-selected="selected.includes(data['unique']) ? true : false"
					:id="index == 0 ? 'a' + data['issue_number'] : false"
					:class="rowClasses(data)" 
					tabindex="0" 
					@mousedown="down" 
					@keydown="checkRowSelect(data, $event)" 
					@mouseup="up(data, $event)" 
					v-for="(data, index) in rows" 
					:key="'row-'+index">


						<td
						tabindex="-1" 
						class="p-2"
						v-for="(header, subIndex) in headers"
						:class="headers.hasOwnProperty(subIndex) ? getTDClasses(subIndex, translateHeader(header.header)) : false"
						:style="headers.hasOwnProperty(subIndex) ? headers[subIndex].style : false"
						v-show="headers.hasOwnProperty(subIndex) && columnsToShow.includes(headers[subIndex].header) && !headers[subIndex].hidePermanent ? true : false"
						:data-key="translateHeader(header.header)"
						:key="`row-${index}-column-${subIndex}`"
						>
							<span tabindex="-1" v-if="(translateHeader(header.header) == 'articles' && $store.state.audits.articles.length) || 
													   (translateHeader(header.header) == 'techniques' && $store.state.audits.techniques.length) ||
													   (translateHeader(header.header) != 'techinques' && translateHeader(header.header) != 'articles')"
							>
								<template v-if="listKeys.includes(translateHeader(header.header))">
									<span 
									tabindex="-1" 
									class="text-left block" 
									:class="{'break-words': plainKeys.includes(translateHeader(header.header))}"
									v-html="displayValue(translateHeader(header.header), data[translateHeader(header.header)])"></span>
								</template>

								<template v-else-if="data.how_discovered == 'Automated Audit' && (translateHeader(header.header) == 'descriptions' || translateHeader(header.header) =='recommendations')">
									
									<span class="block break-words" tabindex="-1" >{{displayValue(translateHeader(header.header), data[translateHeader(header.header)])}}</span>
								</template>

								<template v-else-if="translateHeader(header.header) == 'target' || translateHeader(header.header) =='html'">
									<span class="block break-words" tabindex="-1" >{{displayValue(translateHeader(header.header), data[translateHeader(header.header)])}}</span>
								</template>

								<template v-else>
									<span class="block" tabindex="-1" :class="{'text-left ql-editor': translateHeader(header.header) == 'descriptions' || translateHeader(header.header) == 'recommendations', 'break-words': plainKeys.includes(translateHeader(header.header))}"  v-html="displayValue(translateHeader(header.header), data[translateHeader(header.header)])"></span>
								</template>
								
							</span>
							
						</td>




						<!-- <td 
						tabindex="-1" 
						class="p-2" 
						:ref="'columnData-'+ subIndex" 
						:class="headers.hasOwnProperty(subIndex) ? getTDClasses(subIndex, key) : false" 
						:style="headers.hasOwnProperty(subIndex) ? headers[subIndex].style : false" 
						v-show="headers.hasOwnProperty(subIndex) && columnsToShow.includes(headers[subIndex].header) && !headers[subIndex].hidePermanent ? true : false" 
						:data-key="key" 
						v-for="(value, key, subIndex) in data" 
						:key="'key-'+subIndex">
							<span tabindex="-1" v-if="(key == 'articles' && $store.state.audits.articles.length) || 
													   (key == 'techniques' && $store.state.audits.techniques.length) ||
													   (key != 'techinques' && key != 'articles')"
							>
								<template v-if="listKeys.includes(key)">
									<span 
									tabindex="-1" 
									class="text-left block" 
									:class="{'break-words': plainKeys.includes(key)}"
									v-html="displayValue(key, value)"></span>
								</template>

								<template v-else-if="data.how_discovered == 'Automated Audit' && (key == 'descriptions' || key =='recommendations')">
									
									<span class="block break-words" tabindex="-1" >{{displayValue(key, value)}}</span>
								</template>

								<template v-else-if="key == 'target' || key =='html'">
									<span class="block break-words" tabindex="-1" >{{displayValue(key, value)}}</span>
								</template>

								<template v-else>
									<span class="block" tabindex="-1" :class="{'text-left ql-editor': key == 'descriptions' || key == 'recommendations', 'break-words': plainKeys.includes(key)}"  v-html="displayValue(key, value)"></span>
								</template>
								
							</span>
						</td> -->
					</tr>
				</tbody>
			</table>
			<span v-show="!rows.length">No issues</span>
		</div>
		
		<Pagination 
		:current="current" 
		:per-page="perPage" 
		:total="total" 
		@page-changed="changePage" 
		v-show="showPagination">
		</Pagination>
		
		<div class="mb-24 w-full"></div>
		
		<Modal style="z-index:71" :open="columnPickerOpen">
			<div class="w-full p-3">
				<button aria-label="Close column selector modal" @click.prevent="closeModal(()=>{columnPickerOpen = false})" class="absolute top-4 right-4 px-2 standard">X</button>
				<ul class="flex flex-wrap">
					<template v-for="(header, index) in headers">
						<li v-if="!header.hidePermanent" class="flex w-5/12 mx-2 my-2 justify-center items-center" :key="index">
							<Label :for="'showCol'+ (index+1)">Show {{header.header}}</Label>
							<Checkbox v-model="header.show" :id="'showCol'+ (index+1)"></Checkbox>
						</li>
					</template>
				</ul>
				<button @keyup.enter="showHideColumns" @keyup.space="showHideColumns" @click="showHideColumns" class="px-2 standard">Submit</button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import Modal from "../components/Modal"
	import Button from "../components/Button"
	import Checkbox from "../components/Checkbox"
	import Pagination from "../components/Pagination"
	import Label from "../components/Label"
	import TextInput from "../components/TextInput"
	import { dragscroll } from 'vue-dragscroll'
	import { EventBus } from '../services/eventBus'


	export default {
		directives: {
			dragscroll
		},
		props:{
			issuesTable: {
				type: Boolean,
				default: false
			},
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
			},
			sortData: {
				type: Object,
				default:function(){
					return {
						columns: [ "id" ], //click once: add to columns, click twice: check if in columns, if so, add desc. Click third: remove from column
						orders: [ "asc" ],
						reference: ["id"]
					}
				}
			}
		},
		data(){
			return {
				current: 1,
				perPage: 100,
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
					"created_by",
					"media_type",
					"html",
				],
				specialKeys : ["articles", "techniques"],
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
			showPagination(){
				return this.rows.length && this.perPage < this.total
			},
			total(){
				return this.$store.state.audits.audit.issue_count
			},
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
			},
		},
		methods: {
			translateHeader(val){
				if( val == "audit 1 recommendations" ){
					return "recommendations"
				}
				if( val == "success criteria" ){
					return "articles"
				}

				return val.replace(" ", "_")
			},
			changePage($event){
				this.$store.dispatch("audits/getIssuesOffset", {audit_id: this.$route.params.id, page: $event})
				this.current = $event
			},
			openModal( callback ){
				let classList = document.body.classList
				if( !classList.contains("modalOpen") ){
					classList.add("modalOpen")
				}
				callback()
			},
			closeModal( callback ){
				let classList = document.body.classList
				if( classList.contains("modalOpen") ){
					classList.remove("modalOpen")
				}
				callback()
			},
			rowCanBeRemoved(data){
				if( this.importing && data.hasOwnProperty('unique') ){
					return true
				}
				if( !this.importing ){
					return true
				}
				return false
			},
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
			up(data, event){
				if( event.srcElement != 'a' ){
					this.dragData.dragging = false
					if( this.dragData.x === 0 && !this.locked ){
						if( (this.importing && data.hasOwnProperty('unique')) || !this.importing ){
							this.$emit('rowClick', data)
						}
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
			sort( column, quiet = false ){
				if( column ){
					column = column.replaceAll(/[ ]/g, "_")
					//String reference is necessary because sometimes our column becomes an anonymous function
					let reference = column
					if( column == "levels" ){
						column = ((item)=>{
							return item.levels.join(" ")
						})
					}
					if( column == "success_criteria" ){
						column = ((item)=>{
							let output = ""
							for (let x = 0; x < item.articles.length; x++) {
								const article = item.articles[x];
								output += " " + article.display
							}
							
							return output
						})
					}
					if( column == "techniques" ){
						column = ((item)=>{
							let output = ""
							for (let x = 0; x < item.techniques.length; x++) {
								const technique = item.techniques[x];
								output += technique.display
							}
							return output
						})
					}
					if( column == "pages" ){
						column = ((item)=>{
							if( item.pages ){
								let domain = this.$store.state.audits.audit.domain.url.replace(/\/$/gm, "")
								
								if( this.$store.state.audits.audit.domain.root ){
									domain = domain + "/" + this.$store.state.audits.audit.domain.root.replace(/\/$/gm, "")
								}
								let output = ""
								for (let x = 0; x < item.pages.length; x++) {
									let page = item.pages[x]
									if( page.title ){
										output += page.title
									}
									if( page.title && page.url ){
										output += " - "
									}
									if( page.url ){
										let url = page.url
										if( url == "/" ){
											url = ""
										}
										output += domain + "/" + url
									}
								}
								
								return output
							}
							return ""
						})
					}
					let index = this.sortData.reference.indexOf(reference)
					let indexOfID = this.sortData.reference.indexOf('id')
					if( indexOfID >=0 ){
						this.sortData.columns.splice(indexOfID, 1)
						this.sortData.reference.splice(indexOfID, 1)
						this.sortData.orders.splice(indexOfID, 1)
					}
					
					if( index < 0 ){ //If sort.columns does not currently have this column
						this.sortData.columns.push(column)
						this.sortData.reference.push(reference)
						this.sortData.orders.push("asc")
					} else if( index >= 0 && this.sortData.orders[index] == 'asc' ){ //If sort.columns currently has this column
						this.sortData.orders[index] = 'desc'
					} else {
						this.sortData.columns.splice(index, 1)
						this.sortData.reference.splice(index, 1)
						this.sortData.orders.splice(index, 1)
					}

					if( !this.sortData.columns.length ){
						this.sortData.columns.push('id')
						this.sortData.reference.push('id')
						this.sortData.orders.push('asc')
					}
				}
				
				this.filteredRows = this._.orderBy(this.filteredRows, this.sortData.columns, this.sortData.orders)
				this.columnData = this._.orderBy(this.columnData, this.sortData.columns, this.sortData.orders)

				if( !quiet ){
					this.$emit("sort", this.sortData)
				}
			},
			submitTableSearch(){
				if( this.search.term ){
					this.filtering = true
					let self = this
					this.filteredRows = this.columnData.filter( c => {
						let column = self.search.column.toLowerCase().replaceAll(/[ ]/g, "_")
						
						if( column == "success_criteria" ){
							column = "articles"
						}
						if( column == "audit_1_recommendations" ){
							column = "recommendations"
						}
						
						if( Array.isArray(c[column]) ){
							let toSearch = c[column]
							
							if( column == "articles" ){
								toSearch = c[column].map( a=>a.display)
							}
							if( column == "pages" ){
								toSearch = c[column].map( a=>a.title )
							}
							if( !self.search.caseSensitive ){
								return toSearch.join("").toLowerCase().includes(self.search.term)
							}
							return toSearch.join("").includes(self.search.term)
						}else{
							
							if( !self.search.caseSensitive ){
								return c[column].toLowerCase().includes(self.search.term.toLowerCase())
							}
							return c[column].includes(self.search.term)
						}
					})
				}else{
					this.filtering = false
					this.filteredRows = []
				}
				EventBus.$emit("auditFilteredRows", this.rows.length)
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
				let toEmit = this.headers.filter(h=>h.show && !h.hidePermanent).map(h=>{
					
					if( h.header == "audit 1 recommendations" ){
						return "recommendations"
					}
					if( h.header == "success criteria" ){
						return "articles"
					}
					return h.header.replaceAll(" ", "_")
				})
				
				this.$emit("hideColumns", toEmit)
	
				this.closeModal(()=>{this.columnPickerOpen = false})
			},
			displayValue(key, data){
				if( data == undefined ){
					return ""
				}
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
						if( key == "pages"){
							for (let index = 0; index < data.length; index++) {
								let content = ""
								const element = data[index];
								
								if( element.title ){
									content += element.title
								}
								if( element.title && element.url ){
									content += " - "
								}
								if( element.url ){
									let domain = this.$store.state.audits.audit.domain.url.replace(/\/$/gm, "")
									
									if( this.$store.state.audits.audit.domain.root ){
										domain = domain + "/" + this.$store.state.audits.audit.domain.root.replace(/\/$/gm, "")
									}
									let url = element.url
									if( url == "/" ){
										url = ""
									}
									
									if( !url.includes(domain) ){
										if( url[0] == "/" ){
											url = domain + url
										}
										else{
											url = domain + "/" + url
										}
									}
									content += '<a target="_blank" href="'+url+'">' + url + '</a>'
								}
								output += content
								output += "</li>"
								if( index !== data.length - 1 ){
									output += "<li class='list-disc break-words'>"
								}
							}
							
						}else{
							output += data.join("</li><li class='list-disc break-words'>")
						}
						
						output += "</li></ul>"
					}
					
					return output
				}
				if( this.specialKeys.includes(key) ){
					let source = this.$store.state.audits.articles
					if( key == "techniques" ){
						source = this.$store.state.audits.techniques
					}
					let output = ""
					if( data.length ){
						if( data.length > 1 ){
							output = "<ul><li class='list-disc break-words'>"

							for (let index = 0; index < data.length; index++) {
								let urlOb = source.find( a=>a.id == data[index].id )
								if( urlOb && urlOb.ext_url ){
									output += `<a target="_blank" href='${urlOb.ext_url}'>${data[index].display}</a>`
								}else{
									output += data[index].display
								}
								
								if( index+1 != data.length ){
									output += "</li><li class='list-disc break-words'>"
								}
							}
							output += "</li></ul>"
						}else{
							let urlOb = source.find( a=>a.id == data[0].id )
							if( urlOb && urlOb.ext_url ){
								output += `<a target="_blank" href='${urlOb.ext_url}'>${data[0].display}</a>`
							}else{
								output += data[0].display
							}
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

				//Emit all stickied headers
				let allStickied = this.headers.filter(h=>h.sticky).map(h=>h.header)
				this.$emit("freezeColumn", allStickied)
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

				this.$emit("moveColumn", this.headers.map(h=>h.header))
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
			for (let x = 0; x < this.headers.length; x++) {
				if( this.headers[x].sticky ){
					this.$set(this.headers[x].style, "left", this.getLeftValue(x))
				}
			}

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

			let that = this
			EventBus.$on('toolbarEmit', (payload)=>{
				if( payload.action == 'audit-search-open' ){
					that.search = payload.data
					that.submitTableSearch()
					return
				}
				if( payload.action == 'audit-search-close' ){
					that.filtering = false
					that.filteredRows = []
				}
				if( payload.action == 'selectAll' ){
					that.selectAll()
				}
				if( payload.action == 'deselectAll' ){
					that.deselectAll()
				}
				if( payload.action == 'columnPicker' ){
					that.openModal(()=>{ that.columnPickerOpen = true })
				}
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
				this.sort(false, true)
			},
			headers(newVal){
				this.search.column = newVal.filter( h=>h.show )[0].header
				this.columnsToShow = this.headers.filter( h=>h.show ).map( h=>h.header)
			},
		},
		components: {
			Modal,
			Button,
			Checkbox,
			TextInput,
			Label,
			Pagination
		}
	}
</script>