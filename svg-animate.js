function Animate3() {
    function gen_draw(time_from, time_to, time_finish, cb) {
	var done = false
	return function(t) {
	    if(t > time_to) {
		if(time_finish === true) {
		    if(!done) {
			done = true
			cb(1)
		    }
		    return false
		}
		else if(time_finish) {
		    if(t > time_finish) return false
		    else {
			if(!done) {
			    done = true
			    cb(1)
			}
			return true
		    }
		}
		else return false
	    }
	    else if(t < time_from) return true
	    else {
		cb((t - time_from) / (time_to - time_from))
		return true
	    }
	}
    }
    function Rotate(id, angle_from, angle_to, time_from, time_to, time_finish) {
	// this.id = id
	// this.angle = angle
	// this.time = time
	this.draw = gen_draw(time_from, time_to, time_finish, function(k) {
	    var a = angle_from + (angle_to - angle_from) * k
	    document.getElementById(id).setAttribute('transform', 'rotate('+a+')')
	})
    }
    function Translate(id, x_from, y_from, x_to, y_to, time_from, time_to, time_finish) {
	this.draw = gen_draw(time_from, time_to, time_finish, function(k) {
	    var x = x_from + (x_to - x_from) * k
	    var y = y_from + (y_to - y_from) * k
	    document.getElementById(id).setAttribute('transform', 'translate('+x+','+y+')')
	})
    }
    function Scale(id, scale_from, scale_to, time_from, time_to, time_finish) {
	this.draw = gen_draw(time_from, time_to, time_finish, function(k) {
	    var scale = scale_from + (scale_to - scale_from) * k
	    document.getElementById(id).setAttribute('transform', 'scale('+scale+')')
	})
    }
    function Path(id, pattern_from, pattern_to, time_from, time_to, time_finish) {
	this.draw = gen_draw(time_from, time_to, time_finish, function(k) {
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
    function PathRotate(id, pattern, cx, cy, points, angle_from, angle_to, time_from, time_to, time_finish) {
	this.draw = gen_draw(time_from, time_to, time_finish, function(k) {
	    var n = -1
	    var p = points.slice()
	    var d = document.getElementById(id).attributes.d
	    var v = d.value.split(/\s+/)
	    d.value = document.getElementById(pattern).attributes.d.value.split(/\s+/).map(function(item) {
		var cur = v.shift()
		var m = item.match(/(\d+),(\d+)/)
		if(m) {
		    ++n
		    if(!p.length || n < p[0]) return cur
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
		else return cur
	    }).join(' ')
	})
    }
    function PathTranslate(id, pattern, points, x_from, y_from, x_to, y_to, time_from, time_to, time_finish) {
	this.draw = gen_draw(time_from, time_to, time_finish, function(k) {
	    var n = -1
	    var p = points.slice()
	    var d = document.getElementById(id).attributes.d
	    var v = d.value.split(/\s+/)
	    d.value = document.getElementById(pattern).attributes.d.value.split(/\s+/).map(function(item) {
		var cur = v.shift()
		var m = item.match(/(\d+),(\d+)/)
		if(m) {
		    ++n
		    if(!p.length || n < p[0]) return cur
		    p.shift()
		    var x = parseInt(m[1])
		    var y = parseInt(m[2])
		    return ''+Math.round(x + x_from + (x_to - x_from) * k)+
			','+Math.round(y + y_from + (y_to - y_from) * k)
		}
		else return cur
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
    function Sleep(time, cb) {
	var done = false
	this.draw = function(t) {
	    if(done) return false
	    else if(t >= time) {
		done = true
		cb()
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
    this.rotate = function(id, angle_from, angle_to, time_from, time_to, time_finish) {
	actions.push(new Rotate(id, angle_from, angle_to, time_from, time_to, time_finish))
    }
    this.translate = function(id, x_from, y_from, x_to, y_to, time_from, time_to, time_finish) {
	actions.push(new Translate(id, x_from, y_from, x_to, y_to, time_from, time_to, time_finish))
    }
    this.scale = function(id, scale_from, scale_to, time_from, time_to, time_finish) {
        actions.push(new Scale(id, scale_from, scale_to, time_from, time_to, time_finish))
    }
    this.path = function(id, pattern_from, pattern_to, time_from, time_to, time_finish) {
	actions.push(new Path(id, pattern_from, pattern_to, time_from, time_to, time_finish))
    }
    this.path_rotate = function(id, pattern, cx, cy, points, angle_from, angle_to, time_from, time_to, time_finish) {
	actions.push(new PathRotate(id, pattern, cx, cy, points, angle_from, angle_to, time_from, time_to, time_finish))
    }
    this.path_translate = function(id, pattern, points, x_from, y_from, x_to, y_to, time_from, time_to, time_finish) {
	actions.push(new PathTranslate(id, pattern, points, x_from, y_from, x_to, y_to, time_from, time_to, time_finish))
    }
    this.path_restore = function(id, pattern) {
	document.getElementById(id).attributes.d.value = document.getElementById(pattern).attributes.d.value
    }
    this.transform_restore = function(id) {
	    document.getElementById(id).setAttribute('transform', '')
    }
    this.display = function(id, show, time) {
	actions.push(new Display(id, show, time))
    }
    this.sleep = function(id, cb) {
	actions.push(new Sleep(id, cb))
    }
    this.finish = function(cb) { finalization.push(cb) }
}
