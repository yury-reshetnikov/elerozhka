function Animate3() {
    function Rotate(id, angle_from, angle_to, time_from, time_to) {
	// this.id = id
	// this.angle = angle
	// this.time = time
	this.draw = function(t) {
	    if(t > time_to) return false
	    else if(t < time_from) return true
	    else {
		var a = angle_from + (angle_to - angle_from) * (t - time_from) / (time_to - time_from)
		document.getElementById(id).setAttribute('transform', 'rotate('+a+')')
		return true
	    }
	}
    }
    function Path(id, pattern_from, pattern_to, time_from, time_to) {
	this.draw = function(t) {
	    if(t > time_to) return false
	    else if(t < time_from) return true
	    else {
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
			var k = (t - time_from) / (time_to - time_from)
			d.push(''+(x0 + (x1 - x0) * k)+','+(y0 + (y1 - y0) * k))
		    }
		    else d.push(v1)
		}
		document.getElementById(id).attributes.d.value = d.join(' ')
		return true
	    }
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
    this.path = function(id, pattern_from, pattern_to, time_from, time_to) {
	actions.push(new Path(id, pattern_from, pattern_to, time_from, time_to))
    }
    this.finish = function(cb) { finalization.push(cb) }
}
