function start() {
    let box = document.getElementById('box')
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
    let eating = false, growing = false, growing_start, growing_base
    let first_snake_body = snake_body_2
    let random_mouse = function(mouse) {
	mouse.transform.baseVal[0].matrix.e = Math.round(Math.random() * (limit.x.right - limit.x.left - snake_body_length * 3)) + limit.x.left + snake_body_length + snake_delta_x - mouse_delta_x
	mouse.transform.baseVal[0].matrix.f = Math.round(Math.random() * (limit.y.bottom - limit.y.top - snake_body_length * 3)) + limit.y.top + snake_body_length + snake_delta_y - mouse_delta_y
    }
    // random_mouse(mice[0])
    let other_keyup = window.onkeyup
    window.onkeyup = function(e) {
	if(other_keyup) other_keyup(e)
    }
    function add_snake_body(base) {
	var node = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
	node.cx.baseVal.value = base.cx.baseVal.value + snake_body_length
	node.cy.baseVal.value = base.cy.baseVal.value
	node.r.baseVal.value = base.r.baseVal.value
	node.setAttribute('fill', base.attributes.fill.value)
	node.setAttribute('stroke', base.attributes.stroke.value)
	let tx = 0, ty = 0
	/*
	if(speed.x < 0) {
	    tx = -snake_body_length * (snake_body_dyn.length + 1) * 2
	}
	else if(speed.y < 0) {
	    tx = -snake_body_length * (snake_body_dyn.length + 1)
	    ty = -snake_body_length * (snake_body_dyn.length + 1)
	}
	else if(speed.y > 0) {
	    tx = -snake_body_length * (snake_body_dyn.length + 1)
	    ty = snake_body_length * (snake_body_dyn.length + 1)
	}
	*/
	node.setAttribute('transform', 'translate('+tx+','+ty+')')
	snake_full_body.append(node)
	return node
    }
    function move(node, x, y) {
	node.transform.baseVal[0].matrix.e = x
	node.transform.baseVal[0].matrix.f = y
    }
    let prev = (new Date).getTime()
    function draw() {
	let time = (new Date).getTime()
	let tp = time - prev
	let old_x = snake_head_shift.transform.baseVal[0].matrix.e
	let x = old_x + speed.x * tp
	let old_y = snake_head_shift.transform.baseVal[0].matrix.f
	let y = old_y + speed.y * tp
	
	move(snake_head_shift, x, y)
	move(snake_body_2, x, y)
	move(snake_tail, x, y)
	prev = time
	requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)
}
