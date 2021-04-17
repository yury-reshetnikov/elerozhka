function Animate4() {
    let actions = []
    let finalization = []
    this.start = function() {
	this.started = (new Date).getTime()
	requestAnimationFrame(this.draw.bind(this))
    }
    this.draw = function() {
	let count = 0
	let t = (new Date).getTime() - this.started
	if(this.time_modifier) t *= this.time_modifier
	if(this.exit_time && t > this.exit_time) return
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
    function gen_draw(time_from, time_to, obj, cb) {
	let done = false
	return function(t) {
	    if(t > time_to) {
                if(!done) {
		    done = true
                    cb.call(obj, 1)
                }
                return false
	    }
	    else if(t < time_from) return true
	    else {
		if(isNaN(t) || isNaN(time_from) || isNaN(time_to)) {
		    console.log({t:t,time_from:time_from,time_to:time_to})
		    return false
		}
		cb.call(obj, (t - time_from) / (time_to - time_from))
		return true
	    }
	}
    }
    function Tail(callback, angle_from, angle_to, time_from, time_to) {
	this.draw = gen_draw(time_from, time_to, this, function(k) {
            let a = []
	    angle_from.forEach(function(item, n) {
                a.push(item + (angle_to[n] - item) * k)
            })
            callback(...a)
	})
    }
    this.tail = function(callback, angle_from, angle_to, time_from, time_to) {
        actions.push(new Tail(callback, angle_from, angle_to, time_from, time_to))
    }

}

