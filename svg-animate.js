function Animate3() {
    function gen_draw(time_from, time_to, cb) {
	return function(t) {
	    if(t > time_to) return false
	    else if(t < time_from) return true
	    else {
		cb((t - time_from) / (time_to - time_from))
		return true
	    }
	}
    }
    function Rotate(id, angle_from, angle_to, time_from, time_to) {
	// this.id = id
	// this.angle = angle
	// this.time = time
	this.draw = gen_draw(time_from, time_to, function(k) {
	    var a = angle_from + (angle_to - angle_from) * k
	    document.getElementById(id).setAttribute('transform', 'rotate('+a+')')
	})
    }
    function Translate(id, x_from, y_from, x_to, y_to, time_from, time_to) {
	this.draw = gen_draw(time_from, time_to, function(k) {
	    var x = x_from + (x_to - x_from) * k
	    var y = y_from + (y_to - y_from) * k
	    document.getElementById(id).setAttribute('transform', 'translate('+x+','+y+')')
	})
    }
    function Path(id, pattern_from, pattern_to, time_from, time_to) {
	this.draw = gen_draw(time_from, time_to, function(k) {
	    var d = []
	    var d0 = document.getElementById(pattern_from).attributes.d.value.split(/\s+/)
	    var d1 = document.getElementById(pattern_to).attributes.d.value.split(/\s+/)
	    while(d0.length && d1.length) {
		var v0 = d0.shift()
		var v1 = d1.shift()
		var m0 = v0.match(/(\d+),(\d+)/)
		var m1 = v1.match(/(\d+),(\d+)/)
		if(m0 && m1) {
		    var x0 = parseInt(m0[1])
		    var y0 = parseInt(m0[2])
		    var x1 = parseInt(m1[1])
		    var y1 = parseInt(m1[2])
		    d.push(''+(x0 + (x1 - x0) * k)+','+(y0 + (y1 - y0) * k))
		}
		else d.push(v1)
	    }
	    document.getElementById(id).attributes.d.value = d.join(' ')
	})
    }
    function PathRotate(id, pattern, cx, cy, points, angle_from, angle_to, time_from, time_to) {
	this.draw = gen_draw(time_from, time_to, function(k) {
	    var n = -1
	    var p = points.slice()
	    document.getElementById(id).attributes.d.value = document.getElementById(pattern).
		attributes.d.value.split(/\s+/).map(function(item) {
		    var m = item.match(/(\d+),(\d+)/)
		    if(m) {
			++n
			if(!p.length || n < p[0]) return item
			p.shift()
			var x = parseInt(m[1])
			var y = parseInt(m[2])
			var a = (angle_from + (angle_to - angle_from) * k) * Math.PI / 180
			var x1 = x - cx
			var y1 = y - cy
			var g = Math.sqrt(x1*x1 + y1*y1)
			var a0 = Math.asin(y1 / g)
			if(x < cx) a0 = Math.PI - a0
			var a1 = a + a0
			return ''+Math.round(cx + g * Math.cos(a1))+','+Math.round(cy + g * Math.sin(a1))
		    }
		    else return item
		}).join(' ')
	})
    }
    function Display(id, show, time) {
	var done = false
	this.draw = function(t) {
	    if(done) return false
	    else if(t >= time) {
		done = true
		document.getElementById(id).style.display = show ? '' : 'none'
		return true
	    }
	    else return true
	}
    }
    // this.actions = []
    var actions = []
    var finalization = []
    this.start = function() {
	this.started = (new Date).getTime()
	requestAnimationFrame(this.draw.bind(this))
    }
    this.draw = function() {
	var count = 0
	var t = (new Date).getTime() - this.started
	actions.forEach(function(item) {
	    if(item.draw(t)) ++count
	})
	if(count)
	    requestAnimationFrame(this.draw.bind(this))
	else {
	    actions = []
	    finalization.forEach(function(item) { item() })
	    finalization = []
	}
    }
    this.rotate = function(id, angle_from, angle_to, time_from, time_to) {
	actions.push(new Rotate(id, angle_from, angle_to, time_from, time_to))
    }
    this.translate = function(id, x_from, y_from, x_to, y_to, time_from, time_to) {
	actions.push(new Translate(id, x_from, y_from, x_to, y_to, time_from, time_to))
    }
    this.path = function(id, pattern_from, pattern_to, time_from, time_to) {
	actions.push(new Path(id, pattern_from, pattern_to, time_from, time_to))
    }
    this.path_rotate = function(id, pattern, cx, cy, points, angle_from, angle_to, time_from, time_to) {
	actions.push(new PathRotate(id, pattern, cx, cy, points, angle_from, angle_to, time_from, time_to))
    }
    this.display = function(id, show, time) {
	actions.push(new Display(id, show, time))
    }
    this.finish = function(cb) { finalization.push(cb) }
}
