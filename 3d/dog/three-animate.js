function Animate4() {
    let actions = []
    let finalization = []
    this.start = function() {
	this.started = (new Date).getTime()
	requestAnimationFrame(this.draw.bind(this))
    }
    let do_exit = function() {
	actions = []
	finalization.forEach(function(item) { item() })
	finalization = []
    }
    this.draw = function() {
	let count = 0
	let t = (this.last_draw_time = (new Date).getTime()) - this.started
	if(this.time_modifier) t *= this.time_modifier
	let need_exit_after_draw = false
	if(this.exit_now) {
	    do_exit()
	    return
	}
	else if(this.exit_time && this.draw_before_exit &&
		t >= this.exit_time) {
	    t = this.exit_time
	    need_exit_after_draw = true
	}
	else if(this.exit_time && t > this.exit_time) {
	    do_exit()
	    return
	}
	actions.forEach(function(item) {
	    if(item.draw(t) || !item.finish()) ++count
	})
	if(need_exit_after_draw) do_exit()
	else if(count)
	    requestAnimationFrame(this.draw.bind(this))
	else do_exit()
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
    function RotateArrayCallback(callback, angle_from, angle_to, time_from, time_to, time_period) {
	this.init = function(time_from, time_to) {
	    this.draw = gen_draw(time_from, time_to, this, function(k) {
		let a = []
		angle_from.forEach(function(item, n) {
                    a.push(item + (angle_to[n] - item) * k)
		})
		callback(...a)
	    })
	}
	this.init(time_from, time_to)
	if(time_period)
	    this.finish = function() {
		time_from += time_period
		time_to += time_period
		this.init(time_from, time_to)
		return false
	    }
	else this.finish = function() { return true }
    }
    this.finish = function(cb) { finalization.push(cb) }
    this.rotate_array_callback = function(callback, angle_from, angle_to, time_from, time_to, time_period) {
        actions.push(new RotateArrayCallback(callback, angle_from, angle_to, time_from, time_to, time_period))
    }

}

function AnimateStep(a,callback,angle_from,time_from) {
    this.angle_from = angle_from
    this.time_from = time_from
    this.step = function(angle_to,time_to) {
	a.rotate_array_callback(callback, this.angle_from, angle_to,
				this.time_from, time_to)
	this.angle_from = angle_to
	this.time_from = time_to
    }
}
