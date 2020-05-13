function rotate_sin_cos(m, sin, cos) {
    m.a = cos
    m.b = sin
    m.c = -sin
    m.d = cos
    m.e = 0
    m.f = 0
}

function start() {
    let box = document.getElementById('box')
    let snake = document.getElementById('snake')
    let snake_head_rotate = document.getElementById('snake_head_rotate')
    let snake_head_shift = document.getElementById('snake_head_shift')
    let snake_body_2 = document.getElementById('snake_body_2')
    let snake_full_body = document.getElementById('snake_full_body')
    let snake_tail = document.getElementById('snake_tail')
    let mice = [ document.getElementById('mouse') ]
    let speed = {
	x: 2, y: 0
    }
    let slow = false
    let max_mice_count = 5
    let max_new_mice_count = 3
    let snake_head_length = 1300
    let snake_tail_length = 1100
    let snake_body_length = 800
    let snake_body_length_half = 400
    let snake_body_dyn = []
    let snake_delta_x = 10200 //snake_body_length * (snake_body_dyn.length + 1) + 8600
    let snake_delta_y = 15000 //snake_body_length * (snake_body_dyn.length + 1) + 13400
    let mouse_delta_x = 14600
    let mouse_delta_y = 15000
    let stroke_width = Math.round(parseInt(box.attributes['stroke-width'].value) / 2)
    let limit = {
	x: {
            left: box.x.baseVal.value + stroke_width - snake_delta_x,
            right: box.x.baseVal.value + box.width.baseVal.value - stroke_width - snake_delta_x,
	},
	y: {
            top: box.y.baseVal.value + stroke_width - snake_delta_y,
            bottom: box.y.baseVal.value + box.height.baseVal.value - stroke_width - snake_delta_y,
	}
    }
    let rotations = []
    let eating = false, growing = false, growing_start
    let first_snake_body = snake_body_2
    let random_mouse = function(mouse) {
	mouse.transform.baseVal[0].matrix.e = Math.round(Math.random() * (limit.x.right - limit.x.left - snake_body_length * 3)) + limit.x.left + snake_body_length + snake_delta_x - mouse_delta_x
	mouse.transform.baseVal[0].matrix.f = Math.round(Math.random() * (limit.y.bottom - limit.y.top - snake_body_length * 3)) + limit.y.top + snake_body_length + snake_delta_y - mouse_delta_y
    }
    // random_mouse(mice[0])
    let other_keyup = window.onkeyup
    window.onkeyup = function(e) {
	if(e.key == 'ArrowLeft') {
            if(!eating && (!rotations.length || rotations[0].changed))
		rotations.unshift({
		    left: true,
		    start_x: snake_head_shift.transform.baseVal[0].matrix.e,
		    start_y: snake_head_shift.transform.baseVal[0].matrix.f,
		    speed_x: speed.x,
		    speed_y: speed.y,
		})
	}
	else if(e.key == 'ArrowRight') {
            if(!eating && (!rotations.length || rotations[0].changed))
		rotations.unshift({
		    left: false,
		    start_x: snake_head_shift.transform.baseVal[0].matrix.e,
		    start_y: snake_head_shift.transform.baseVal[0].matrix.f,
		    speed_x: speed.x,
		    speed_y: speed.y,
		})
	}
	else if(e.code == 'Space') {
	    if(slow) {
		if(speed.x > 0) speed.x = slow
		else if(speed.x < 0) speed.x = -slow
		else if(speed.y > 0) speed.y = slow
		else /* if(speed.y < 0) */ speed.y = -slow
		slow = false
	    }
	    else {
		if(speed.x > 0) { slow = speed.x; speed.x = 0.1 }
		else if(speed.x < 0) { slow = -speed.x; speed.x = -0.1 }
		else if(speed.y > 0) { slow = speed.y; speed.y = 0.1 }
		else /* if(speed.y < 0) */ { slow = -speed.y; speed.y = -0.1 }
	    }
	}
	else if(other_keyup) other_keyup(e)
    }
    function add_snake_body(base) {
	var node = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
	let cx = base.cx.baseVal.value
	let cy = base.cy.baseVal.value
	node.cx.baseVal.value = cx
	node.cy.baseVal.value = cy
	node.r.baseVal.value = base.r.baseVal.value
	node.setAttribute('fill', base.attributes.fill.value)
	node.setAttribute('stroke', base.attributes.stroke.value)
	let tx = base.transform.baseVal[0].matrix.e, ty = base.transform.baseVal[0].matrix.f
	if(speed.x > 0) tx += snake_body_length
	else if(speed.x < 0) tx -= snake_body_length
	else if(speed.y > 0) ty += snake_body_length
	else /* if(speed.y < 0) */ ty -= snake_body_length
	node.setAttribute('transform', 'translate('+tx+','+ty+')')
	snake_full_body.append(node)
	return node
    }
    function move(node, x, y) {
	node.transform.baseVal[0].matrix.e = x
	node.transform.baseVal[0].matrix.f = y
    }
    function get_speed_delta(rot, x, y) {
	return rot.speed_x > 0 ? x - rot.start_x : rot.speed_x < 0 ? rot.start_x - x : rot.speed_y > 0 ? y - rot.start_y : /* sy < 0 */ rot.start_y - y
    }
    let prev = (new Date).getTime()
    function draw() {
	let time = (new Date).getTime()
	let tp = time - prev
	let old_x = snake_head_shift.transform.baseVal[0].matrix.e
	let x = Math.round (old_x + speed.x * tp)
	let old_y = snake_head_shift.transform.baseVal[0].matrix.f
	let y = Math.round (old_y + speed.y * tp)
	let delta_rotate_x = 0
	let delta_rotate_y = 0
	if(rotations.length && !rotations[0].changed) {
	    let leg = snake_head_length - get_speed_delta(rotations[0], x, y)
	    let sign = (speed.x > 0 ? 1 : speed.x < 0 ? -1 : speed.y < 0 ? 1 : /*speed.y > 0*/ -1)
	    if(leg >= 0) {
		let cos = leg / snake_head_length
		let acos_rad = Math.acos(cos)
		let sin = Math.sin(acos_rad)
		if (speed.x > 0 && rotations[0].left) {
                    delta_rotate_x = snake_head_length - leg
		    delta_rotate_y = snake_head_length / sin
		}
		if (speed.x > 0 && !rotations[0].left) {
                    delta_rotate_x = snake_head_length - leg
		    delta_rotate_y = - (snake_head_length / sin)
		}
		if (speed.x < 0 && rotations[0].left) {
                    delta_rotate_x = - (snake_head_length - leg)
		    delta_rotate_y = snake_head_length / sin
		}
		if (speed.x < 0 && !rotations[0].left) {
                    delta_rotate_x = - (snake_head_length - leg)
		    delta_rotate_y = - (snake_head_length / sin)
		}
		if (speed.y > 0 && rotations[0].left) {
                    delta_rotate_x = snake_head_length / sin
		    delta_rotate_y = snake_head_length - leg
		}
		if (speed.y > 0 && !rotations[0].left) {
                    delta_rotate_x = - (snake_head_length / sin)
		    delta_rotate_y = snake_head_length - leg
		}
		if (speed.y < 0 && rotations[0].left) {
                    delta_rotate_x = snake_head_length / sin
		    delta_rotate_y = - (snake_head_length - leg)
		}
		if (speed.y < 0 && !rotations[0].left) {
                    delta_rotate_x = - (snake_head_length / sin)
		    delta_rotate_y = - (snake_head_length - leg)
		}
		if(rotations[0].left) sin = -sin
		rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix,
			       (speed.x ? sin : -cos) * sign, (speed.x ? cos : sin) * sign)
		// if(speed.x) delta_rotate_y -= snake_body_length * sign * (rotations[0].left ? -1 : 1)
		// else delta_rotate_x -= snake_body_length * sign * (rotations[0].left ? -1 : 1)
	    }
	    else {
		rotations[0].changed = true
		if(speed.x) rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix,
					   (rotations[0].left ? -1 : 1) * sign, 0)
		else/*speed.y*/rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix,
					      0, -1 * sign * (rotations[0].left ? 1 : -1))
		if(speed.x) {
		    speed.y = rotations[0].left ? -speed.x : speed.x
		    speed.x = 0
		}
		else {
		    speed.x = rotations[0].left ? speed.y : -speed.y
		    speed.y = 0
		}
	    }
	}
	move(snake_head_shift, x, y)
	if(!growing) {
	    let mx = x, my = y
	    let sx = speed.x, sy = speed.y
	    function add() {
		if(sx > 0) mx -= snake_body_length
		else if(sx < 0) mx += snake_body_length
		else if(sy > 0) my -= snake_body_length
		else /* if(sy < 0) */ my += snake_body_length
	    }
	    let ri = 0
	    if(rotations.length && !rotations[0].changed) ++ri
	    snake_body_dyn.some(function(body) {
		move(body, mx, my)
		if(ri < rotations.length && snake_body_dyn.length > 2) throw {ri:ri, rotations:rotations, speed:speed, sx:sx, sy:sy, mx:mx, my:my, delta:get_speed_delta(sx, sy, rotations[ri].start, mx, my)}
		if(ri < rotations.length &&
		   get_speed_delta(sx, sy, rotations[ri].start, mx, my) <= 0) {
		    if(snake_body_dyn.length > 2) throw {ri:ri, rotations:rotations, speed:speed, sx:sx, sy:sy, mx:mx, my:my, delta:get_speed_delta(sx, sy, rotations[ri].start, mx, my)}
		    if(sx) {
			sy = rotations[ri].left ? sx : -sx
			sx = 0
		    }
		    else {
			sx = rotations[ri].left ? -sy : sy
			sy = 0
		    }
		    ++ri
		}
		add()
		return false
	    })
	    move(snake_body_2, mx, my)
	    if(ri < rotations.length) {
		// throw {ri:ri, rotations:rotations, speed:speed, sx:sx, sy:sy, mx:mx, my:my, delta:get_speed_delta(sx, sy, rotations[ri].start, mx, my)}
		let rot = rotations[ri]
		let leg = rot.speed_x > 0 ? (rot.left ? rot.start_y - my : my - rot.start_y) :
		    rot.speed_x < 0 ? (rot.left ? my - rot.start_y : rot.start_y - my) :
                    rot.speed_y > 0 ? (rot.left ? mx - rot.start_x : rot.start_x - mx) :
                    /*rot.speed_y < 0*/ (rot.left ? rot.start_x - mx : mx - rot.start_x)
		console.log('mx',mx,'my',my,'leg',leg,'rot',rot)
		let sign = (rot.speed_x > 0 ? 1 : rot.speed_x < 0 ? -1 : rot.speed_y < 0 ? 1 : /*rot.speed_y > 0*/ -1)
		if(leg < snake_tail_length) {
		    let sin = leg / snake_tail_length
		    let asin_rad = Math.asin(sin)
		    let cos = Math.cos(asin_rad)
		    if(rot.left) sin = -sin
		    rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, (rot.speed_x ? sin : -cos) * sign, (rot.speed_x ? cos : sin) * sign)
		}
		else {
		    if(rot.speed_x) rotate_sin_cos(snake_tail.transform.baseVal[0].matrix,
					   (rot.left ? -1 : 1) * sign, 0)
		    else/*rot.speed_y*/rotate_sin_cos(snake_tail.transform.baseVal[0].matrix,
					      0, -1 * sign * (rot.left ? 1 : -1))
		    rotations.length = ri
		    console.log('ri',ri,'rotations',rotations)
		}
	    }
	    move(snake_tail, mx, my)
	}
	// intersections
	let del_x_y = snake_head_length + snake_body_length_half
	let dx = x - delta_rotate_x
	let dy = y - delta_rotate_y
	if(speed.x < 0) dx -= 2 * del_x_y
        else if(speed.y > 0) {
                dx -= del_x_y
                dy += del_x_y
        }
        else if(speed.y < 0) {
                dx -= del_x_y
                dy -= del_x_y
        }
	// +++ modify dx&dy depending on speed direction
	if(dx >= limit.x.right || dx <= limit.x.left || dy >= limit.y.bottom || dy <= limit.y.top) {
            console.log('limit reached', {x:x, y:y, dx:dx, dy:dy, limit:limit})
	    let add_mark = function(d) {
		let mark = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		mark.setAttribute('d', d)
		mark.setAttribute('stroke', 'red')
		document.children[0].append(mark)
	    }
	    if(dx >= limit.x.right) {
		let mark_y = dy + snake_delta_y
		add_mark('M 30000,'+mark_y+' L 32000,'+mark_y)
	    }
	    if(dx <= limit.x.left) {
		let mark_y = dy + snake_delta_y
		add_mark('M 0,'+mark_y+' L 2000,'+mark_y)
	    }
	    if(dy >= limit.y.bottom) {
		let mark_x = dx + snake_delta_x
		add_mark('M '+mark_x+',15000 L '+mark_x+',17000')
	    }
	    if(dy <= limit.y.top) {
		let mark_x = dx + snake_delta_x
		add_mark('M '+mark_x+',0 L '+mark_x+ ',2000')
	    }
            return
	}
	if(growing) {
	    let delta
	    if(speed.x > 0) delta = x - growing_start
	    else if(speed.x < 0) delta = growing_start - x
            else if(speed.y > 0) delta = y - growing_start
            else if(speed.y < 0) delta = growing_start - y
	    if(delta >= snake_body_length) {
		growing = eating = false
		let count = Math.round(Math.random() * max_new_mice_count)
		if(mice.length + count < 1) count = 2
		else if(mice.length + count > max_mice_count)
		    count = max_mice_count - mice.length
		while(count--) {
		    // let mouse = svggen(document.body, ['use', {
		    //     'xlink:href': '#mouse_pattern', transform: 'translate(0,0)' }])[0]
		    let mouse = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		    mouse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#mouse_pattern')
		    mouse.setAttribute('transform', 'translate(0,0)')
		    document.children[0].insertBefore(mouse, snake)
		    random_mouse(mouse)
		    mice.push(mouse)
		}
		let speed_increment = 0.2
		if(speed.x > 0) speed.x += speed_increment
		else if(speed.x < 0) speed.x -= speed_increment
		else if(speed.y > 0) speed.y += speed_increment
		else /* if(speed.y < 0) */ speed.y -= speed_increment
	    }
	}
	else if(eating) {
	   let mouse_distance = Math.sqrt(Math.pow(eating.x - dx, 2) + Math.pow(eating.y - dy, 2))
           if(mouse_distance > snake_body_length) {
	       growing = true
	       growing_start = speed.x ? x : y
	       mice[eating.index].remove()
	       mice.splice(eating.index, 1)
	       first_snake_body = add_snake_body(first_snake_body)
	       snake_body_dyn.unshift(first_snake_body)
	   }
	}
	else {
	    mice.some(function(mouse, mouse_index){
		let mx = mouse.transform.baseVal[0].matrix.e + mouse_delta_x - snake_delta_x
		let my = mouse.transform.baseVal[0].matrix.f + mouse_delta_y - snake_delta_y
		let mouse_distance = Math.sqrt(Math.pow(mx - dx, 2) + Math.pow(my - dy, 2))
		if(mouse_distance < snake_body_length / 2) {
		    eating = { x: mx, y: my, index: mouse_index }
		    return true
		}
		return false
	    })
	}
	prev = time
	requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)
}
