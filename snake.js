function start() {
   let box = document.getElementById('box')
   let snake = document.getElementById('snake')
   let speed = {
      x: 3, y: 0
   }
   let snake_head_length = 1500
   let snake_delta_x = 7600
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
   // console.log(limit)
   let prev = (new Date).getTime()
   function draw() {
      let time = (new Date).getTime()
      let tp = time - prev
      let old_x = snake.transform.baseVal[0].matrix.e
      let x = old_x + speed.x * tp
      let old_y = snake.transform.baseVal[0].matrix.f
      let y = old_y + speed.y * tp
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
