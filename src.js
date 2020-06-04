//draw_plot(10, 500, 500, [2, 4, 8, 10, 2], ["a","a","a","a","a"], d3.scale.linear().domain([0,1]).range([0,10]))

const labels = ["v", "w", "x", "y", "z"]

function rotate_all(label) {
	var index = 0
	labels.forEach(function (l, i) {
		if (l == label)
			index = i
	})

	var degrees = index*360.0/labels.length,
		width   = d3.select("g").attr("width"),
		height  = d3.select("g").attr("height")

	d3.selectAll("g")
		.transition()
      		.duration(1500)
      		.ease(d3.easeLinear)
		.attrTween("transform", tween);

    function tween(d, i, a) {
    	var old = ""
		if (d3.select(this).attr("transform") == null)
			old = "rotate(0 " + " " + width/2 + " " + height/2 + ")"
		else 
			old = d3.select(this).attr("transform")
		
		return d3.interpolateString(old, "rotate(-" + degrees + " " + width/2 + " " + height/2 + ")")
    }

	d3.selectAll(".label")
		.transition()
      		.duration(1500)
      		.ease(d3.easeLinear)
		.attrTween("transform", tweenLabel);


	function tweenLabel(d, i, a) {
    	var old = ""
		if (d3.select(this).attr("transform") == null)
			old = "rotate(0 " + "0 0)"
		else 
			old = d3.select(this).attr("transform")
		
		return d3.interpolateString(old, "rotate(" + degrees + " 0 0)")
    }
}

function draw_plot(width, height, data, domain)
{
	var radius  = Math.min(width, height)/2 - 10,
		radians = 2*Math.PI/labels.length,
		center  = [width/2, height/2],
		scale   = d3.scale.linear()
					.domain(domain)
					.range([0, radius])
	
	var plot = d3.select("#star_plot")
					.append("svg")
					.attr("class", "chart")
					.attr("width", width)
					.attr("height", height)
					.append("g")
						.attr("width", width)
						.attr("height", height)
	
	var r = 0
	
	//Drawing guide lines
	labels.forEach(function(d, i) {
		var x, y
		
		x = radius*Math.cos(r)
		y = radius*Math.sin(r)
		
		plot.append("line")
			.attr("class", "axis")
			.attr("x1", center[0])
			.attr("y1", center[1])
			.attr("x2", center[0] + x)
			.attr("y2", center[1] + y)
		
		r += radians
	})

	r = 0
	
	//Drawing labels
	labels.forEach(function(d, i) {
		var x, y
		
		x = (3 + radius)*Math.cos(r)
		y = (3 + radius)*Math.sin(r)

		plot.append("text")
			.attr("class", "label")
			.attr("x", center[0] + x)
			.attr("y", center[1] + y)
			.text(d)
			.style('text-anchor', 'middle')
			.style('dominant-baseline', 'central')
			.on("click", function() {rotate_all(d)})
		
		r += radians
	})

	//Representing data
	var path = d3.svg.line.radial()
	var path_data = []
	r = Math.PI/2
	
	data.forEach(function(d) {
		path_data.push([
			scale(d),
			r
		])
		
		r += radians
	})
	
	plot.append("path")
		.attr("class", "path")
		.attr("transform", "translate(" + center[0] + "," + center[1] + ")")
		.attr("d", path(path_data) + "Z")
}

function draw() {
	d3.json("data.json", function(data) {
		var max = d3.max(data, d => d3.max(d)),
			width = Math.floor(data.length/4)*window.innerWidth/data.length,
	 		height = Math.floor(data.length/4)*window.innerHeight/data.length

		data.forEach(function(d) {
			draw_plot(width, height, d, [0, max])
		})
	})
}