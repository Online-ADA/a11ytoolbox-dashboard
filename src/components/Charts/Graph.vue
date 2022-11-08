<template>
	<div class="p-3">
<!--      -->
		<div class="flex justify-between items-center ">
			<!-- left buttons -->
			<div class="flex items-center">
<!--				{{ test() }}-->
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
				@click="type == 'line' ? type = 'bar' : type = 'line'" 
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
import { defineComponent, ref, onMounted, watch, reactive, computed } from '@vue/composition-api';
import moment from "moment";

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
      newIssues:[],
      resolvedIssues:[]
    }
  },
	setup(props) {
		const first_select = ref("resolved")
		const second_select = ref("new")
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
    changeIncrement(){
      let increment = document.getElementById('dateRange');
      let lastThirtyDays = [...new Array(30)].map((i, idx) => moment().startOf("day").subtract(idx, "days").format('MM-DD'));
      let lastThreeMonths = [...new Array(3)].map((i, idx) => moment().startOf("month").subtract(idx, "months").format('MMMM'));
      let lastSixMonths = [...new Array(6)].map((i, idx) => moment().startOf("month").subtract(idx, "months").format('MMMM'));
      let lastTwelveMonths = [...new Array(12)].map((i, idx) => moment().startOf("month").subtract(idx, "months").format('MMMM'));
      let incrementValue = increment.value;
      let allNewIssues = this.aggregateNewIssues;
      let allResIssues = this.aggregateResolvedIssues;

      if(incrementValue == 1){
        this.dateRange = 'Last 30 Days';
        this.getChartData(lastThirtyDays, allNewIssues, allResIssues)
      }
      if(incrementValue == 2){
        this.dateRange = 'Last 3 Months';
        this.getChartData2(lastThreeMonths, allNewIssues, allResIssues)
      }
      if(incrementValue == 3){
        this.dateRange = 'Last 6 Months';
        this.getChartData2(lastSixMonths, allNewIssues, allResIssues)
      }
      if(incrementValue == 4){
        this.dateRange = 'Last 12 Months';
        this.getChartData2(lastTwelveMonths, allNewIssues, allResIssues)
      }
      //updating graph labels--this returns a promise? settimeout makes it work
      setTimeout(()=>{
        this.lineChart.config._config.data.labels = this.graphLabels;
        //call chart update
        this.lineChart.update();
      }, 100)

      return this.dateRange;
    },
    getChartData(dateRange, newIssues, resIssues){
      this.graphLabels = dateRange.reverse();
      //create empty array with correct increments, assign it to new issues
      this.newIssues = [...new Array(this.graphLabels.length)];

      //new issues
      for(let i = 0; i <= this.graphLabels.length - 1; i++){
        let issueCount = 0;
        for(let j = 0; j <= newIssues.length - 1; j++){
          let thisIssue = newIssues[j];
          let checkExp = thisIssue.date_created.slice(5,10);

          // console.log(checkExp +' '+ this.graphLabels[i]);
          if(this.graphLabels[i] === checkExp){
            issueCount += 1;
          }else{
            issueCount += 0;
          }
          this.newIssues[i] = issueCount;
        }
      }
      //end new issues

      //resolved issues
      //create empty array with correct increments, assign it to resolved issues
      this.resolvedIssues = [...new Array(this.graphLabels.length)];

      for(let i = 0; i <= this.graphLabels.length - 1; i++){
        let issueCount = 0;
        for(let j = 0; j <= resIssues.length - 1; j++){
          let thisIssue = resIssues[j];
          let checkExp = thisIssue.date_created.slice(5,10);

          // console.log(checkExp +' '+ this.graphLabels[i]);
          if(this.graphLabels[i] === checkExp){
            issueCount += 1;
          }else{
            issueCount += 0;
          }
          this.resolvedIssues[i] = issueCount;
        }
      }
      setTimeout(()=>{
        this.lineChart.config._config.data.datasets[0].data = this.newIssues;
        this.lineChart.config._config.data.datasets[1].data = this.resolvedIssues;
        //call chart update
        this.lineChart.update();
      }, 100)
      //end resolved issues
    },
    getChartData2(dateRange, newIssues, resIssues){
      this.graphLabels = dateRange.reverse();
      //create empty array with correct increments, assign it to new issues
      this.newIssues = [...new Array(this.graphLabels.length)];

      //start new issues
      for(let i = 0; i <= this.graphLabels.length - 1; i++){
        let issueCount = 0;
        for(let j = 0; j <= newIssues.length - 1; j++){
          let thisIssue = newIssues[j];
          let checkExp = thisIssue.date_created.slice(5,7);
          //formatting the month to match the graphLabels in order to see if they match
          switch (checkExp){
            case '01':
              checkExp = 'January';
              break;
            case '02':
              checkExp = 'February';
              break;
            case '03':
              checkExp = 'March';
              break;
            case '04':
              checkExp = 'April';
              break;
            case '05':
              checkExp = 'May';
              break;
            case '06':
              checkExp = 'June';
              break;
            case '07':
              checkExp = 'July';
              break;
            case '08':
              checkExp = 'August';
              break;
            case '09':
              checkExp = 'September';
              break;
            case '10':
              checkExp = 'October';
              break;
            case '11':
              checkExp = 'November';
              break;
            case '12':
              checkExp = 'December';
              break;
            default:
              checkExp = 'October'
          }
          // console.log(checkExp +' '+ this.graphLabels[i]);
          if(this.graphLabels[i] === checkExp){
            issueCount += 1;
          }else{
            issueCount += 0;
          }
          this.newIssues[i] = issueCount;
        }
      }
      //end new issues
      //start resolved issues
      //create empty array with correct increments, assign it to resolved issues
      this.resolvedIssues = [...new Array(this.graphLabels.length)];

      for(let i = 0; i <= this.graphLabels.length - 1; i++){
        let issueCount = 0;
        for(let j = 0; j <= resIssues.length - 1; j++){
          let thisIssue = resIssues[j];
          let checkExp = thisIssue.date_created.slice(5,7);

          //formatting the month to match the graphLabels in order to see if they match
          switch (checkExp){
            case '01':
              checkExp = 'January';
              break;
            case '02':
              checkExp = 'February';
              break;
            case '03':
              checkExp = 'March';
              break;
            case '04':
              checkExp = 'April';
              break;
            case '05':
              checkExp = 'May';
              break;
            case '06':
              checkExp = 'June';
              break;
            case '07':
              checkExp = 'July';
              break;
            case '08':
              checkExp = 'August';
              break;
            case '09':
              checkExp = 'September';
              break;
            case '10':
              checkExp = 'October';
              break;
            case '11':
              checkExp = 'November';
              break;
            case '12':
              checkExp = 'December';
              break;
            default:
              checkExp = 'October'
          }
          // console.log(checkExp +' '+ this.graphLabels[i]);
          if(this.graphLabels[i] === checkExp){
            issueCount += 1;
          }else{
            issueCount += 0;
          }
          this.resolvedIssues[i] = issueCount;
        }
      }
      // end resolved issues
      setTimeout(()=>{
        this.lineChart.config._config.data.datasets[0].data = this.newIssues;
        this.lineChart.config._config.data.datasets[1].data = this.resolvedIssues;
        //call chart update
        this.lineChart.update();
      }, 100)
    }
	},
  computed:{
    aggregateNewIssues(){
      let issuesObject = this.$store.state.audits.audit.issues;
      // let status = ref('first-select')
      console.log(ref('first-select').value)

      let newIssues = issuesObject.filter(item =>{
        return item.status === 'New';
      })

      //right now (11/4/22) the automated scan feature doesn't include this date_created prop,
      //we'll add it but all legacy entries will need to be filtered through this or
      //changed to a single date by a sql query or something
      let issuesWithDates = newIssues.filter(issue =>{
        return issue.date_created !== null;
      })
      return issuesWithDates;
    },
    aggregateResolvedIssues(){
      let issuesObject = this.$store.state.audits.audit.issues;
      let resolvedIssues = issuesObject.filter(item =>{
        return item.status === 'Resolved';
      })

      //right now (11/4/22) the automated scan feature doesn't include this date_created prop,
      //we'll add it but all legacy entries will need to be filtered through this or
      //changed to a single date by a sql query or something
      let issuesWithDates = resolvedIssues.filter(issue =>{
        return issue.date_created !== null;
      })
      return issuesWithDates;
    },
    spanText(){
      //text that gets displayed next to date selector
      let today = moment().format('MM/DD/YYYY');
      let thirtyDaysPrior = moment().subtract(30, 'days').format('MM/DD/YYYY');
      let threeMonthsPrior = moment().subtract(3, 'months').format('MM/DD/YYYY');
      let sixMonthsPrior = moment().subtract(6, 'months').format('MM/DD/YYYY');
      let twelveMonthsPrior = moment().subtract(12, 'months').format('MM/DD/YYYY');

      if (this.dateRange == 'Last 30 Days'){
        return `${thirtyDaysPrior}-${today}`;
      }else if(this.dateRange == 'Last 3 Months'){
        return `${threeMonthsPrior}-${today}`;
      }else if(this.dateRange == 'Last 6 Months'){
        return `${sixMonthsPrior}-${today}`;
      }else {
        return `${twelveMonthsPrior}-${today}`;
      }
    },
  },
  created(){

  }

})
</script>
