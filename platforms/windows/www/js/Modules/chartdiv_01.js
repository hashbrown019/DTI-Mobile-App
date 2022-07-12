
try{
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		console.log(cordova.file);
		println(" * load_chartdiv_01 Module Ready ================================");
		 load_chartdiv_01()
	}
}catch(err){println(err)}


function load_chartdiv_01(){
	am5.ready(function() {

		// Create root element
		// https://www.amcharts.com/docs/v5/getting-started/#Root_element
		var root = am5.Root.new("chartdiv_01");
		println("STARTING CHARTS --------------------------")
		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([
			am5themes_Animated.new(root)
		]);

		// Create chart
		// https://www.amcharts.com/docs/v5/charts/radar-chart/
		var chart = root.container.children.push(am5radar.RadarChart.new(root, {
			truncate : true,
			panX: false,
			panY: false,
			wheelX: "panX",
			wheelY: "zoomX",
			innerRadius: am5.percent(20),
			startAngle: -90,
			endAngle: 180
		}));


		// Data
		var data = [{
			category: "Cacao",
			value: 80,
			full: 100,
			columnSettings: {
				fill: chart.get("colors").getIndex(0)
			}
		}, {
			category: "Coffee",
			value: 35,
			full: 100,
			columnSettings: {
				fill: chart.get("colors").getIndex(1)
			}
		}, {
			category: "Coconut",
			value: 92,
			full: 100,
			columnSettings: {
				fill: chart.get("colors").getIndex(2)
			}
		}, {
			category: "Processed Foods and nuts",
			value: 68,
			full: 100,
			columnSettings: {
				fill: chart.get("colors").getIndex(3)
			}
		}];

		// Add cursor
		// https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
		var cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
			behavior: "zoomX"
		}));

		cursor.lineY.set("visible", false);

		// Create axes and their renderers
		// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
		var xRenderer = am5radar.AxisRendererCircular.new(root, {
			//minGridDistance: 50
		});

		xRenderer.labels.template.setAll({
			truncate : true,
			radius: 10
		});

		xRenderer.grid.template.setAll({
			truncate : true,
			forceHidden: true
		});

		var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
			renderer: xRenderer,
			truncate : true,
			min: 0,
			max: 100,
			strictMinMax: true,
			numberFormat: "#'%'",
			tooltip: am5.Tooltip.new(root, {})
		}));


		var yRenderer = am5radar.AxisRendererRadial.new(root, {
			truncate : true,
			minGridDistance: 20
		});

		yRenderer.labels.template.setAll({
			centerX: am5.p100,
			fontWeight: "400",
			fontSize: 9,
			truncate : true,
			templateField: "columnSettings"
		});

		yRenderer.grid.template.setAll({
			forceHidden: true,
			truncate : true
		});

		var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
			categoryField: "category",
			renderer: yRenderer,
			truncate : true,
		}));

		yAxis.data.setAll(data);


		// Create series
		// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
		var series1 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
			xAxis: xAxis,
			yAxis: yAxis,
			clustered: false,
			valueXField: "full",
			categoryYField: "category",
			truncate : true,
			fill: root.interfaceColors.get("alternativeBackground")
		}));

		series1.columns.template.setAll({
			width: am5.p100,
			fillOpacity: 0.08,
			strokeOpacity: 0,
			truncate : true,
			cornerRadius: 20
		});

		series1.data.setAll(data);


		var series2 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
			xAxis: xAxis,
			yAxis: yAxis,
			clustered: false,
			valueXField: "value",
			truncate : true,
			categoryYField: "category"
		}));

		series2.columns.template.setAll({
			width: am5.p100,
			strokeOpacity: 0,
			tooltipText: "{category}: {valueX}%",
			cornerRadius: 20,
			truncate : true,
			templateField: "columnSettings"
		});

		series2.data.setAll(data);

		// Animate chart and series in
		// https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
		series1.appear(1000);
		series2.appear(1000);
		chart.appear(1000, 100);

	});

}
