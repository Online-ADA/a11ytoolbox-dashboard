<template>
	<div class="flex flex-col">
		<div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
				<div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
							<tr v-for="(item, index) in items" :key="`row-${index}`">
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
					text-before-input="Before" 
					text-after-input="After" 
					v-if="pagination"></Pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Pagination from './Pagination'

export default {
	data(){
		return {
			current: 1,
			perPage: 2,
			total: this.items.length / 2
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
		}
	},
	methods: {},
	computed: {},
	watch: {},
	created(){},
	mounted(){},
	components: {
		Pagination
	}
}
</script>