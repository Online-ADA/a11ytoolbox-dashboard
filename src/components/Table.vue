<template>
	<div class="flex flex-col relative table-container-container" :class="{'px-5': $route.name != 'AuditShow' && $route.name != 'MediaAuditShow'}">
		<div :class="{'pagination': showPagination}" tabindex="-1" @mousemove="moving" v-dragscroll.x class="w-full relative border border-black table-container">
			<a v-if="rows.length && !importing" :class="`skip-headers-row-${audit_id}`" class="skip-headers-row absolute top-2.5 left-2.5 p-3 rounded border border-black block bg-white z-10" :href="'#'+rows[0]['issue_number']">Skip headers row</a>
			<table v-show="rows.length && headers.length" class="w-full" :class="{'table-fixed': fixed, 'condensed': condense, 'issues-table':issuesTable}">
				<thead>
					<tr>
						<th 
						class="capitalize pt-[25px]" 
						v-show="columnsToShow.includes(header.key) && !header.hidePermanent" 
						:ref="'header-' + index" 
						:style="header.style" 
						:width="header.width || false" 
						:class="[header.sticky ? 'sticky z-20' : 'relative z-10']" 
						scope="col" 
						v-for="(header, index) in headers" 
						:key="`header-${index}`">
							<div class="flex absolute top-1 justify-between w-full">
								<button @click="moveColumn(index, index-1)" :class="[index !== 0 && !header.sticky && canMoveLeft(index) ? 'visible' : 'invisible']" aria-label="Move this column 1 space to the left" class="mx-1 standard inverted text-xs">
									<i class="fas fa-arrow-left"></i>
								</button>

								<div class="flex">
									<button @click="freezeColumn(header, index)" v-if="!header.sticky && canFreeze(index)" aria-label="Freeze this column so it does not scroll horizontally" class="mx-1 standard inverted text-xs">
										<i class="far fa-snowflake"></i>
									</button>

									<button @click="freezeColumn(header, index)" v-else-if="header.sticky && canFreeze(index)" aria-label="Unfreeze this column so it will scroll horizontally" class="mx-1 standard inverted text-xs">
										<i class="far fa-fire-alt"></i>
									</button>

									<button 
										@click="sort(header.key)" 
										v-if="!sortData.reference.includes(header.key)" 
										:aria-label="`Currently unsorted. Click to sort column ${header.display} by ascending`" 
										class="mx-1 standard inverted text-xs">
										<i class="fas fa-sort"></i>
									</button>
									<button 
										@click="sort(header.key)"
										v-if="sortData.reference.includes(header.key) && sortData.orders[ sortData.reference.indexOf(header.key) ] == 'asc'"
										:aria-label="`Currently sorted by ascending. Click to sort column ${header.display} descending`" 
										class="mx-1 standard inverted text-xs">
										<i class="fas fa-sort-up"></i>
									</button>
									<button 
										@click="sort(header.key)"
										v-if="sortData.reference.includes(header.key) && sortData.orders[ sortData.reference.indexOf(header.key) ] == 'desc'"
										:aria-label="`Currently sorted by descending. Click to remove sorting for ${header.display} column`" 
										class="mx-1 standard inverted text-xs">
										<i class="fas fa-sort-down"></i>
									</button>
								</div>
								
								<button @click="moveColumn(index, index+1)" :class="[index !== headers.length - 1 && !header.sticky ? 'visible' : 'invisible']" aria-label="Move this column 1 space to the right" class="mx-1 standard inverted text-xs">
									<i class="fas fa-arrow-right"></i>
								</button>
							</div>
							{{header.display}}
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
						:class="headers.hasOwnProperty(subIndex) ? getTDClasses(subIndex, header.key) : false"
						:style="headers.hasOwnProperty(subIndex) ? headers[subIndex].style : false"
						v-show="headers.hasOwnProperty(subIndex) && columnsToShow.includes(headers[subIndex].key) && !headers[subIndex].hidePermanent ? true : false"
						:data-key="header.key"
						:key="`row-${index}-column-${subIndex}`"
						>
							<span tabindex="-1" v-if="(header.key == 'articles' && $store.state.audits.articles.length) || 
													   (header.key == 'techniques' && $store.state.audits.techniques.length) ||
													   (header.key != 'techinques' && header.key != 'articles')"
							>
								<template v-if="listKeys.includes(header.key)">
									<span 
									tabindex="-1" 
									class="text-left block" 
									:class="{'break-words': plainKeys.includes(header.key)}"
									v-html="displayValue(header.key, data[header.key])"></span>
								</template>

								<template v-else-if="header.key == 'target' || header.key =='html'">
									<span class="block break-words" tabindex="-1" >{{displayValue(header.key, data[header.key])}}</span>
								</template>

								<template v-else>
									<span class="block" tabindex="-1" :class="{'text-left ql-editor': header.key == 'descriptions' || header.key == 'recommendations', 'break-words': plainKeys.includes(header.key)}" v-html="displayValue(header.key, data[header.key])"></span>
								</template>
								
							</span>
						</td>
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
		
		<Modal style="z-index:71" :open="columnPickerOpen">
			<div class="w-full p-3">
				<h2 class="subheadline">Choose Columns to Display</h2>
				<button aria-label="Close column selector modal" @click.prevent="EventBus.closeModal(()=>{columnPickerOpen = false})" class="absolute top-4 right-4 px-2 standard">X</button>
				<ul class="flex flex-wrap xs:mt-10 mt-0">
					<template v-for="(header, index) in headers">
						<li v-if="!header.hidePermanent" class="flex xs:w-1/2 w-5/12 xs:mx-0 mx-2 my-2 items-center" :key="index">
							<Checkbox v-model="header.show" :id="'showCol'+ (index+1)"></Checkbox>
							<Label class="xs:break-all break-normal capitalize" :for="'showCol'+ (index+1)">{{header.display}}</Label>
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
	import Utility from '../services/utility'


	export default {
		directives: {
			dragscroll: screen.width < 1024 ? false : dragscroll
		},
		props:{
			tableType:{
				type:String,
				default: "audit"
			},
			audit_id:{},
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
			defaultSortData: {},
			importedIssues: {
				type: Array,
				default: function(){
					return []
				}
			}
		},
		data(){
			return {
				sortData: {
					columns: ["id"],
					orders: ["asc"],
					reference: ["id"]
				},
				EventBus: EventBus,
				current: 1,
				perPage: 100,
				plainKeys : [
					"id", 
					"issue_number", 
					"issue_description", 
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
					"fourth_audit_comments",
					"fifth_audit_comments",
					"sixth_audit_comments",
					"seventh_audit_comments",
					"created_at", 
					"updated_at", 
					"created_by",
					"media_type",
					"html",
					"date_created"
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
				columnsToShow: [], //exists for accessibility purposes
				mobileView: false
			}
		},
		computed: {
			showPagination(){
				return this.rows.length && this.perPage < this.total
			},
			total(){
				// if( this.tableType == "scan" ){
				// 	return
				// }
				if( this.tableType == "audit" ){
					if( this.importing ){
						//if this is the primary audit
						if( this.audit_id == this.$route.params.id ){
							return this.$store.state.audits.audit.issue_count
						}else if(typeof this.audit_id === 'string' && this.audit_id.includes('_temp_')){
							return this.$store.state.audits.temporary_audits.find(a=>a.id == this.audit_id).issue_count
						}else{
							return this.$store.state.projects.project.audits.find(a=>a.id == this.audit_id).issue_count
						}
						
					}
					if(this.$route.name == 'MediaAuditShow') return this.$store.state.mediaAudits.audit.issue_count
					if(this.$route.name == 'AuditShow')return this.$store.state.audits.audit.issue_count
				}
				return 0
				
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
			audit(){
				let that = this
				
				return this.$store.state.projects.project.audits.find( a=>a.id == that.audit_id )
			},
			
		},
		methods: {
			changePage($event){
				if(this.$route.name == 'AuditShow' || this.$route.name == 'AuditImport') {
					if( this.importing ){
						this.$store.dispatch("audits/getIssuesOffset", {
							audit_id: this.audit_id, 
							page: $event, 
							importing: true, 
							isPrimary: this.audit_id == this.$route.params.id
						})
					}else{
						this.$store.dispatch("audits/getIssuesOffset", {audit_id: this.$route.params.id, page: $event, importing: false})
					}
				}
				if(this.$route.name == 'MediaAuditShow') {
					if( this.importing ){
						this.$store.dispatch("mediaAudits/getIssuesOffset", {
							audit_id: this.audit_id, 
							page: $event, 
							importing: true, 
							isPrimary: this.audit_id == this.$route.params.id
						})
					}else{
						this.$store.dispatch("mediaAudits/getIssuesOffset", {audit_id: this.$route.params.id, page: $event, importing: false})
					}
				}
				this.current = $event

				this.$emit("pageChange", {page:this.current, limit:this.perPage})
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
					let reference = column
					let data = Utility.getSortValue(column, this)
					this.setColumnSortData(reference, data)

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
			setColumnSortData(reference, data){
				let index = this.sortData.reference.indexOf(reference)
				let indexOfID = this.sortData.reference.indexOf('id')
				
				if( indexOfID >=0 ){
					this.sortData.columns.splice(indexOfID, 1)
					this.sortData.reference.splice(indexOfID, 1)
					this.sortData.orders.splice(indexOfID, 1)
				}
				
				if( index < 0 ){ //If sort.columns does not currently have this column
					this.sortData.columns.push(data)
					this.sortData.reference.push(reference)
					this.sortData.orders.push("asc")
					return
				} 
				
				if( index >= 0 && this.sortData.orders[index] == 'asc' ){ //If sort.columns currently has this column
					this.sortData.orders[index] = 'desc'
					return
				}

				if( index >= 0 && this.sortData.orders[index] == 'desc' ){
					this.sortData.columns.splice(index, 1)
					this.sortData.reference.splice(index, 1)
					this.sortData.orders.splice(index, 1)
					return
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
						if( column == "last_saved_by" ){
							column = "created_by"
						}
						
						if( Array.isArray(c[column]) ){
							let toSearch = c[column]
							
							if( column == "articles" ){
								toSearch = c[column].map( a=>a.display)
							}
							if( column == "pages" ){
								toSearch = c[column].map( p=>p.title + " " + p.url )
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
				this.columnsToShow = this.headers.filter( h=>h.show ).map( h=>h.key)
				let allStickied = this.headers.filter( el => el.show && el.sticky )
				for( let i in allStickied ){
					let thisItem = this.headers.find( x => x.key == allStickied[i].key)
					let realIndex =  this.headers.indexOf( thisItem )
					if( parseInt(i) === 0 ){
						this.$set( this.headers[realIndex].style, "left", "0px" )
					}else{
						this.$set(this.headers[realIndex].style, "left", this.getLeftValue(realIndex))
					}
				}
				let toEmit = this.headers.filter(h=>h.show && !h.hidePermanent).map(h=>h.key)
				
				this.$emit("hideColumns", toEmit)
	
				EventBus.closeModal(()=>{this.columnPickerOpen = false})
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
								let element = data[index];
								
								if(typeof element === 'string') {
									element = {url:element, title:""}
								}
								if( element.title ){
									content += element.title
								}
								if( element.title && element.url ){
									content += " - "
								}
								if( element.url ){
									let url
									if(this.$route.name == 'MediaAuditShow') {
										url = element.url 
									}
									if(this.$route.name == 'AuditShow' || this.$route.name == 'AuditImport') {
										//when an audit has been imported from a project with different root domain,
										//it incorrectly prefixes the old url
										//
										let domain = this.$store.state.audits.audit.domain.url.replace(/\/$/gm, "")
										
										if( this.$store.state.audits.audit.domain.root ){
											domain = domain + "/" + this.$store.state.audits.audit.domain.root.replace(/\/$/gm, "")
										}
										url = element.url
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
					
					return output;
				}
				if( this.specialKeys.includes(key) ){
					let source = this.$store.state.audits.articles
					if( key == "techniques" && !this.importing ){
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
								if ( urlOb && urlOb.ext_url ){
									output += `<a target="_blank" href='${urlOb.ext_url}'>${data[0].display}</a>`
								} else {
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
				let allStickied = this.headers.filter(h=>h.sticky).map(h=>h.key)
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

				this.$emit("moveColumn", this.headers.map(h=>h.key))
			},
			rowClasses(data){
				let classes = []
				if( this.importing ){
					let imported = data.hasOwnProperty('unique')
					imported && this.selected.includes(data.unique) ? classes.push('selected') : ''
					!imported ? classes.push("no-select") : ''
					
					if ( this.checkIfImported(data) === true ) {
						classes.push('imported')
					}
				}else{
					this.selected.includes(data.id) ? classes.push('selected') : ''
				}
				classes.push( data.status.toLowerCase().replaceAll(/[ ]/g, "-") )
				return classes.join(" ")
			},
			checkIfImported(issue) {
				let foundOb = this.importedIssues.find( importedIssue => issue.issue_number === importedIssue.issue_number);
				if ( foundOb ) {
					return true;
				}
				return false;
			}
		},
		mounted(){
			if( window.screen.width < 1024 ){
				this.mobileView = true
			}
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
					EventBus.openModal(false, payload.$event, ()=>{ that.columnPickerOpen = true })
				}
			})

			this.sortData = this.defaultSortData
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
					document.querySelector(`.skip-headers-row-${this.audit_id}`).addEventListener( "click", function(e){
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
				this.search.column = newVal.filter( h=>h.show )[0].key
				this.columnsToShow = this.headers.filter( h=>h.show ).map( h=>h.key)
			},
			defaultSortData(newVal){
				this.sortData = newVal
				this.filteredRows = this._.orderBy(this.filteredRows, this.sortData.columns, this.sortData.orders)
				this.columnData = this._.orderBy(this.columnData, this.sortData.columns, this.sortData.orders)
			}
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

<style scoped>
	.audit-show .table-container-container{
		height: 100vh;
		max-height: calc(100vh - 123px);
	}
	
	.audit-show .table-container-container .table-container.pagination{
		max-height: calc(100% - 55px);
	}
	.audit-show .table-container-container .table-container ~ div{
		flex-basis: 55px;
		flex-grow: 0;
		flex-shrink: 0;
	}
	.issues-table button{
		padding: 3px;
		border: none;
	}
	tr.imported td {
    background-color: #05db57 !important;
	}
</style>