<template>
	<div class="p-3">
		<div class="flex justify-between items-center ">
			<!-- left buttons -->
			<div class="flex items-center">
				<label class="flex items-center mr-3">
					<div class="bg-pallette-blue h-3 w-6 mr-1"></div>
					<select v-model="first_select" name="first_select" id="first_select" @change="changeIncrement()">
            <option value="New">New</option>
            <option value="Resolved">Resolved</option>
            <option value="Partly Resolved">Partly Resolved</option>
            <option value="Remains">Remains</option>
            <option value="Regression">Regression</option>
            <option value="Best Practice">Best Practice</option>
            <option value="Third party problem">Third party problem</option>
            <option value="Resolved by removal">Resolved by removal</option>
            <option value="Usability Problem">Usability Problem</option>
            <option value="Duplicate">Duplicate</option>
					</select>
				</label>

				<label class="flex items-center">
					<div class="bg-pallette-red-dark h-3 w-6 mr-1"></div>
					<select v-model="second_select" name="second_select" id="second_select" @change="changeIncrement()">
						<option value="New">New</option>
						<option value="Resolved">Resolved</option>
            <option value="Partly Resolved">Partly Resolved</option>
            <option value="Remains">Remains</option>
            <option value="Regression">Regression</option>
            <option value="Best Practice">Best Practice</option>
            <option value="Third party problem">Third party problem</option>
            <option value="Resolved by removal">Resolved by removal</option>
            <option value="Usability Problem">Usability Problem</option>
            <option value="Duplicate">Duplicate</option>
					</select>
				</label>
			</div>
			<!-- right buttons -->
			<div class="flex">
				<label class="flex items-center mr-3">
					<span class="text-sm pr-1">{{ spanText }}</span>
					<select name="date" id="dateRange" @change="changeIncrement()">
						<option value="1">Last 30 Days</option>
            <option value="2">Last 3 Months</option>
            <option value="3">Last 6 Months</option>
            <option value="4">Last 12 Months</option>
					</select>
				</label>
				<button 
				title="Graph type"
				:aria-label="type == 'line' ? 'Change to bar graph' : 'Change to line graph'"
				@click="type == 'line' ? type = 'bar' : type = 'line';"
				class="mr-3">
					<div class="w-[15px] mx-auto">
						<img v-if="type == 'line'" class="w-full" src="/assets/chart-line-light.svg" />
						<img v-if="type == 'bar'" class="w-full" src="/assets/chart-column-light.svg" />
					</div>
					<div class="uppercase text-[10px]">Graph Type</div>
				</button>
<!--				<button :aria-label="graphIncrement" class="mr-3">-->
<!--					<div class="w-[15px] mx-auto"><img class="w-full" src="/assets/sliders-light.svg" /></div>-->
<!--					<div class="uppercase text-[10px]">Adjust</div>-->
<!--				</button>-->
			</div>
		</div>
		<div class="relative h-[180px] w-full" >
			<canvas ref="graph" id="myGraph"></canvas>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, reactive, computed } from '@vue/composition-api'
import moment from "moment"

export default defineComponent({
	name: "Graph",
	props:{
		chartType:{
			type: String,
			default: "line"
		},
    defaultLabels:{
      type:Array
    },
    defaultNewIssues:{
      type: Array
    },
    defaultResIssues:{
      type: Array
    }
	},
  data(){
    return{
      dateRange:"Last 30 Days",
      graphLabels:null,
      secondSelectIssues:[],
      firstSelectIssues:[],
      firstSelectStatus:'Resolved',
      secondSelectStatus:'New',
      currentChartType:''
    }
  },
	setup(props) {
		const first_select = ref("Resolved")
		const second_select = ref("New")
		const type = ref(props.chartType)

		const chartData = ref({
			labels: props.defaultLabels,
			datasets: [
				{
					label: 'New',
					backgroundColor: '#9c0800',
					borderColor: '#9c0800',
					data: props.defaultNewIssues,
				},
				{
					label: 'Resolved',
					backgroundColor: '#004458',
					borderColor: '#004458',
					data: props.defaultResIssues,
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
					},
          scales:{
            y:{
              beginAtZero: true
            },
            x:{
              beginAtZero:true
            }
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

		return { chartData, config, lineChart, graph, first_select, second_select, type }
	},
	methods:{
    changeIncrement(type){
      let increment = document.getElementById('dateRange')
      let currentFirstSelectStatus = first_select.value
      let currentSecondSelectStatus = second_select.value
      let lastThirtyDays = [...new Array(30)].map((i, idx) => moment().startOf("day").subtract(idx, "days").format('MM-DD'))
      let lastThreeMonths = [...new Array(3)].map((i, idx) => moment().startOf("month").subtract(idx, "months").format('MMMM'))
      let lastSixMonths = [...new Array(6)].map((i, idx) => moment().startOf("month").subtract(idx, "months").format('MMMM'))
      let lastTwelveMonths = [...new Array(12)].map((i, idx) => moment().startOf("month").subtract(idx, "months").format('MMMM'))
      let incrementValue = increment.value;

      //set this.secondSelectStatus before call this.aggregateSecondSelectedIssues
      this.firstSelectStatus = currentFirstSelectStatus
      this.secondSelectStatus = currentSecondSelectStatus
      let allSecondSelectedIssues = this.aggregateSecondSelectedIssues
      let allFirstSelectedIssues = this.aggregateFirstSelectedIssues

      if(incrementValue == 1){
        this.dateRange = 'Last 30 Days'
        this.getChartData(lastThirtyDays, allSecondSelectedIssues, allFirstSelectedIssues)
      }
      if(incrementValue == 2){
        this.dateRange = 'Last 3 Months'
        this.getChartData2(lastThreeMonths, allSecondSelectedIssues, allFirstSelectedIssues)
      }
      if(incrementValue == 3){
        this.dateRange = 'Last 6 Months'
        this.getChartData2(lastSixMonths, allSecondSelectedIssues, allFirstSelectedIssues)
      }
      if(incrementValue == 4){
        this.dateRange = 'Last 12 Months'
        this.getChartData2(lastTwelveMonths, allSecondSelectedIssues, allFirstSelectedIssues)
      }
      //updating graph labels
        this.lineChart.config._config.data.labels = this.graphLabels
        //call chart update
        this.lineChart.update()

      return this.dateRange
    },
    getChartData(dateRange, newIssues, resIssues){
      this.graphLabels = dateRange.reverse();
      //create empty array with correct increments, assign it to selected issues
      this.secondSelectIssues = [...new Array(this.graphLabels.length)]
      //second select issues
      for(let i = 0; i <= this.graphLabels.length - 1; i++){
        let issueCount = 0
        for(let j = 0; j <= newIssues.length - 1; j++){
          let thisIssue = newIssues[j]
          let checkExp = thisIssue.date_created.slice(5,10)

          // console.log(checkExp +' '+ this.graphLabels[i])
          if(this.graphLabels[i] === checkExp){
            issueCount += 1;
          }else{
            issueCount += 0;
          }
          this.secondSelectIssues[i] = issueCount
        }
      }
      //end second select issues

      //first select issues
      //create empty array with correct increments, assign it to selected issues
      this.firstSelectIssues = [...new Array(this.graphLabels.length)]

      for(let i = 0; i <= this.graphLabels.length - 1; i++){
        let issueCount = 0;
        for(let j = 0; j <= resIssues.length - 1; j++){
          let thisIssue = resIssues[j]
          let checkExp = thisIssue.date_created.slice(5,10)

          // console.log(checkExp +' '+ this.graphLabels[i])
          if(this.graphLabels[i] === checkExp){
            issueCount += 1
          }else{
            issueCount += 0
          }
          this.firstSelectIssues[i] = issueCount
        }
      }
      //end first select issues
      // console.log(this.type)
      //   this.lineChart.config._config.type = this.type
        this.lineChart.config._config.data.datasets[0].data = this.secondSelectIssues
        this.lineChart.config._config.data.datasets[1].data = this.firstSelectIssues
        //call chart update
        this.lineChart.update()

    },
    getChartData2(dateRange, newIssues, resIssues){
      this.graphLabels = dateRange.reverse()
      //create empty array with correct increments, assign it to selected issues
      this.secondSelectIssues = [...new Array(this.graphLabels.length)]

      //start second selected issues
      for(let i = 0; i <= this.graphLabels.length - 1; i++){
        let issueCount = 0
        for(let j = 0; j <= newIssues.length - 1; j++){
          let thisIssue = newIssues[j]
          let checkExp = thisIssue.date_created.slice(5,7)
          //formatting the month to match the graphLabels in order to see if they match
          switch (checkExp){
            case '01':
              checkExp = 'January'
              break
            case '02':
              checkExp = 'February'
              break
            case '03':
              checkExp = 'March'
              break
            case '04':
              checkExp = 'April'
              break
            case '05':
              checkExp = 'May'
              break
            case '06':
              checkExp = 'June'
              break
            case '07':
              checkExp = 'July'
              break
            case '08':
              checkExp = 'August'
              break
            case '09':
              checkExp = 'September'
              break
            case '10':
              checkExp = 'October'
              break
            case '11':
              checkExp = 'November'
              break
            case '12':
              checkExp = 'December'
              break
            default:
              checkExp = 'October'
          }
          // console.log(checkExp +' '+ this.graphLabels[i])
          if(this.graphLabels[i] === checkExp){
            issueCount += 1
          }else{
            issueCount += 0
          }
          this.secondSelectIssues[i] = issueCount
        }
      }
      //end second selected issues

      //start first selected issues
      //create empty array with correct increments, assign it to selected issues
      this.firstSelectIssues = [...new Array(this.graphLabels.length)]

      for(let i = 0; i <= this.graphLabels.length - 1; i++){
        let issueCount = 0
        for(let j = 0; j <= resIssues.length - 1; j++){
          let thisIssue = resIssues[j]
          let checkExp = thisIssue.date_created.slice(5,7)

          //formatting the month to match the graphLabels in order to see if they match
          switch (checkExp){
            case '01':
              checkExp = 'January'
              break
            case '02':
              checkExp = 'February'
              break
            case '03':
              checkExp = 'March'
              break
            case '04':
              checkExp = 'April'
              break
            case '05':
              checkExp = 'May'
              break
            case '06':
              checkExp = 'June'
              break
            case '07':
              checkExp = 'July'
              break
            case '08':
              checkExp = 'August'
              break
            case '09':
              checkExp = 'September'
              break
            case '10':
              checkExp = 'October'
              break
            case '11':
              checkExp = 'November'
              break
            case '12':
              checkExp = 'December'
              break
            default:
              checkExp = 'October'
          }
          // console.log(checkExp +' '+ this.graphLabels[i])
          if(this.graphLabels[i] === checkExp){
            issueCount += 1
          }else{
            issueCount += 0
          }
          this.firstSelectIssues[i] = issueCount
        }
      }
      //end first selected issues
        this.lineChart.config._config.data.datasets[0].data = this.secondSelectIssues
        this.lineChart.config._config.data.datasets[1].data = this.firstSelectIssues
        //call chart update
        this.lineChart.update()
    },
	},
  computed:{
    aggregateSecondSelectedIssues(){
      let issuesObject = this.$store.state.audits.audit.issues
      let issues = issuesObject.filter(item =>{
        return item.status === this.secondSelectStatus
      })

      //right now (11/4/22) the automated scan feature doesn't include this date_created prop,
      //we'll add it but all legacy entries will need to be filtered through this or
      //changed to a single date by a sql query or something
      let issuesWithDates = issues.filter(issue =>{
        return issue.date_created !== null
      })
      return issuesWithDates
    },
    aggregateFirstSelectedIssues(){
      let issuesObject = this.$store.state.audits.audit.issues
      let issues = issuesObject.filter(item =>{
        return item.status === this.firstSelectStatus
      })

      //right now (11/4/22) the automated scan feature doesn't include this date_created prop,
      //we'll add it but all legacy entries will need to be filtered through this or
      //changed to a single date by a sql query or something
      let issuesWithDates = issues.filter(issue =>{
        return issue.date_created !== null
      })
      return issuesWithDates
    },
    spanText(){
      //text that gets displayed next to date selector
      let todayDays = moment().format('MM/DD/YYYY')
      let todayMonths = moment().format('MM/YYYY')
      let thirtyDaysPrior = moment().subtract(29, 'days').format('MM/DD/YYYY')
      let threeMonthsPrior = moment().subtract(2, 'months').format('MM/YYYY')
      let sixMonthsPrior = moment().subtract(5, 'months').format('MM/YYYY')
      let twelveMonthsPrior = moment().subtract(11, 'months').format('MM/YYYY')

      if (this.dateRange == 'Last 30 Days'){
        return `${thirtyDaysPrior}-${todayDays}`
      }else if(this.dateRange == 'Last 3 Months'){
        return `${threeMonthsPrior}-${todayMonths}`
      }else if(this.dateRange == 'Last 6 Months'){
        return `${sixMonthsPrior}-${todayMonths}`
      }else {
        return `${twelveMonthsPrior}-${todayMonths}`
      }
    }
  },
  created(){
  }
})
</script>
