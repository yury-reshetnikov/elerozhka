function calc_growing_delta(growing_start, speed, x, y) {
    if(speed.x > 0) return x - growing_start
    else if(speed.x < 0) return growing_start - x
    else if(speed.y > 0) return y - growing_start
    else if(speed.y < 0) return growing_start - y
}

function calc_growing_start(delta, speed, x, y) {
    if(speed.x > 0) return x - delta
    else if(speed.x < 0) return delta + x
    else if(speed.y > 0) return y - delta
    else if(speed.y < 0) return delta + y
}

function rotate_sin_cos(m, sin, cos) {
    m.a = cos
    m.b = sin
    m.c = -sin
    m.d = cos
    m.e = 0
    m.f = 0
}

function start() {
    let counter = document.getElementById('counter')
    let s_counter = document.getElementById('s_counter')
    let box = document.getElementById('box')
    let snake = document.getElementById('snake')
    let snake_head_rotate = document.getElementById('snake_head_rotate')
    let snake_head_shift = document.getElementById('snake_head_shift')
    let snake_body_2 = document.getElementById('snake_body_2')
    let snake_full_body = document.getElementById('snake_full_body')
    let snake_tail = document.getElementById('snake_tail')
    let mice = [ document.getElementById('mouse') ]
    let mongoose = document.getElementById('mongoose2')
    let speed = {
	x: 2, y: 0
    }
    let slow = false
    let max_mice_count = 10
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
    let mongoose_delta_x = 9090
    let mongoose_delta_y = 7485
    let mgr = 1000
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
    let eating = false, growing = false, growing_start, cutting = false
    let first_snake_body = snake_body_2
    function add_red_line(d) {
	let mark = document.createElementNS('http://www.w3.org/2000/svg', 'path')
	mark.setAttribute('d', d)
	mark.setAttribute('stroke', 'red')
	document.children[0].append(mark)
    }
    function add_red_cross(x, y) {
	x += snake_delta_x
	y += snake_delta_y
	add_red_line('M '+(x-500)+','+(y+500)+' L '+(x+500)+','+(y-500))
	add_red_line('M '+(x-500)+','+(y-500)+' L '+(x+500)+','+(y+500))
    }
    function add_red_cross_nodelta(x, y) {
	add_red_line('M '+(x-500)+','+(y+500)+' L '+(x+500)+','+(y-500))
	add_red_line('M '+(x-500)+','+(y-500)+' L '+(x+500)+','+(y+500))
    }
    function add_red_circle(cx, cy, r) {
        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', cx)
        circle.setAttribute('cy', cy)
        circle.setAttribute('r', r)
        circle.setAttribute('fill', 'red')
        circle.setAttribute('fill-opacity', 0.6)
        document.children[0].append(circle)
    }
    function mongoose_attack() {
	let a = new Animate3
	let time_s = 0
	let time_f = 170
	let time_ff = 200
	a.path ('mongoose2_body', 'mongoose2_t_body', 'mongoose3_body', time_s, time_f)
	a.path ('mongoose2_ear2', 'mongoose2_t_ear2', 'mongoose3_ear2', time_s, time_f)
	a.path ('mongoose2_ear1', 'mongoose2_t_ear1', 'mongoose3_ear1', time_s, time_f)
	a.path ('mongoose2_nose', 'mongoose2_t_nose', 'mongoose3_nose', time_s, time_f)
	a.translate ('mongoose2_eye', 0, 0, 920, -665, time_s, time_f)
	a.translate ('mongoose2_eyeball', 0, 0, 920, -665, time_s, time_f)
        a.path ('mongoose2_body', 'mongoose3_body', 'mongoose2_t_body', time_f, time_ff)
        a.path ('mongoose2_ear2', 'mongoose3_ear2', 'mongoose2_t_ear2', time_f, time_ff)
        a.path ('mongoose2_ear1', 'mongoose3_ear1', 'mongoose2_t_ear1', time_f, time_ff)
        a.path ('mongoose2_nose', 'mongoose3_nose', 'mongoose2_t_nose', time_f, time_ff)
        a.translate ('mongoose2_eye', 920, -665, 0, 0, time_f, time_ff)
        a.translate ('mongoose2_eyeball', 920, -665, 0, 0, time_f, time_ff)
	a.start()
    }
    function mongoose_identify() {
        add_red_cross_nodelta(mongoose_delta_x, mongoose_delta_y)
        add_red_circle(mongoose_delta_x, mongoose_delta_y, mgr)
    }
    function random_mongoose(mongoose) {
	let mx, my
	for(;;) {
	    mx = Math.round(Math.random() * (limit.x.right - limit.x.left - snake_body_length * 3)) + limit.x.left + 2 * mgr
	    my = Math.round(Math.random() * (limit.y.bottom - limit.y.top - snake_body_length * 3)) + limit.y.top + 2 * mgr
	    let intersected = false
	    function check(body) {
		let bx = body.transform.baseVal[0].matrix.e - snake_head_length - snake_body_length_half
		let by = body.transform.baseVal[0].matrix.f
		let body_distance = Math.sqrt(Math.pow(bx - mx, 2) + Math.pow(by - my, 2))
		if(body_distance < mgr) {
		    console.log('mx',mx,'my',my)
		    intersected = true
		    return true
		}
		else return false
	    }
	    snake_body_dyn.some(check)
	    if(!intersected) check(snake_body_2)
	    if(!intersected) check(snake_tail)
	    if(!intersected) break
	}
	mongoose.transform.baseVal[0].matrix.e = mx + snake_delta_x - mongoose_delta_x
	mongoose.transform.baseVal[0].matrix.f = my + snake_delta_y - mongoose_delta_y
    }
    function clone_mouse() {
	let mouse = document.createElementNS('http://www.w3.org/2000/svg', 'use')
	mouse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#mouse_pattern')
	mouse.setAttribute('transform', 'translate(0,0)')
	document.children[0].insertBefore(mouse, snake)
	return mouse
    }
    function random_mouse(mouse) {
	let mx, my
	for(;;) {
	    mx = Math.round(Math.random() * (limit.x.right - limit.x.left - snake_body_length * 3)) + limit.x.left + snake_body_length
	    my = Math.round(Math.random() * (limit.y.bottom - limit.y.top - snake_body_length * 3)) + limit.y.top + snake_body_length
	    let intersected = false
	    function check(body) {
		let bx = body.transform.baseVal[0].matrix.e - snake_head_length - snake_body_length_half
		let by = body.transform.baseVal[0].matrix.f
		let body_distance = Math.sqrt(Math.pow(bx - mx, 2) + Math.pow(by - my, 2))
		if(body_distance < snake_body_length / 2) {
		    console.log('mx',mx,'my',my)
		    intersected = true
		    return true
		}
		else return false
	    }
	    snake_body_dyn.some(check)
	    if(!intersected) check(snake_body_2)
	    if(!intersected) check(snake_tail)
	    if(!intersected) break
	}
	mouse.transform.baseVal[0].matrix.e = mx + snake_delta_x - mouse_delta_x
	mouse.transform.baseVal[0].matrix.f = my + snake_delta_y - mouse_delta_y
    }
    function shift_mouse(mouse, x, y) {
	mouse.transform.baseVal[0].matrix.e = x
	mouse.transform.baseVal[0].matrix.f = y
	return mouse
    }
    // mongoose_identify()
    random_mongoose(mongoose)
    if(1) random_mouse(mice[0])
    else
	for(let x = 1; x < 10; ++x)
	    for(let y = 0; y < 10; ++y)
		mice.push(shift_mouse(clone_mouse(),
				      (snake_head_length + 100) * x,
				      -(snake_head_length + 100) * y))
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
	var group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
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
	group.append(node)
	snake_full_body.append(group)
	return node
    }
    function move(node, x, y) {
	node.transform.baseVal[0].matrix.e = x
	node.transform.baseVal[0].matrix.f = y
    }
    function get_speed_delta(rot, x, y) {
	return rot.speed_x > 0 ? x - rot.start_x : rot.speed_x < 0 ? rot.start_x - x : rot.speed_y > 0 ? y - rot.start_y : /* sy < 0 */ rot.start_y - y
    }
    function create_ball(cx, cy, r, element) {
	let ball = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
	ball.setAttribute('cx', cx)
	ball.setAttribute('cy', cy)
	ball.setAttribute('r', r)
	ball.setAttribute('fill', 'green')
	ball.setAttribute('stroke', 'black')
	element.parentNode.insertBefore(ball, element)
	return ball
    }
    function animate_big_ball(animate_id, ball) {
	let animate_fill = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
	animate_fill.setAttribute('id', animate_id)
	animate_fill.setAttribute('attributeName', 'fill-opacity')
	animate_fill.setAttribute('by', '-1')
	animate_fill.setAttribute('dur', '0.1s')
	animate_fill.setAttribute('fill', 'freeze')
	animate_fill.setAttribute('begin', 'indefinite')
	ball.append(animate_fill)
	let animate_stroke = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
	animate_stroke.setAttribute('attributeName', 'stroke-opacity')
	animate_stroke.setAttribute('by', '-1')
	animate_stroke.setAttribute('dur', '0.1s')
	animate_stroke.setAttribute('fill', 'freeze')
	animate_stroke.setAttribute('begin', animate_id + '.begin')
	ball.append(animate_stroke)
    }
    function animate_small_ball(animate_id, ball, sign_x, sign_y) {
	let animate_flight_x = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
	animate_flight_x.setAttribute('attributeName', 'cx')
	animate_flight_x.setAttribute('by', Math.round(1000 * sign_x))
	animate_flight_x.setAttribute('dur', '0.3s')
	animate_flight_x.setAttribute('fill', 'freeze')
	animate_flight_x.setAttribute('begin', animate_id + '.begin')
	ball.append(animate_flight_x)
	let animate_flight_y = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
	animate_flight_y.setAttribute('attributeName', 'cy')
	animate_flight_y.setAttribute('by', Math.round(1000 * sign_y))
	animate_flight_y.setAttribute('dur', '0.3s')
	animate_flight_y.setAttribute('fill', 'freeze')
	animate_flight_y.setAttribute('begin', animate_id + '.begin')
	ball.append(animate_flight_y)
	let animate_fill = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
	animate_fill.setAttribute('attributeName', 'fill-opacity')
	animate_fill.setAttribute('by', '-1')
	animate_fill.setAttribute('dur', '0.1s')
	animate_fill.setAttribute('fill', 'freeze')
	animate_fill.setAttribute('begin', animate_id + '.begin + 0.2s')
	ball.append(animate_fill)
	let animate_stroke = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
	animate_stroke.setAttribute('attributeName', 'stroke-opacity')
	animate_stroke.setAttribute('by', '-1')
	animate_stroke.setAttribute('dur', '0.1s')
	animate_stroke.setAttribute('fill', 'freeze')
	animate_stroke.setAttribute('begin', animate_id + '.begin + 0.2s')
	ball.append(animate_stroke)
    }
    let animate_id_count = 0
    function boom(big_ball) {
	let x = parseInt(big_ball.attributes.cx.value) + big_ball.transform.baseVal[0].matrix.e,
	    y = parseInt(big_ball.attributes.cy.value) + big_ball.transform.baseVal[0].matrix.f
	let animate_id = 'animate_' + ++animate_id_count
	// add_red_cross_nodelta(x, y)
	// throw big_ball
	animate_big_ball(animate_id, big_ball)
	for(let n = 0; n < 12; ++n) {
	    let angle = Math.PI / 6 * n
	    // console.log('n',n,'angle',angle,'x',Math.round(Math.cos(angle)*250),'y',Math.round(Math.sin(angle)*250))
	    let small_ball = create_ball(x + Math.round(Math.cos(angle)*250),
					 y + Math.round(Math.sin(angle)*250),
					 100, big_ball)
	    angle += Math.random() * Math.PI * 2 - Math.PI
	    animate_small_ball(animate_id, small_ball,
			       Math.cos(angle), Math.sin(angle))
	}
	document.getElementById(animate_id).beginElement()
	setTimeout(function() {
	    big_ball.parentNode.remove()
	}, 5000)
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
	    // console.log('leg',leg,'x',x,'y',y,'growing',growing,'rot',rotations[0])
	    let sign = (speed.x > 0 ? 1 : speed.x < 0 ? -1 : speed.y < 0 ? 1 : /*speed.y > 0*/ -1)
	    if(leg >= 0) {
		let cos = leg / snake_head_length
		let acos_rad = Math.acos(cos)
		let sin = Math.sin(acos_rad)
		let a = snake_head_length - leg
		let b = Math.round(snake_head_length * sin) + snake_body_length_half
		if (speed.x > 0) {
		    delta_rotate_x = a
		    delta_rotate_y = rotations[0].left ? b : -b
		}
		else if (speed.x < 0) {
		    delta_rotate_x = -a
		    delta_rotate_y = rotations[0].left ? -b : b
		}
		else if (speed.y > 0) {
		    delta_rotate_y = a
                    delta_rotate_x = rotations[0].left ? -b : b
		}
		else /* speed.y < 0 */ {
		    delta_rotate_y = -a
		    delta_rotate_x = rotations[0].left ? b : -b
		}
		if(rotations[0].left) sin = -sin
		rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix,
			       (speed.x ? sin : -cos) * sign, (speed.x ? cos : sin) * sign)
	    }
	    else {
		rotations[0].changed = true
		if(speed.x) rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix,
					   (rotations[0].left ? -1 : 1) * sign, 0)
		else/*speed.y*/rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix,
					      0, -1 * sign * (rotations[0].left ? 1 : -1))
		let delta
		if(growing) delta = calc_growing_delta(growing_start, speed, x, y)
		if(speed.x) {
		    speed.y = rotations[0].left ? -speed.x : speed.x
		    speed.x = 0
		}
		else {
		    speed.x = rotations[0].left ? speed.y : -speed.y
		    speed.y = 0
		}
		if(growing) growing_start = calc_growing_start(delta, speed, x, y)
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
		if(ri < rotations.length) {
		    // let delta = get_speed_delta(rotations[ri], mx, my)
		    let rot = rotations[ri]
		    let delta = rot.speed_x > 0 ? rot.start_y - my :
			rot.speed_x < 0 ? my - rot.start_y :
			rot.speed_y > 0 ? mx - rot.start_x :
			/* rot.speed_y < 0 */ rot.start_x - mx
		    if(!rot.left) delta = -delta
		    // console.log('ri',ri,'delta',delta,'mx',mx,'my',my,'sx',sx,'sy',sy,'rot',rotations[ri])
		    if(delta < snake_body_length) {
			let s = rot.left ? 1 : -1
			if(rot.speed_x > 0) {
			    mx += delta
			    my += delta * s
			}
			else if(rot.speed_x < 0) {
			    mx -= delta
			    my -= delta * s
			}
			else if(rot.speed_y > 0) {
			    mx -= delta * s
			    my += delta
			}
			else /* if(rot.speed_y < 0) */ {
			    mx += delta * s
			    my -= delta
			}
			if(sx) {
			    sy = sx * s
			    sx = 0
			}
			else {
			    sx = sy * -s
			    sy = 0
			}
			++ri
		    }
		}
		add()
		return false
	    })
	    move(snake_body_2, mx, my)
	    if(ri < rotations.length) {
		let rot = rotations[ri]
		let leg = rot.speed_x > 0 ? (rot.left ? rot.start_y - my : my - rot.start_y) :
		    rot.speed_x < 0 ? (rot.left ? my - rot.start_y : rot.start_y - my) :
                    rot.speed_y > 0 ? (rot.left ? mx - rot.start_x : rot.start_x - mx) :
                    /*rot.speed_y < 0*/ (rot.left ? rot.start_x - mx : mx - rot.start_x)
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
		    // console.log('ri',ri,'rotations',rotations)
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
	if(dx >= limit.x.right || dx <= limit.x.left || dy >= limit.y.bottom || dy <= limit.y.top) {
            console.log('limit reached', {x:x, y:y, dx:dx, dy:dy, limit:limit})
	    if(dx >= limit.x.right) {
		let mark_y = dy + snake_delta_y
		add_red_line('M 30000,'+mark_y+' L 32000,'+mark_y)
	    }
	    if(dx <= limit.x.left) {
		let mark_y = dy + snake_delta_y
		add_red_line('M 0,'+mark_y+' L 2000,'+mark_y)
	    }
	    if(dy >= limit.y.bottom) {
		let mark_x = dx + snake_delta_x
		add_red_line('M '+mark_x+',15000 L '+mark_x+',17000')
	    }
	    if(dy <= limit.y.top) {
		let mark_x = dx + snake_delta_x
		add_red_line('M '+mark_x+',0 L '+mark_x+ ',2000')
	    }
            return
	}
	// checking for intersection with body
	function check_body_inersection(body) {
	    let bx = body.transform.baseVal[0].matrix.e - snake_head_length - snake_body_length_half
	    let by = body.transform.baseVal[0].matrix.f
	    let body_distance = Math.sqrt(Math.pow(bx - dx, 2) + Math.pow(by - dy, 2))
	    if(body_distance < snake_body_length / 2) {
		let lost = snake_body_dyn.pop()
		if(lost) boom(lost)
                s_counter.textContent = snake_body_dyn.length+1
                /*add_red_cross(dx,dy)
                add_red_cross(bx,by)
		throw {bx:bx,by:by,dx:dx,dy:dy,d:body_distance}*/
	    }
	}
	snake_body_dyn.some(check_body_inersection)
	// checking for intersection with body_2 and tail
	check_body_inersection(snake_body_2)
	check_body_inersection(snake_tail)
	if(growing) {
	    let delta = calc_growing_delta(growing_start, speed, x, y)
	    // console.log('delta',delta,'x',x,'y',y)
	    if(delta >= snake_body_length) {
		growing = eating = false
		if(mice.length < max_mice_count) {
		    let count = Math.round(Math.random() * max_new_mice_count)
		    if(mice.length + count < 1) count = 2
		    else if(mice.length + count > max_mice_count)
			count = max_mice_count - mice.length
		    while(count--) {
			let mouse = clone_mouse()
			random_mouse(mouse)
			mice.push(mouse)
		    }
		}
		let speed_increment = 0.01
		if(speed.x > 0) speed.x += speed_increment
		else if(speed.x < 0) speed.x -= speed_increment
		else if(speed.y > 0) speed.y += speed_increment
		else /* if(speed.y < 0) */ speed.y -= speed_increment
	    }
	}
	else(eating) {
	   let mouse_distance = Math.sqrt(Math.pow(eating.x - dx, 2) + Math.pow(eating.y - dy, 2))
           if(mouse_distance > snake_body_length) {
	       growing = true
	       growing_start = speed.x ? x : y
	       mice[eating.index].remove()
	       mice.splice(eating.index, 1)
	       first_snake_body = add_snake_body(first_snake_body)
	       snake_body_dyn.unshift(first_snake_body)
	       // counter.textContent = snake_body_dyn.length
	       ++counter.textContent
	       ++s_counter.textContent
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
	    if(cutting) ;
	    else {
		let mgx = mongoose.transform.baseVal[0].matrix.e + mongoose_delta_x - snake_delta_x
		let mgy = mongoose.transform.baseVal[0].matrix.f + mongoose_delta_y - snake_delta_y
		let mongoose_distance = Math.sqrt(Math.pow(mgx - dx, 2) + Math.pow(mgy - dy, 2))
		if(mongoose_distance < mgr) {
                    console.log ('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
		    mongoose_attack()
		    cutting = true
		    snake_body_dyn.forEach(boom)
		    boom(add_snake_body(snake_body_2))
		    snake_body_dyn.length = 0
		    first_snake_body = snake_body_2
		    setTimeout(function() {
			random_mongoose(mongoose)
			cutting = false
		    }, 200)
		}
	    }
	}
	prev = time
	requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)
}
