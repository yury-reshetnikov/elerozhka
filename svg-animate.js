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
    this.finish = function(cb) { finalization.push(cb) }
}
