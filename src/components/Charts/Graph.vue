<template>
	<div class="p-3">
		<div class="flex justify-between items-center ">
			<!-- left buttons -->
			<div class="flex items-center">
				
				<label class="flex items-center mr-3">
					<div class="bg-pallette-blue h-3 w-6 mr-1"></div>
					<select v-model="first_select" name="first_select">
						<option value="new">New</option>
						<option value="resolved">Resolved</option>
					</select>
				</label>

				<label class="flex items-center">
					<div class="bg-pallette-red-dark h-3 w-6 mr-1"></div>
					<select v-model="second_select" name="second_select">
						<option value="new">New</option>
						<option value="resolved">Resolved</option>
					</select>
				</label>
			</div>
			<!-- right buttons -->
			<div class="flex">
				<label class="flex items-center mr-3">
					<span class="text-sm pr-1">Last 30 days</span>
					<select name="date">
						<option value="">Feb 21, 2022 - Mar 22, 2022</option>
					</select>
				</label>

				<button 
				title="Graph type"
				:aria-label="type == 'line' ? 'Change to bar graph' : 'Change to line graph'"
				@click="type == 'line' ? type = 'bar' : type = 'line'" 
				class="mr-3">
					<div class="w-[15px] mx-auto">
						<img v-if="type == 'line'" class="w-full" src="/assets/chart-line-light.svg" />
						<img v-if="type == 'bar'" class="w-full" src="/assets/chart-column-light.svg" />
					</div>
					<div class="uppercase text-[10px]">Graph Type</div>
				</button>

				<button :aria-label="graphIncrement" @click="changeIncrement" class="mr-3">
					<div class="w-[15px] mx-auto"><img class="w-full" src="/assets/sliders-light.svg" /></div>
					<div class="uppercase text-[10px]">Adjust</div>
				</button>
			</div>
		</div>
		<div class="relative h-[180px] w-full" >
			<canvas ref="graph" id="myGraph"></canvas>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, reactive, computed } from '@vue/composition-api'

export default defineComponent({
	name: "Graph",
	props:{
		labels: {
			type: Array,
			default: () => ["one", "two"]
		},
		chartType:{
			type: String,
			default: "line"
		},
	},
	setup(props) {
		const first_select = ref("resolved")
		const second_select = ref("new")
		const type = ref(props.chartType)
		
		const chartData = ref({
			labels: props.labels,
			datasets: [
				{
					label: 'New',
					backgroundColor: '#9c0800',
					borderColor: '#9c0800',
					data: [0, 10, 5, 2, 20, 30, 45],
				},
				{
					label: 'Resolved',
					backgroundColor: '#004458',
					borderColor: '#004458',
					data: [30, 1, 15, 20, 2, 3, 5],
				}
			]
		})

		const config = ref({
			type: type,
			data: chartData.value,
			options: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display:false
					}
				}
			},
		})

		const graph = ref(null)
		const lineChart = ref(null)

		function generateGraph(){
			if( !lineChart.value ){
				lineChart.value = new Chart(
					graph.value,
					config.value
				)
			}else{
				lineChart.value.update()
			}
		}

		onMounted(()=>{
			generateGraph()
		})

		watch(type, ()=>{
			generateGraph()
		})

		const increment = ref("month")

		return { increment, chartData, config, lineChart, graph, first_select, second_select, type }
	},
	methods:{
		changeIncrement(){
			if( this.increment == "month" ){
				this.increment = "day"
			}
			if( this.increment == "day" ){
				this.increment = "week"
			}
			if( this.increment == "week" ){
				this.increment = "month"
			}
		}
	},
	components:{
	}
})
</script>
