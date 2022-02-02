<template>
	<div class="flex flex-col max-w-full w-full">
		<div class="overflow-x-auto">
			<div class="py-2 align-middle inline-block min-w-full">
				<div class="shadow overflow-hidden border-b border-gray-200 xs:w-full sm:w-auto">
					<div v-if="search" class="py-1 px-2 w-full flex items-center flex-wrap">
						<label class="text-sm" for="search">Search</label>
						<input name="search" id="search" v-model="searchOpts.term" class="border m-1 p-1" />
						<label class="text-sm" for="case">Case Sensitive</label>
						<Checkbox size="small" class="mx-1" name="case" id="case" v-model="searchOpts.caseSensitive"></Checkbox>
						<button @click.prevent="submitSearch" class="ml-1 text-sm standard" :hover="true">Submit</button>
					</div>
					<table class="min-w-full divide-y divide-gray-200 border-collapse">
						<thead class="bg-gray-50">
							<tr>
								<th 
								:key="`header-${index}`" 
								v-for="(header, index) in headers" 
								scope="col" 
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									<div class="flex items-stretch">
										<span class="pr-3">{{header.display ? header.display : header}}</span>
										<button
										@click.prevent="sort(header)"
										v-if="header.hasOwnProperty('sort')"
										:class="sortClasses[header.link]"
										class="transform" style="width:15px">
											<span v-if="sortClasses[header.link] == 'rotate-90' || sortClasses[header.link] == 'rotate--90'">&gt;</span>
											<span v-if="!sortClasses[header.link]">-</span>
										</button>
									</div>
								</th>
								<slot name="headers-extra"></slot>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<tr v-for="(item, index) in rows" :key="`row-${index}`">
								<slot v-bind:data="item" name="cells-main">
									<template v-for="(value, key) in item">
										<td v-if="!hiddenProps.includes(key)" class="px-6 py-4 whitespace-nowrap" :key="`row-${key}`">
											<div :data-key="key" class="text-sm text-gray-900">{{value}}</div>
										</td>
									</template>
								</slot>
								<slot v-bind:data="item" v-bind:index="index" name="cells-extra"></slot>
							</tr>
						</tbody>
					</table>
					<Pagination 
					:current="current" 
					:per-page="perPage" 
					:total="total" 
					@page-changed="current = $event" 
					v-if="pagination && perPage < total"></Pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import Pagination from './Pagination'
import Button from './Button'
import Checkbox from './Checkbox'

export default {
	data(){
		return {
			current: 1,
			perPage: 100,
			filteredRows: [],
			sortedRows: [],
			filtering: false,
			searchOpts: {
				term: "",
				caseSensitive: false
			},
			sortData: {
				columns: [  ], //click once: add to columns, click twice: check if in columns, if so, add desc. Click third: remove from column
				orders: [  ]
			},
			sortClasses: {

			}
		}
	},
	props:{
		headers:{
			default:function(){
				return ["Header 1", "Header 2", "Header 3"]
			},
			type:Array,
		},
		hiddenProps:{
			default:function(){
				return []
			},
			type:Array,
		},
		items:{
			default:function(){
				return [
					{
						propOne: "Cell 1",
						propTwo: "Cell 2",
						propThree: "Cell 3"
					},
					{
						propOne: "Cell 1",
						propTwo: "Cell 2",
						propThree: "Cell 3"
					},
					{
						propOne: "Cell 1",
						propTwo: "Cell 2",
						propThree: "Cell 3"
					}
				]
			},
			type:Array,
		},
		pagination:{
			type:Boolean,
			default:true
		},
		search: {
			type: Boolean,
			default: true
		},
		searchableProps: { //Case sensitive list of item properties you wish to include in the search
			type: Array,
			default: function(){
				return []
			},
		},
		searchOverride: {
			type: Object,
			default: function(){
				return {}
			}
		}
	},
	methods: {
		sort( header ){
			let index = this.sortData.columns.indexOf( header.link )

			//If sort.columns does not currently have this column
			if( index < 0 ){
				this.sortData.columns.push( header.link )
				this.sortData.orders.push( "asc" )

			//If sort.columns currently has this column
			}else if( index >= 0 && this.sortData.orders[index] == 'asc' ){ 
				this.sortData.orders[index] = 'desc'

			//If this column is already set to desc, then remove it
			}else {
				this.sortData.columns.splice(index, 1)
				this.sortData.orders.splice(index, 1)
			}

			this.sortClasses[ header.link ] = this.getSortClass( header.link )

			this.filteredRows = this._.orderBy(this.filteredRows, this.sortData.columns, this.sortData.orders)
			if( this.sortData.columns.length ){
				this.sortedRows = this._.orderBy(this.items, this.sortData.columns, this.sortData.orders)
				return
			}

			this.sortedRows = []
		},
		submitSearch(){
			this.current = 1
			if( this.searchOpts.term && this.items.length ){
				this.filtering = true
				let self = this
				this.filteredRows = this.items.filter( item => {
					var x = 0, l = Object.keys(self.items[0]).length
					if( self.searchableProps.length ){
						l = self.searchableProps.length
					}
					
					while (x < l) {
						let property = Object.keys(self.items[0])[x]
						let term = self.searchOpts.term.toLowerCase()
						
						if( self.searchableProps.length ){
							property = self.searchableProps[x]
						}
						
						// Possible custom search logic
						if( self.searchOverride.hasOwnProperty( property ) ){
							if ( self.searchOverride[ property ]( this, self.searchOpts.term, item[ property ], self.searchOpts.caseSensitive ) ){
								return true
							}
						}

						// DEFAULT SEARCH LOGIC
						//Check if prop is an array
						if( Array.isArray( item[ property ] ) ){
							if( !self.searchOpts.caseSensitive ){
								if( item[ property ] && item[ property ].join("").toString().toLowerCase().includes( term ) ){
									return true
								}
							}

							if( self.searchOpts.caseSensitive ){
								if( item[ property ] && item[ property ].join("").toString().includes( term ) ){
									return true
								}
							}
						}else{
							if( !self.searchOpts.caseSensitive ){
								if( item[ property ] && item[ property ].toString().toLowerCase().includes( term ) ){
									return true
								}
							}

							if( self.searchOpts.caseSensitive ){
								if( item[ property ] && item[ property ].toString().includes( term ) ){
									return true
								}
							}
						}
						++x;
					}

					return false
				})
			}else{
				this.filtering = false
				this.filteredRows = []
			}
		},
		getSortClass( link ){
			let index = this.sortData.columns.indexOf( link )
			if( this.sortData.orders.hasOwnProperty( index ) && this.sortData.orders[index] == 'asc' ){
				return 'rotate--90'
			}
			if( this.sortData.orders.hasOwnProperty( index ) && this.sortData.orders[index] == 'desc' ){
				return 'rotate-90'
			}
			if( !this.sortData.orders.hasOwnProperty( index ) ){
				return ''
			}
		},
	},
	computed: {
		total(){
			if( this.filtering ){
				return this.filteredRows.length
			}
			return this.items.length
		},
		rows(){
			if( this.pagination ){
				if( this.filtering ){
					return this.filteredRows.slice( this.perPage * (this.current - 1), this.perPage * this.current )
				}

				if( this.sortedRows.length ){
					return this.sortedRows.slice( this.perPage * (this.current - 1), this.perPage * this.current )
				}

				return this.items.slice( this.perPage * (this.current - 1), this.perPage * this.current )
			}

			if( this.filtering ){
				return this.filteredRows
			}

			if( this.sortedRows.length ){
				return this.sortedRows
			}

			return this.items
		},
	},
	watch: {
		
	},
	created(){},
	mounted(){
	},
	components: {
		Pagination,
		Button,
		Checkbox
	}
}

</script>
<style scoped>
	.rotate--90{
		transform:rotate(-90deg);
	}
	td, th{
		border:0px !important;
	}
</style>