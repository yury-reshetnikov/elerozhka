function rotate_sin_cos(m, sin, cos) {
    m.a = cos
    m.b = sin
    m.c = -sin
    m.d = cos
    m.e = 0
    m.f = 0
}

function move1(m, d) {
    m.e = d
    m.f = d
}

function move2(m, a, d) {
    m.e = a + d
    m.f = a - d
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
   let rotate_left
   let rotate_tail = false
   // console.log(limit)
   // console.log(snake_head_rotate.transform)
   // console.log(snake_head_rotate.transform.baseVal[0])
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
	       rotate_start = speed.x ? snake.transform.baseVal[0].matrix.e :
		   snake.transform.baseVal[0].matrix.f
	       console.log('rotate_start:', rotate_start)
            /*
            if (speed.x) {
                speed.y = -speed.x
                speed.x = 0
            }
            else {
                speed.x = speed.y
                speed.y = 0
            }
            */
	   }
	   else if(e.key == 'ArrowRight') {
            if(speed.x) {
                speed.y = speed.x
                speed.x = 0
            }
            else {
                speed.x = -speed.y
                speed.y = 0
            }
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
              delta_rotate_x = x - rotate_start
              delta_rotate_y = delta_rotate_x
	      let leg = snake_head_length - (x - rotate_start)
	      if(leg >= 0) {
		  let cos = leg / snake_head_length
		  let acos_rad = Math.acos(cos)
		  let sin = Math.sin(acos_rad)
		  if(rotate_left) sin = -sin
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, sin, cos)
	      }
	      else {
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, rotate_left ? -1 : 1, 0)
		  leg += snake_body_length
		  if(leg >= 0) {
		      move1(snake_head_shift.transform.baseVal[0].matrix, leg - snake_body_length)
		      move1(snake_body_1.transform.baseVal[0].matrix, leg - snake_body_length)
		  }
		  else {
                      speed.y = -speed.x
                      speed.x = 0
		      rotate_start = false
		      rotate_tail = y
		      change_limit(delta_rotate_x,0)
		      delta_rotate_x = 0
		  }
	      }
	  }
	  else {
             let leg = snake_head_length - (rotate_start - y)
             if(leg >= 0) {
		  let cos = leg / snake_head_length
		  let acos_rad = Math.acos(cos)
		  let sin = Math.sin(acos_rad)
		  if(rotate_left) sin = -sin
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, -cos, sin)
	      }
	      else {
		  rotate_sin_cos(snake_head_rotate.transform.baseVal[0].matrix, 0, -1)
		  leg += snake_body_length
		  if(leg >= 0) {
		      move2(snake_head_shift.transform.baseVal[0].matrix, -snake_body_length, leg - snake_body_length)
		      move2(snake_body_1.transform.baseVal[0].matrix, -snake_body_length, leg - snake_body_length)
		  }
		  else {
                      speed.x = speed.y
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
	      // let leg = snake_tail_length - (rotate_tail - y)
	      let leg = rotate_tail - y
	      if(leg <= snake_tail_length) {
		  let sin = leg / snake_tail_length
		  let angle = Math.asin(sin)
		  let cos = Math.cos(angle)
		  if(rotate_left) sin = -sin
		  rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, sin, cos)
	      }
	      else {
		  rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, -1, 0)
		  rotate_tail = false
	      }
	  }
	  else {
              let leg = rotate_tail - x
	      if(leg <= snake_tail_length) {
		  let sin = leg / snake_tail_length
		  let angle = Math.asin(sin)
		  let cos = Math.cos(angle)
		  if(rotate_left) sin = -sin
		  rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, -cos, sin)
	      }
	      else {
		  rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, 0, -1)
		  rotate_tail = false
	      }
	  }
      }
      if (x - delta_rotate_x >= limit.x.right || x - delta_rotate_x <= limit.x.left ||
          y - delta_rotate_y >= limit.y.bottom || y - delta_rotate_y <= limit.y.top) {
          console.log({x:x, y:y, limit:limit,
		       delta_rotate_x:delta_rotate_x, delta_rotate_y:delta_rotate_y,
		       speed:speed})
        return
      }
      snake.transform.baseVal[0].matrix.e = x
      snake.transform.baseVal[0].matrix.f = y
      prev = time
      requestAnimationFrame(draw)
   }
   requestAnimationFrame(draw)
}

