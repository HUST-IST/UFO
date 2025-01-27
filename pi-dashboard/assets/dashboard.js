/*!
 * Pi Dashboard (http://www.nxez.com)
 * Copyright 2017 NXEZ.com.
 * Licensed under the GPL v3.0 license.
 */

$(document).ready(function() {

	Highcharts.setOptions({
		global: {
			useUTC: false
		},
		credits: {
			enabled: false
		},
		navigation: {
			buttonOptions: {
				enabled: false
			}
		}
	});

	var chart = {      
		type: 'gauge',
		plotBorderWidth: 5,
		plotBackgroundColor: {
		   linearGradient: { x1: 0, y1: 0},
		   stops: [
			  [0, '#FFF4C6'],
			  [0.3, '#FFFFFF'],
			  [1, '#FFF4C6']
		   ]
		},
		plotBackgroundImage: null,
		height: 210
	 };
	 var credits = {
		enabled: false
	 };

	 var title = null;
  
	 var pane = [{
		   startAngle: -80,
		   endAngle: 80,
		   background: null,
		   center: ['50%', '95%'],
		   size: 300
	 }];
  
	 var yAxis = [{
		   min: -20,
		   max: 80,
		   minorTickPosition: 'outside',
		   tickPosition: 'outside',
		   labels: {
			  rotation: 'auto',
			  distance: -10
		   },
		   plotBands: [{
			  from: 20,
			  to: 80,
			  color: '#C02316',
			  innerRadius: '100%',
			  outerRadius: '105%'
		   }],
		   pane: 0,
		   title: {
			  text: '<strong>MIC<br/></strong>',
			  y: -40
		   }
	 }];
	 
	 var plotOptions = {
		gauge: {
			  dataLabels: {
			  enabled: false
		   },
		   dial: {
			  radius: '90%'
		   }
		}
	 };
	 var series= [{
		  data: [-20],
		  yAxis: 0
	 }];     
		
	 var json = {};   
	 json.chart = chart; 
	 json.credits = credits;
	 json.title = title;       
	 json.pane = pane; 
	 json.yAxis = yAxis; 
	 json.plotOptions = plotOptions;  
	 json.series = series;      

	var gaugeOptions = {
		chart: {
			type: "solidgauge"
		},
		title: null,
		pane: {
			center: ["50%", "85%"],
			size: "140%",
			startAngle: -90,
			endAngle: 90,
			background: {
				backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || "#FFFFFF",
				innerRadius: "60%",
				outerRadius: "100%",
				shape: "arc"
			}
		},
		tooltip: {
			enabled: false
		},
		yAxis: {
			stops: [
				[0.1, "#55BF3B"],
				[0.5, "#DDDF0D"],
				[0.9, "#DF5353"]
			],
			lineWidth: 0,
			minorTickInterval: null,
			tickAmount: 2,
			title: {
				y: -70
			},
			labels: {
				y: 16
			}
		},
		plotOptions: {
			solidgauge: {
				dataLabels: {
					y: 5,
					borderWidth: 0,
					useHTML: true
				}
			}
		}
	};
	var chartCPU = Highcharts.chart("container-cpu", Highcharts.merge(gaugeOptions, {
		yAxis: {
			min: 0,
			max: 100,
			title: {
				text: ""
			}
		},
		series: [{
			name: "CPU",
			data: [0],
			dataLabels: {
				format: '<div style="text-align:center"><span style="font-size:28px;color:' + ((Highcharts.theme && Highcharts.theme.contrastTextColor) || "black") + '">{y}</span>' + '<span style="font-size:12px;color:silver">%</span></div>'
			},
			tooltip: {
				valueSuffix: " %"
			}
		}]
	}));
	var chartRAM = Highcharts.chart("container-mem", Highcharts.merge(gaugeOptions, {
		yAxis: {
			min: 0,
			max: init_vals.mem.total,
			title: {
				text: ""
			}
		},
		series: [{
			name: "MEMORY",
			data: [0],
			dataLabels: {
				format: '<div style="text-align:center"><span style="font-size:25px;color:' + ((Highcharts.theme && Highcharts.theme.contrastTextColor) || "black") + '">{y:.1f}</span><br/>' + '<span style="font-size:12px;color:silver">MB</span></div>'
			},
			tooltip: {
				valueSuffix: " MB"
			}
		}]
	}));
	
	var chartNetInterfaces = new Array();
	var net_In = new Array();
	var net_Out = new Array();
	for (i = 0; i < init_vals.net.count; i++) {
		var chartNetInterface = Highcharts.chart("container-net-interface-" + (i + 1), {
			title: {
				text: ""
			},
			legend: {
				enabled: false
			},
			xAxis: {
				categories: [],
				title: {
					text: ""
				}
			},
			yAxis: {
				title: {
					text: "",
					style: {
						fontWeight: "normal"
					}
				}
			},
			series: [{
				name: "IN",
				data: [0],
				color: "#093AC9",
				marker: {
					enabled: false
				}
			}, {
				name: "OUT",
				data: [0],
				color: "#3CCB3E",
				marker: {
					enabled: false
				}
			}]
		});
		chartNetInterfaces[i] = chartNetInterface;
		net_In[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		net_Out[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	}
	var init_halb_width = ($(".container-circle").width())/2;
	setInterval(function() {
		$.getJSON("?ajax=true", function(data) {
			var newDate = new Date();
			newDate.setTime(parseInt(data.time) * 1000);
			$("#time").text(newDate.format('hh:mm:ss'));
			$("#date").text(newDate.format('yyyy-MM-dd'));
			$("#uptime").text(uptimeFormat(data.uptime));
			$("#cpu-temp").text(Math.round(data.cpu.temp/1000 * Math.pow(10,1))/Math.pow(10,1));
			$("#mem-percent").text(data.mem.percent);
			$("#mem-free").text(data.mem.free);
			$("#mem-cached").text(data.mem.cached);
			$("#mem-swap-total").text(data.mem.swap.total);
			$("#loadavg-1m").text(data.load_avg[0]);
			$("#loadavg-5m").text(data.load_avg[1]);
			$("#loadavg-10m").text(data.load_avg[2]);
			$("#loadavg-running").text(data.load_avg[3].split("/")[0]);
			$("#loadavg-threads").text(data.load_avg[3].split("/")[1]);

			$("#net-interface-1-total-in").text(data.shm_data.EZ0_1);
			$("#net-interface-1-total-out").text(data.shm_data.EZ0_2);
			$("#net-interface-2-total-in").text(data.shm_data.TOF1);
			$("#net-interface-2-total-out").text(data.shm_data.TOF2);
			$("#net-interface-3-total-in").text(bytesRound(parseInt(data.net.interfaces[2].total_in), 2));
			$("#net-interface-3-total-out").text(bytesRound(parseInt(data.net.interfaces[2].total_out), 2));
			if (window.dashboard != null)window.dashboard_old = window.dashboard;
			window.dashboard = data;
		});
		$(".btn").css({"background-color": "#000000"});
		if (window.dashboard != null) 
		{
			if(window.dashboard.shm_open == 1)console.log("shared memory opened error");
			if(window.dashboard.shm_read == 1)console.log("shared memory read error");
			//console.log(window.dashboard.shm_data);

			//中心点横坐标
			var dotLeft = ($(".container-circle").width()-$(".dot").width())/2;
			var dotTop = ($(".container-circle").height()-$(".dot").height())/2;
			//网页因界面的大小变化使图片产生了拉伸，数据点的偏移量需要补偿
			var difference = (($(".container-circle").width())/2 - init_halb_width) * 0.707;
			if(window.dashboard.shm_data.RPLidar_Zahl < 200) 
			{
				var RPLidar_Data = new Array(300);
				//半径
				for (var i=0;i<RPLidar_Data.length;i++)RPLidar_Data[i] = 0;
				//每一个BOX对应的角度;
				var avd = 360/RPLidar_Data.length;
			}
			else 
			{
				//半径
				var RPLidar_Data = window.dashboard.shm_data.RPLidar_Abstand;
				//每一个BOX对应的角度;
				var avd = 360/window.dashboard.shm_data.RPLidar_Zahl;
			}
			//每一个BOX对应的弧度;
			var ahd = avd*0.01745329251;
			 
			//设置圆的中心点的位置
			$(".dot").css({"left": dotLeft,"top": dotTop});
            $(".point").each(function(index){$(this).css({"left":Math.sin((ahd*index))*(RPLidar_Data[index]+difference)+dotLeft,"top":Math.cos((ahd*index))*(RPLidar_Data[index]+difference)+dotTop});});

			if((window.dashboard.shm_data.THERMOL1 != 0)&&(window.dashboard.shm_data.THERMOL2 != 0)) 
			{
				for(var i = 0; i<16; i++){
					$(".btn"+(i+1)).css({"background-color": getColorByBaiFenBi(window.dashboard.shm_data.THERMOL1[i]*2)});
					$(".btn"+(17+i)).css({"background-color": getColorByBaiFenBi(window.dashboard.shm_data.THERMOL2[i]*2)});
				}
			}

			var point;
			if (chartRAM) 
			{
				point = chartRAM.series[0].points[0];
				point.update(window.dashboard.mem.used);
			}
			if (window.dashboard_old != null) 
			{
				if (window.dashboard_old.net.count > 0) 
				{
					for (i = 2; i < window.dashboard_old.net.count; i++) 
					{
						if (chartNetInterfaces[i].series[0].data.length >= 30) chartNetInterfaces[i].series[0].addPoint(parseInt(window.dashboard.net.interfaces[i].total_in) - parseInt(window.dashboard_old.net.interfaces[i].total_in), true, true);
						else chartNetInterfaces[i].series[0].addPoint(parseInt(window.dashboard.net.interfaces[i].total_in) - parseInt(window.dashboard_old.net.interfaces[i].total_in));
						if (chartNetInterfaces[i].series[1].data.length >= 30)chartNetInterfaces[i].series[1].addPoint(parseInt(window.dashboard.net.interfaces[i].total_out) - parseInt(window.dashboard_old.net.interfaces[i].total_out), true, true);
						else chartNetInterfaces[i].series[1].addPoint(parseInt(window.dashboard.net.interfaces[i].total_out) - parseInt(window.dashboard_old.net.interfaces[i].total_out));
					}
				}
				if (chartNetInterfaces[0].series[0].data.length >= 30) chartNetInterfaces[0].series[0].addPoint(window.dashboard.shm_data.EZ0_1, true, true);
				else chartNetInterfaces[0].series[0].addPoint(window.dashboard.shm_data.EZ0_1);
				if (chartNetInterfaces[0].series[1].data.length >= 30)chartNetInterfaces[0].series[1].addPoint(window.dashboard.shm_data.EZ0_2, true, true);
				else chartNetInterfaces[0].series[1].addPoint(window.dashboard.shm_data.EZ0_2);
				
				if (chartNetInterfaces[1].series[0].data.length >= 30) chartNetInterfaces[1].series[0].addPoint(window.dashboard.shm_data.TOF1, true, true);
				else chartNetInterfaces[1].series[0].addPoint(window.dashboard.shm_data.TOF1);
				if (chartNetInterfaces[1].series[1].data.length >= 30)chartNetInterfaces[1].series[1].addPoint(window.dashboard.shm_data.TOF2, true, true);
				else chartNetInterfaces[1].series[1].addPoint(window.dashboard.shm_data.TOF2);

				idle_diff = parseInt(window.dashboard.cpu.stat.idle) - parseInt(window.dashboard_old.cpu.stat.idle);
				used_total = parseInt(window.dashboard.cpu.stat.idle) + parseInt(window.dashboard.cpu.stat.user) + parseInt(window.dashboard.cpu.stat.sys) + parseInt(window.dashboard.cpu.stat.nice) + parseInt(window.dashboard.cpu.stat.iowait) + parseInt(window.dashboard.cpu.stat.irq) + parseInt(window.dashboard.cpu.stat.softirq) - parseInt(window.dashboard_old.cpu.stat.idle) - parseInt(window.dashboard_old.cpu.stat.user) - parseInt(window.dashboard_old.cpu.stat.sys) - parseInt(window.dashboard_old.cpu.stat.nice) - parseInt(window.dashboard_old.cpu.stat.iowait) - parseInt(window.dashboard_old.cpu.stat.irq) - parseInt(window.dashboard_old.cpu.stat.softirq);
				if (chartCPU)
				{
					point = chartCPU.series[0].points[0];
					point.update(Math.round((1 - (idle_diff / used_total)) * 100 * Math.pow(10, 1)) / Math.pow(10, 1));
				}
				$("#cpu-freq").text(window.dashboard.cpu.freq / 1000);
				$("#cpu-stat-idl").text(Math.round(((parseInt(window.dashboard.cpu.stat.idle) - parseInt(window.dashboard_old.cpu.stat.idle)) / used_total) * 100 * Math.pow(10, 1)) / Math.pow(10, 1));
				$("#cpu-stat-use").text(Math.round(((parseInt(window.dashboard.cpu.stat.user) - parseInt(window.dashboard_old.cpu.stat.user)) / used_total) * 100 * Math.pow(10, 1)) / Math.pow(10, 1));
				$("#cpu-stat-sys").text(Math.round(((parseInt(window.dashboard.cpu.stat.sys) - parseInt(window.dashboard_old.cpu.stat.sys)) / used_total) * 100 * Math.pow(10, 1)) / Math.pow(10, 1));
				$("#cpu-stat-nic").text(Math.round(((parseInt(window.dashboard.cpu.stat.nice) - parseInt(window.dashboard_old.cpu.stat.nice)) / used_total) * 100 * Math.pow(10, 1)) / Math.pow(10, 1));
				$("#cpu-stat-iow").text(Math.round(((parseInt(window.dashboard.cpu.stat.iowait) - parseInt(window.dashboard_old.cpu.stat.iowait)) / used_total) * 100 * Math.pow(10, 1)) / Math.pow(10, 1));
				$("#cpu-stat-irq").text(Math.round(((parseInt(window.dashboard.cpu.stat.irq) - parseInt(window.dashboard_old.cpu.stat.irq)) / used_total) * 100 * Math.pow(10, 1)) / Math.pow(10, 1));
				$("#cpu-stat-sirq").text(Math.round(((parseInt(window.dashboard.cpu.stat.softirq) - parseInt(window.dashboard_old.cpu.stat.softirq)) / used_total) * 100 * Math.pow(10, 1)) / Math.pow(10, 1));
			}
		}
		
	}, 300);
	$(".mic").highcharts(json,chartFunction); 
});

var chartFunction = function (chart) {
	setInterval(function () {
		left = chart.series[0].points[0];
		if (chart.series&&(window.dashboard.shm_data.MIC != null)&&(window.dashboard.shm_data.MIC != 0)) 
		{ // the chart may be destroyed
			

			if((window.dashboard.shm_data.MIC>-20)&&(window.dashboard.shm_data.MIC<80))
			{
				leftVal =  window.dashboard.shm_data.MIC;
				left.update(leftVal, false);
				chart.redraw();
			}
			if(window.dashboard.shm_data.MIC<-20){
				leftVal = -20;
				left.update(leftVal, false);
				chart.redraw();
			}
			if(window.dashboard.shm_data.MIC>80){
				leftVal = 80;
				left.update(leftVal, false);
				chart.redraw();
			}
			//console.log(leftVal);	
		}
		else
		{
			leftVal = 0;
			left.update(leftVal, false);
			chart.redraw();
		}
	}, 100);
}

function getColorByBaiFenBi(bili){
    //var 百分之一 = (单色值范围) / 50;  单颜色的变化范围只在50%之内
    var one = (255+255) / 100;  
    var r=0;
    var g=0;
 
    if ( bili < 50 ) { 
        // 比例小于50的时候红色是越来越多的,直到红色为255时(红+绿)变为黄色.
        r = one * bili;
        g=255;
    }
    if ( bili >= 50 ) {
        // 比例大于50的时候绿色是越来越少的,直到0 变为纯红
        g =  255 - ( (bili - 50 ) * one) ;
        r = 255;
    }
    r = parseInt(r);// 取整
    g = parseInt(g);// 取整

    return "#"+r.toString(16,2)+g.toString(16,2)+"00";
}

function bytesRound(number, round) {
	if (number < 0) {
		var last = 0 + "B"
	} else {
		if (number < 1024) {
			var last = number + "B"
		} else {
			if (number < 1048576) {
				number = number / 1024;
				var last = Math.round(number * Math.pow(10, round)) / Math.pow(10, round) + "K"
			} else {
				if (number < 1048576000) {
					number = number / 1048576;
					var last = Math.round(number * Math.pow(10, round)) / Math.pow(10, round) + "M"
				} else {
					number = number / 1048576000;
					var last = Math.round(number * Math.pow(10, round)) / Math.pow(10, round) + "G"
				}
			}
		}
	}
	return last
}
Date.prototype.format = function(format) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length))
		}
	}
	return format
};

function uptimeFormat(str) {
	var uptime = "";
	var min = parseInt(str) / 60;
	var hours = min / 60;
	var days = Math.floor(hours / 24);
	var hours = Math.floor(hours - (days * 24));
	min = Math.floor(min - (days * 60 * 24) - (hours * 60));
	if (days !== 0) {
		if (days == 1) {
			uptime = days + " day "
		} else {
			uptime = days + " days "
		}
	}
	if (hours !== 0) {
		uptime = uptime + hours + ":"
	}
	return uptime = uptime + min
};