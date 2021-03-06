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
   // let snake_body_1 = document.getElementById('snake_body_1')
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
   let snake_growing_direction_x = 0
   let snake_growing_direction_y = 0
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
   let rotate_start = false
   let rotate_left, rotate_right
   let rotate_tail = false
   let eating = false, growing = false, growing_start, growing_base
   let first_snake_body = snake_body_2
    let random_mouse = function(mouse) {
	mouse.transform.baseVal[0].matrix.e = Math.round(Math.random() * (limit.x.right - limit.x.left - snake_body_length * 3)) + limit.x.left + snake_body_length + snake_delta_x - mouse_delta_x
	mouse.transform.baseVal[0].matrix.f = Math.round(Math.random() * (limit.y.bottom - limit.y.top - snake_body_length * 3)) + limit.y.top + snake_body_length + snake_delta_y - mouse_delta_y
    }
    // random_mouse(mice[0])
    { let mouse = document.createElementNS('http://www.w3.org/2000/svg', 'use')
      mouse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#mouse_pattern')
      mouse.setAttribute('transform', 'translate(0,0)')
      document.children[0].insertBefore(mouse, snake)
      mouse.transform.baseVal[0].matrix.e = 100
      mice.push(mouse)
    }
   // console.log(limit)
   // console.log(snake_head_rotate.transform)
   // console.log(snake_head_rotate.transform.baseVal[0])
   // смена стартовой позиции при необходимости
   //snake.transform.baseVal[0].matrix.e = 5300
   //snake.transform.baseVal[0].matrix.f = -10000
   //snake.transform.baseVal[0].matrix.f = -200
/**
    { // полный поворот вверх
	rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, -1, 0)
	move1(snake_head_shift.transform.baseVal[0].matrix, -snake_body_length)
	move1(snake_body_1.transform.baseVal[0].matrix, -snake_body_length)
	rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, -1, 0)
    }
    {   let leg = 1200
	let cos = leg / snake_head_length
	let acos_rad = Math.acos(cos)
	let sin = Math.sin(acos_rad)
	sin = -sin
	rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, -cos, sin)
    }
**/
   // console.dir(snake_body_1)
   // window.test = snake_body_1
   // add_snake_body(snake_body_1)
   // return
   let other_keyup = window.onkeyup
   window.onkeyup = function(e) {
	   if(e.key == 'ArrowLeft') {
               if(rotate_start === false && !eating) {
	           rotate_left = true
                   rotate_right = false
	           rotate_start = speed.x ? snake.transform.baseVal[0].matrix.e :
		       snake.transform.baseVal[0].matrix.f
	           console.log('left rotate_start:', rotate_start)
               }
	   }
	   else if(e.key == 'ArrowRight') {
               if(rotate_start === false && !eating) {
	           rotate_left = false
                   rotate_right = true
                   rotate_start = speed.x ? snake.transform.baseVal[0].matrix.e :
		       snake.transform.baseVal[0].matrix.f
	           console.log('right rotate_start:', rotate_start)
               }
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
    function move1(m1, dyn, a, leg, sign_x, sign_y) {
        let m2 = dyn[0].transform.baseVal[0].matrix
        let d = leg * sign_x
	let dyn_length = dyn.length
	if(growing) --dyn_length
	if(sign_x > 0) m1.e = d - (snake_growing_direction_x - dyn_length) * snake_body_length
        else m1.e = d - (dyn_length + snake_growing_direction_x) * a
        m1.f = -snake_body_length * snake_growing_direction_y + d * sign_y
	if(growing) return
        m2.e = d - 2 * dyn_length * a
        m2.f = d * sign_y
        leg += snake_body_length
        let i = 1
        while(leg < 0 && i < dyn_length) {
            let m = dyn[i].transform.baseVal[0].matrix
            let d = leg * sign_x
            m.e = d - 2 * (dyn_length - i) * a
            m.f = d * sign_y
            leg += snake_body_length
            ++i
        }
    }
    function move2(m1, dyn, leg, sign, sign_x) {
	let dyn_length = dyn.length
	if(growing) --dyn_length
        let m2 = dyn[0].transform.baseVal[0].matrix
	let a = -snake_body_length * dyn_length
	let d = leg
        m1.e = -snake_body_length * snake_growing_direction_x + d * sign * sign_x
        m1.f = -snake_body_length * snake_growing_direction_y + a * sign - d * sign
	if(growing) return
        m2.e = a + d * sign * sign_x
        m2.f = a * sign - d * sign
        leg += snake_body_length
        let i = 1
	while(leg < 0 && i < dyn_length) {
            let m = dyn[i].transform.baseVal[0].matrix
	    let a = -snake_body_length * (dyn_length - i)
	    let d = leg
            m.e = a + d * sign * sign_x
            m.f = a * sign - d * sign
            leg += snake_body_length
            ++i
	}
    }
    function add_snake_body(base) {
	var node = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
	node.cx.baseVal.value = base.cx.baseVal.value + snake_body_length
	node.cy.baseVal.value = base.cy.baseVal.value
	node.r.baseVal.value = base.r.baseVal.value
	node.setAttribute('fill', base.attributes.fill.value)
	node.setAttribute('stroke', base.attributes.stroke.value)
	let tx = 0, ty = 0
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
	node.setAttribute('transform', 'translate('+tx+','+ty+')')
	// base.parentNode.insertBefore(node, base.nextSibling)
	snake_full_body.append(node)
	return node
    }
   let prev = (new Date).getTime()
   function draw() {
      let time = (new Date).getTime()
      let tp = time - prev
      let old_x = snake.transform.baseVal[0].matrix.e
      let x = old_x + speed.x * tp
      let old_y = snake.transform.baseVal[0].matrix.f
      let y = old_y + speed.y * tp
      let delta_rotate_x = 0
      let delta_rotate_y = 0
      if(rotate_start !== false) {
	  if(speed.x) {
	      let sign = speed.x > 0 ? 1 : -1
              delta_rotate_x = (x - rotate_start + snake_body_length_half * sign)
              delta_rotate_y = (x - rotate_start) * (rotate_left ? 1 : -1)
	      let leg = snake_head_length - (x - rotate_start) * sign
	      if(leg >= 0) {
		  let cos = leg / snake_head_length
		  let acos_rad = Math.acos(cos)
		  let sin = Math.sin(acos_rad)
		  if(rotate_left) sin = -sin
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, sin * sign, cos * sign)
                  delta_rotate_y -= snake_body_length * sign * (rotate_left ? -1 : 1)
	      }
	      else {
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, (rotate_left ? -1 : 1) * sign, 0)
		  if(leg + snake_body_length * snake_body_dyn.length >= 0) {
		      move1(snake_head_shift.transform.baseVal[0].matrix,
			    snake_body_dyn,
			    speed.x > 0 ? 0 : snake_body_length,
			    leg, sign,
                            rotate_left ? 1 : -1)
                      delta_rotate_y -= snake_body_length_half * sign * (rotate_left ? -1 : 1)
		  }
		  else {
                      speed.y = rotate_left ? -speed.x : speed.x
                      speed.x = 0
		      rotate_start = false
		      rotate_tail = y
		      delta_rotate_x = delta_rotate_y = 0
		  }
	      }
	  }
	  else { // if(speed.y)
             let sign = speed.y < 0 ? 1 : -1
             delta_rotate_y = (y - rotate_start + snake_body_length_half * -sign)
             delta_rotate_x = (y - rotate_start) * (rotate_left ? -1 : 1)
             let leg = snake_head_length - (rotate_start - y) * sign
             if(leg >= 0) {
		  let cos = leg / snake_head_length
		  let acos_rad = Math.acos(cos)
		  let sin = Math.sin(acos_rad)
		  if(rotate_left) sin = -sin
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, -cos * sign, sin * sign)
                  delta_rotate_x -= snake_body_length * sign * (rotate_left ? -1 : 1)
	      }
	      else {
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, 0, -1 * sign * (rotate_left ? 1 : -1))
		  if(leg + snake_body_length * snake_body_dyn.length >= 0) {
		      move2(snake_head_shift.transform.baseVal[0].matrix,
                            snake_body_dyn, leg, sign, rotate_left ? 1 : -1)
                      delta_rotate_x -= snake_body_length / 2 * sign * (rotate_left ? -1 : 1)
		  }
		  else {
                      speed.x = rotate_left ? speed.y : -speed.y
                      speed.y = 0
		      rotate_start = false
		      rotate_tail = x
		      delta_rotate_x = delta_rotate_y = 0
		  }
	      }
	  }
      }
      if(rotate_tail !== false) {
	  if(speed.y) {
              let sign = speed.y < 0 ? 1 : -1
	      let leg = (rotate_tail - y) * sign
	      if(leg <= snake_tail_length) {
		  let sin = leg / snake_tail_length
	          if(rotate_right) {
                      sign = -sign
                      sin = -sin
	          }
		  let angle = Math.asin(sin)
		  let cos = Math.cos(angle)
		  sin = -sin
		  rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, sin * sign, cos * sign)
	      }
	      else {
		  rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, -1 * sign, 0)
		  rotate_tail = false
		  console.log('rotate finished')
	      }
	  }
	  else {
              let sign = speed.x < 0 ? 1 : -1
              let leg = (rotate_tail - x) * sign
	      if(leg <= snake_tail_length) {
		  let sin = leg / snake_tail_length
	          if(rotate_right) {
                      sign = -sign
                      sin = -sin
	          }
		  let angle = Math.asin(sin)
		  let cos = Math.cos(angle)
		  sin = -sin
		  rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, -cos * sign, sin * sign)
	      }
	      else {
		  rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, 0, -1 * sign)
		  rotate_tail = false
		  console.log('rotate finished')
	      }
	  }
      }
      snake.transform.baseVal[0].matrix.e = x
      snake.transform.baseVal[0].matrix.f = y
       let dx = x - delta_rotate_x,
	   dy = y - delta_rotate_y - snake_growing_direction_y * snake_body_length
// +++ ??? snake_growing_direction_x
      let delta = snake_head_length + snake_body_length * snake_body_dyn.length +
	   Math.round(snake_body_length * 0.5)
      if(speed.y < 0) {
          dx -= snake_head_length +
	      snake_body_length * snake_growing_direction_x +
	      Math.round(snake_body_length * 0.5)
	  dy -= delta
      }
      else if(speed.y > 0) {
          dx -= snake_head_length +
	      snake_body_length * snake_growing_direction_x +
	      Math.round(snake_body_length * 0.5)
          dy += delta
      }
      else if(speed.x < 0) {
          dx -= 2 * snake_head_length +
	      snake_body_length * (snake_body_dyn.length + snake_growing_direction_x) +
	      2 * Math.round(snake_body_length * 0.5)
      }
      else if(speed.x > 0) {
          dx += snake_body_length * (snake_body_dyn.length - snake_growing_direction_x)
      }
      if(dx >= limit.x.right || dx <= limit.x.left || dy >= limit.y.bottom || dy <= limit.y.top) {
          console.log('limit reached', {x:x, y:y, dx:dx, dy:dy, limit:limit,
		delta_rotate_x:delta_rotate_x, delta_rotate_y:delta_rotate_y,
		speed:speed, delta:delta, snake_body_dyn_length:snake_body_dyn.length,
		snake_growing_direction_x:snake_growing_direction_x,
		snake_growing_direction_y:snake_growing_direction_y})
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
	      if(speed.x > 0) {
		  snake_full_body.transform.baseVal[0].matrix.e =
		      growing_base - snake_body_length
		  ++snake_growing_direction_x
		  speed.x += speed_increment
	      }
	      else if(speed.x < 0) {
		  snake_full_body.transform.baseVal[0].matrix.e =
		      growing_base + snake_body_length
		  --snake_growing_direction_x
		  speed.x -= speed_increment
	      }
              else if(speed.y > 0) {
                  snake_full_body.transform.baseVal[0].matrix.f =
                      growing_base - snake_body_length
		  ++snake_growing_direction_y
		  speed.y += speed_increment
              }
              else if(speed.y < 0) {
                  snake_full_body.transform.baseVal[0].matrix.f =
                      growing_base + snake_body_length
                  --snake_growing_direction_y
		  speed.y -= speed_increment
              }
	  }
	  else {
	      if(speed.x > 0) snake_full_body.transform.baseVal[0].matrix.e =
		  growing_base - delta
	      else if(speed.x < 0) snake_full_body.transform.baseVal[0].matrix.e =
		  growing_base + delta
              else if(speed.y > 0) snake_full_body.transform.baseVal[0].matrix.f =
		  growing_base - delta
              else if(speed.y < 0) snake_full_body.transform.baseVal[0].matrix.f =
		  growing_base + delta
	  }
      }
       else if(eating) {
	   let mouse_distance = Math.sqrt(Math.pow(eating.x - dx, 2) + Math.pow(eating.y - dy, 2))
           if(mouse_distance > snake_body_length) {
	       growing = true
	       if(speed.x) {
		   growing_start = x
		   growing_base = snake_full_body.transform.baseVal[0].matrix.e
	       }
	       else {
		   growing_start = y
		   growing_base = snake_full_body.transform.baseVal[0].matrix.f
	       }
	       mice[eating.index].remove()
	       mice.splice(eating.index, 1)
	       first_snake_body = add_snake_body(first_snake_body)
	       snake_body_dyn.unshift(first_snake_body)
	       if(rotate_start !== false) {
		   if(speed.x > 0) {
		       let delta = rotate_start - x + snake_head_length - snake_body_length
		       first_snake_body.transform.baseVal[0].matrix.e = delta
		       first_snake_body.transform.baseVal[0].matrix.f =
			   delta * (rotate_left ? 1 : -1)
		   }
		   else if(speed.x < 0) {
		       let delta = rotate_start + x + snake_head_length - snake_body_length
		       first_snake_body.transform.baseVal[0].matrix.e = delta
		       first_snake_body.transform.baseVal[0].matrix.f =
			   delta * (rotate_left ? 1 : -1)
		   }
		   else if(speed.y > 0) {
		       let delta = rotate_start - y + snake_head_length - snake_body_length
		       first_snake_body.transform.baseVal[0].matrix.e = delta * (rotate_left ? 1 : -1)
		       first_snake_body.transform.baseVal[0].matrix.f = delta
		   }
		   else if(speed.y < 0) {
		       let delta = rotate_start + y + snake_head_length - snake_body_length
		       first_snake_body.transform.baseVal[0].matrix.e = delta * (rotate_left ? 1 : -1)
		       first_snake_body.transform.baseVal[0].matrix.f = delta
		   }
	       }
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

function mongoose() {
    let mongoose = document.getElementById('mongoose2')
    let mongoose_att = document.getElementById('mongoose3')
    let a = new Animate3
    let time_s = 10
    let time_f = 160
    a.path ('mongoose2_body', 'mongoose2_t_body', 'mongoose3_body', time_s, time_f)
    a.path ('mongoose2_ear2', 'mongoose2_t_ear2', 'mongoose3_ear2', time_s, time_f)
    a.path ('mongoose2_ear1', 'mongoose2_t_ear1', 'mongoose3_ear1', time_s, time_f)
    a.path ('mongoose2_nose', 'mongoose2_t_nose', 'mongoose3_nose', time_s, time_f)
    a.translate ('mongoose2_eye', 0, 0, 920, -665, time_s, time_f)
    a.translate ('mongoose2_eyeball', 0, 0, 920, -665, time_s, time_f)
    a.start()
}
