function start() {
   let box = document.getElementById('box')
   let snake = document.getElementById('snake')
   let snake_head_rotate = document.getElementById('snake_head_rotate')
   let speed = {
      x: 1, y: 0
   }
   let snake_head_length = 1300
   let snake_rotate_length = 1700
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
   // console.log(limit)
   // console.log(snake_head_rotate.transform)
   // snake_head_rotate.transform.baseVal[0].angle = -90
   // console.log(snake_head_rotate.transform.baseVal[0].angle)
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
	      // snake_head_rotate.transform.baseVal[0].angle = Math.round(Math.acos(
	      // 	  (snake_rotate_length - (x - rotate_start)) / snake_rotate_length) * 180 / Math.PI)
	      // console.log('angle:', snake_head_rotate.transform.baseVal[0].angle)
	      let leg = snake_head_length - (x - rotate_start)
	      if(leg < 0) return
	      let cos = leg / snake_head_length
	      let acos_rad = Math.acos(cos)
	      let sin = Math.sin(acos_rad)
	      if(rotate_left) sin = -sin
	      let acos_gr = acos_rad * 180 / Math.PI
	      let angle = Math.round(acos_gr)
	      console.log('leg:', leg, ' cos:', cos, ' rad:', acos_rad, ' gr:', acos_gr, ' a:', angle)
	      // snake_head_rotate.transform.angle = -angle
	      let m = snake_head_rotate.transform.baseVal[0].matrix
	      m.a = cos
	      m.b = sin
	      m.c = -sin
	      m.d = cos
	      m.e = 0
	      m.f = 0
	      console.log('angle:', snake_head_rotate.transform.baseVal[0].angle)
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
