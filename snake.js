function rotate_sin_cos(m, sin, cos) {
    m.a = cos
    m.b = sin
    m.c = -sin
    m.d = cos
    m.e = 0
    m.f = 0
}

function move1(m1, m2, a, d, sign_y) {
    m2.e = m1.e = d - 2 * a
    m2.f = m1.f = d * sign_y
}

function move2(m1, m2, a, d, sign, sign_x) {
    m2.e = m1.e = a + d * sign * sign_x
    m2.f = m1.f = a * sign - d * sign
}

function start() {
   let box = document.getElementById('box')
   let snake = document.getElementById('snake')
   let snake_head_rotate = document.getElementById('snake_head_rotate')
   let snake_head_shift = document.getElementById('snake_head_shift')
   let snake_body_1 = document.getElementById('snake_body_1')
   let snake_tail = document.getElementById('snake_tail')
   let speed = {
      x: 1, y: 0
   }
   let snake_head_length = 1300
   let snake_tail_length = 1100
   let snake_body_length = 800
   let snake_delta_x = 7800
   let snake_delta_y = 12000
   let limit = {
         x: {
            left: 0 - snake_delta_x,
            right: box.width.baseVal.value - snake_head_length - box.attributes['stroke-width'].value - snake_delta_x,
         },
         y: {
            top: 0 - snake_delta_y,
            bottom: box.height.baseVal.value - snake_head_length - box.attributes['stroke-width'].value - snake_delta_y,
         }
      }
   function change_limit(x,y) {
     limit.x.left += x
     limit.x.right += x
     limit.y.top += y
     limit.y.bottom += y
   }
   let rotate_start = false
   let rotate_left, rotate_right
   let rotate_tail = false
   // console.log(limit)
   // console.log(snake_head_rotate.transform)
   // console.log(snake_head_rotate.transform.baseVal[0])
   // смена стартовой позиции при необходимости
   //   snake.transform.baseVal[0].matrix.e = 0
   //   snake.transform.baseVal[0].matrix.f = -10000
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
   // return
   let other_keyup = window.onkeyup
   window.onkeyup = function(e) {
	   if(e.key == 'ArrowLeft') {
	       rotate_left = true
               rotate_right = false
	       rotate_start = speed.x ? snake.transform.baseVal[0].matrix.e :
		   snake.transform.baseVal[0].matrix.f
	       console.log('left rotate_start:', rotate_start)
	   }
	   else if(e.key == 'ArrowRight') {
	       rotate_left = false
               rotate_right = true
               rotate_start = speed.x ? snake.transform.baseVal[0].matrix.e :
		   snake.transform.baseVal[0].matrix.f
	       console.log('right rotate_start:', rotate_start)
	   }
	   else if(other_keyup) other_keyup(e)
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
              delta_rotate_x = (x - rotate_start) * sign
              delta_rotate_y = delta_rotate_x
	      let leg = snake_head_length - (x - rotate_start) * sign
	      if(leg >= 0) {
		  let cos = leg / snake_head_length
		  let acos_rad = Math.acos(cos)
		  let sin = Math.sin(acos_rad)
		  if(rotate_left) sin = -sin
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, sin * sign, cos * sign)
	      }
	      else {
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, (rotate_left ? -1 : 1) * sign, 0)
		  leg += snake_body_length
		  if(leg >= 0) {
		      move1(snake_head_shift.transform.baseVal[0].matrix,
			    snake_body_1.transform.baseVal[0].matrix,
			    speed.x > 0 ? 0 : snake_body_length,
			    (leg - snake_body_length) * sign,
                            rotate_left ? 1 : -1)
		  }
		  else {
                      speed.y = rotate_left ? -speed.x : speed.x
                      speed.x = 0
		      rotate_start = false
		      rotate_tail = y
		      change_limit(delta_rotate_x,0)
		      delta_rotate_x = 0
		  }
	      }
	  }
	  else { // if(speed.y)
             let sign = speed.y < 0 ? 1 : -1
             let leg = snake_head_length - (rotate_start - y) * sign
             if(leg >= 0) {
		  let cos = leg / snake_head_length
		  let acos_rad = Math.acos(cos)
		  let sin = Math.sin(acos_rad)
		  if(rotate_left) sin = -sin
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, -cos * sign, sin * sign)
	      }
	      else {
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, 0, -1 * sign * (rotate_left ? 1 : -1))
		  leg += snake_body_length
		  if(leg >= 0) {
		      move2(snake_head_shift.transform.baseVal[0].matrix,
                            snake_body_1.transform.baseVal[0].matrix, -snake_body_length, leg - snake_body_length, sign, rotate_left ? 1 : -1)
		  }
		  else {
                      speed.x = rotate_left ? speed.y : -speed.y
                      speed.y = 0
		      rotate_start = false
		      rotate_tail = x
		      // change_limit(delta_rotate_x,0)
		      // delta_rotate_x = 0
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
      /*
      if (x - delta_rotate_x >= limit.x.right || x - delta_rotate_x <= limit.x.left ||
          y - delta_rotate_y >= limit.y.bottom || y - delta_rotate_y <= limit.y.top) {
          console.log({x:x, y:y, limit:limit,
		       delta_rotate_x:delta_rotate_x, delta_rotate_y:delta_rotate_y,
		       speed:speed})
        return
      }
      */
      snake.transform.baseVal[0].matrix.e = x
      snake.transform.baseVal[0].matrix.f = y
      prev = time
      requestAnimationFrame(draw)
   }
   requestAnimationFrame(draw)
}

