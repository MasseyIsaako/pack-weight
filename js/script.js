var app = new Vue({
	el: '#app',
	data: {
		weightData: [],
		packGoal: [],
		toggleOverlay: false,
		chartTitle: 'Weight vs Time',
		chartSubitle: 'Kilograms vs Days',
		buttonText: 'More info'
	},
	mounted: function() {
		this.setWeightData();
		this.initMap();
		this.doPopulatePackWeightText();
	},
	methods: {
		/**
		 * Set data
		 */
		setWeightData() {
			// Contains all the data per person. Day is the axis, the other strings in the initial array describe the individual
			// lines on the graph. The integers are the values that are being plotted
			var recordedWeightData = [
				['Day', 'Taase', 'Valasi', 'Manu', 'Cochise', 'Thomas', 'Tumema', 'Lasi', 'Freida', 'Annie', 'Baseline'],
				[0,		115,	  118,		126,	 153,	    112,	 131,	   112,	   126, 	 104,	 80],
				[5,		107.9,	  113.3,	121,	 146,	    106.3,	 124.6,	   106.3,	119.2, 	 98,	 80],
				// [5,		110,	  115,		118,	 147,	    108,	 126,	   108,	   120, 	 100,	 80]
			];

			// Our goal weight
			var goalWeightData = [
				90, 	// Taase
				100,	// Valasi
				95,		// Manu
				110,	// Cochise
				105,	// Thomas
				100,	// Tumema
				90,		// Lasi
				95,		// Freida
				90		// Annie
			];

			// Set data
			this.weightData = recordedWeightData;
			this.packGoal = goalWeightData;
		},

		/**
		 * Initialise the google map
		 * 
		 * @return void
		 */
		initMap() {
			google.charts.load('current', {
				'packages': 
					[
						'line'
					]
				}
			);

			google.charts.setOnLoadCallback(this.drawChart);
		},

		/**
		 * Draw the Chart
		 * 
		 * @return void
		 */
		drawChart() {
			var data = google.visualization.arrayToDataTable(this.weightData);
			var options = {
		      curveType: 'function',
		      legend: {
		      	position: 'bottom'
		      },
		    };

			var chart = new google.charts.Line(document.querySelector('#chart__element'));

			chart.draw(data, google.charts.Line.convertOptions(options));
		},

		/**
		 * Toggle function for the more information window pane
		 * 
		 * @return void
		 */
		toggle() {
			var button = document.querySelector('#chart__more-info');

			if (this.toggleOverlay) {
				this.chartTitle = 'Weight vs Time';
				this.chartSubitle = 'Kilograms vs Days'
				this.buttonText = 'More info';
			} else {
				this.chartTitle = 'Pack Weight';
				this.chartSubitle = 'Other Statistics'
				this.buttonText = 'Less info';
			}

			this.toggleOverlay = !this.toggleOverlay;
		},

		/**
		 * Populate the dropdown overlay with pack weight text
		 * 
		 * @return void
		 */
		doPopulatePackWeightText() {
			// Start date data
			var startTextElement = document.querySelector('#start-date');
			var startDate = '20/5/2019';

			// Date data
			var currentDate = new Date();
			var currentDateTextElement = document.querySelector('#current-date');

			// Current pack weight data
			var currentPackWeightText = document.querySelector('#pack-weight-current');

			// Goal pack weight data
			var goalWeightText = document.querySelector('#pack-weight-goal');

			// Pack weight difference between current and goal
			var diffWeightText = document.querySelector('#pack-weight-difference');

			// Weight text
			currentPackWeightText.innerHTML = `${this.getPackWeightCurrent()}<span class="chart__text chart__text--small">kg</span>`;
			goalWeightText.innerHTML = `${this.getPackWeightGoal()}<span class="chart__text chart__text--small">kg</span>`;
			diffWeightText.innerHTML = `${this.getPackWeightDifference()}<span class="chart__text chart__text--small">kg</span>`;

			// Date text
			startTextElement.innerText = `${startDate}`
			currentDateTextElement.innerText = `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getYear() + 1900}`;
		},
			
		/**
		 * Get the combined weight of all participants
		 * 
		 * @return integer
		 */
		getPackWeightCurrent() {
			// Retrieve last entry in  arraylist
			var currentWeightData = this.weightData.slice();
			var weightTotal = 0;
			var baseline = 80;

			// Sanitise the data: get rid of the outer arrays
			currentWeightData = currentWeightData.pop();
			console.log(currentWeightData);

			// Get the array directly and remove the outer items (they are used for axis and baseline values)
			currentWeightData.forEach(function (item) {
				weightTotal += item;
			});

			weightTotal = weightTotal - baseline;

			return weightTotal.toFixed(1);
		},
			
		/**
		 * Retrieve the goal weight
		 * 
		 * @return integer
		 */
		getPackWeightGoal() {
			var total = 0;
			var goalWeightData = this.packGoal.slice();

			goalWeightData.forEach(function(item) {
				total += item;
			});

			return total;
		},

		/**
		 * Get the different between the current pack weight and the goal pack weight.
		 * 
		 * @return integer
		 */
		getPackWeightDifference() {
			var currentPackWeight = this.getPackWeightCurrent();
			var goalPackWeight = this.getPackWeightGoal();

			return (currentPackWeight - goalPackWeight).toFixed(1);
		},
	},
});