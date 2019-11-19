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
   let rotate_start = false
   let rotate_left
   let rotate_tail = false
   // console.log(limit)
   // console.log(snake_head_rotate.transform)
   // console.log(snake_head_rotate.transform.baseVal[0])
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
      if(rotate_start !== false) {
	  if(speed.x) {
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
		  }
	      }
	  }
      }
      if(rotate_tail !== false) {
	  if(speed.y) {
	      let leg = snake_tail_length - (rotate_tail - y)
	      if(leg >= 0) {
		  // let sin = leg / snake_tail_length
		  // let angle = Math.asin(sin)
		  // let cos = Math.cos(angle)
		  let cos = leg / snake_tail_length
		  let angle = Math.acos(cos)
		  let sin = Math.sin(angle)
		  if(rotate_left) sin = -sin
		  rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, sin, cos)
	      }
	      else {
		  rotate_sin_cos(snake_tail.transform.baseVal[0].matrix, -1, 0)
		  rotate_tail = false
	      }
	  }
      }
      if (x >= limit.x.right || x <= limit.x.left || y >= limit.y.bottom || y <= limit.y.top) {
        console.log({x:x, y:y, limit:limit})
        return
      }
      snake.transform.baseVal[0].matrix.e = x
      snake.transform.baseVal[0].matrix.f = y
      prev = time
      requestAnimationFrame(draw)
   }
   requestAnimationFrame(draw)
}
