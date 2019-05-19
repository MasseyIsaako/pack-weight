google.charts.load('current', {
	'packages': 
		[
			'line'
		]
	}
);

google.charts.setOnLoadCallback(drawChart);

// Contains all the data per person. Day is the axis, the other strings in the initial array describe the individual
// lines on the graph. The integers are the values that are being plotted
var recordedWeightData = [
	['Day', 'Taase', 'Valasi', 'Manu', 'Cochise', 'Thomas', 'Tumema', 'Lasi', 'Freida', 'Annie', 'Baseline'],
	[0,		115,	  118,		126,	 153,	    112,	 131,	   112,	   126, 	 104,	 80],
	[1,		115,	  118,		126,	 153,	    112,	 131,	   112,	   126, 	 104,	 80],
	// [5,		110,	  115,		118,	 147,	    108,	 126,	   108,	   120, 	 100,	 80]
];

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

// Toggling the overlay using this boolean
var toggleOverlay = false;

// Add the event listener (click) for the toggling of the more information
document.querySelector('#chart__more-info').addEventListener('click', toggle);

// Start date
var startDate = '20/4/2019';

/**
 * Draw the Chart
 * 
 * @return void
 */
function drawChart() {
	var data = google.visualization.arrayToDataTable(recordedWeightData);

	var options = {
      curveType: 'function',
      legend: {
      	position: 'bottom'
      },
    };

	var chart = new google.charts.Line(document.querySelector('#chart__element'));

	chart.draw(data, google.charts.Line.convertOptions(options));
}

/**
 * Toggle function for the more information window pane
 * 
 * @return void
 */
function toggle() {
	// The overlay element in the DOM
	var overlay = document.querySelector('.overlay');

	if (!toggleOverlay) {
		var button = document.querySelector('#chart__more-info');
		
		// Start date data
		var startTextElement = document.querySelector('#start-date');

		// Current date data
		var currentDate = new Date();

		var currentDateTextElement = document.querySelector('#current-date');

		// Current pack weight data
		var currentPackWeightText = document.querySelector('#pack-weight-current');
		var packWeightCurrent = getPackWeightCurrent();

		// Goal pack weight data
		var goalWeightText = document.querySelector('#pack-weight-goal');
		var packWeightGoal = getPackWeightGoal();

		// Pack weight difference between current and goal
		var diffWeightText = document.querySelector('#pack-weight-difference');
		var packWeightDiff = getPackWeightDifference();

		// Toggle the dropdown
		overlay.classList.add('overlay--open');

		// Set information
		button.innerText = 'Less info';

		// Weight text
		currentPackWeightText.innerHTML = `${packWeightCurrent}<span class="chart__text chart__text--small">kg</span>`
		goalWeightText.innerHTML = `${packWeightGoal}<span class="chart__text chart__text--small">kg</span>`;
		diffWeightText.innerHTML = `${packWeightDiff}<span class="chart__text chart__text--small">kg</span>`;

		// Date text
		startTextElement.innerText = `${startDate}`
		currentDateTextElement.innerText = `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getYear() + 1900}`;
	} else {
		overlay.classList.remove('overlay--open');

		// Wait 0.2s before reloading page
		setTimeout(function() {
			location.reload();
		}, 200);
	}

	toggleOverlay = !toggleOverlay;
}
	
/**
 * Get the combined weight of all participants
 * 
 * @return integer
 */
function getPackWeightCurrent() {
	// Retrieve last entry in recordedWeightData arraylist
	var latestData = recordedWeightData.pop();
	var weightTotal = 0;

	// Sanitise the data
	latestData.pop();
	latestData.shift();

	latestData.forEach(function (item) {
		weightTotal += item;
	});

	return weightTotal;
}
	
/**
 * Retrieve the goal weight
 * 
 * @return integer
 */
function getPackWeightGoal() {
	var total = 0;

	goalWeightData.forEach(function(item) {
		total += item;
	});

	return total;
}

/**
 * Get the different between the current pack weight and the goal pack weight.
 * 
 * @return integer
 */
function getPackWeightDifference() {
	var currentPackWeight = getPackWeightCurrent();
	var goalPackWeight = getPackWeightGoal();

	return currentPackWeight - goalPackWeight;
}