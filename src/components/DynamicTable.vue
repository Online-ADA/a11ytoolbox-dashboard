<template>
	<div class="flex flex-col">
		<div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
				<div class="shadow overflow-hidden border-b border-gray-200">
					<div v-if="search" class="py-1 px-2 w-full flex items-center">
						<label class="text-sm" for="search">Search</label>
						<input name="search" id="search" v-model="searchOpts.term" class="border m-1" />
						<label class="text-sm" for="case">Case Sensitive</label>
						<Checkbox size="small" class="mx-1" name="case" id="case" v-model="searchOpts.caseSensitive"></Checkbox>
						<Button @click.native.prevent="submitSearch" class="ml-1 text-sm" :hover="true">Submit</Button>
					</div>
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th :key="`header-${index}`" v-for="(header, index) in headers" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{{header}}
								</th>
								<slot name="headers-extra"></slot>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<tr v-for="(item, index) in rows" :key="`row-${index}`">
								<slot v-bind:data="item" name="cells-main">
									<td v-for="(value, key) in item" class="px-6 py-4 whitespace-nowrap" :key="`row-${key}`">
										<div :data-key="key" class="text-sm text-gray-900">{{value}}</div>
									</td>
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
import Label from './Label.vue'
import Pagination from './Pagination'
import Button from './Button'
import Checkbox from './Checkbox'

export default {
	data(){
		return {
			current: 1,
			perPage: 2,
			filteredRows: [],
			filtering: false,
			searchOpts: {
				term: "",
				caseSensitive: false
			},
		}
	},
	props:{
		headers:{
			default:function(){
				return ["Header 1", "Header 2", "Header 3"]
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
		}
	},
	methods: {
		submitSearch(){
			this.current = 1
			if( this.searchOpts.term ){
				this.filtering = true
				let self = this
				this.filteredRows = this.items.filter( item => {

					var x = 0, l = self.searchableProps.length;
					while (x < l) {
						let property = self.searchableProps[x]
						//Check if prop is an array
						if( Array.isArray( item[ property ] ) ){
							if( !self.searchOpts.caseSensitive ){
								if( item[ property ].join("").toLowerCase().includes(self.searchOpts.term) ){
									return true
								}
							}

							if( self.searchOpts.caseSensitive ){
								if( item[ property ].join("").includes(self.searchOpts.term) ){
									return true
								}
							}
						}else{
							if( !self.searchOpts.caseSensitive ){
								if( item[ property ].toLowerCase().includes(self.searchOpts.term) ){
									return true
								}
							}

							if( self.searchOpts.caseSensitive ){
								if( item[ property ].includes(self.searchOpts.term) ){
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
		}
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

				return this.items.slice( this.perPage * (this.current - 1), this.perPage * this.current )
			}

			if( this.filtering ){
				return this.filteredRows
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

Label</script>