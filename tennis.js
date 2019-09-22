function get_mouse_position(e) {
    let CTM = document.children[0].getScreenCTM()
    return {
	x: (e.screenX - CTM.e) / CTM.a,
	y: (e.screenY - CTM.f) / CTM.d
    }
}

let rocket = {
    active: false,
    click: function(event) {
        if(this.active) this.active = false
        else {
            this.active = true
            this.origin = {}
            this.origin.x1 = this.element.x1.baseVal.value
            this.origin.x2 = this.element.x2.baseVal.value
            this.mouse = {}
            let p = get_mouse_position(event)
            this.mouse.x = p.x
        }
    },
    close: function(event) {
        this.active = false
    },
    move: function(event) {
        if(this.active) {
            let p = get_mouse_position(event)
            let dx = p.x - this.mouse.x
            this.element.x1.baseVal.value = this.origin.x1 + dx
            this.element.x2.baseVal.value = this.origin.x2 + dx
        }
    },
}

function start() {
   let box = document.getElementById('box')
   let ball = document.getElementById('ball')
   let ball_base = document.getElementById('ball_base')
   rocket.element = document.getElementById('rocket')
   let speed = {
      x: 9, y: 3
   }
   let prev = (new Date).getTime()
   function draw() {
      let time = (new Date).getTime()
      let tp = time - prev
      let x = ball.transform.baseVal[0].matrix.e + speed.x * tp
      let y = ball.transform.baseVal[0].matrix.f + speed.y * tp
      let limit = {
         x: {
            left: 0,
            right: box.width.baseVal.value - ball_base.r.baseVal.value * 2 - box.attributes['stroke-width'].value,
         },
         y: {
            top: 0,
            bottom: box.height.baseVal.value - ball_base.r.baseVal.value * 2 - box.attributes['stroke-width'].value,
         }
      }
      if(x < limit.x.left) {
         x = 2 * limit.x.left - x
         // x = limit.x.left + (limit.x.left - x)
         speed.x = -speed.x
      }
      if(x > limit.x.right) {
         x = 2 * limit.x.right - x
         // x = limit_x_right - (x - limit_x_right)
         speed.x = -speed.x
      }
      if(y < limit.y.top) {
        y = 2 * limit.y.top - y
        speed.y = -speed.y
      }
      if(y > limit.y.bottom) {
        y = 2 * limit.y.bottom - y
        speed.y = -speed.y
      }
      ball.transform.baseVal[0].matrix.e = x
      ball.transform.baseVal[0].matrix.f = y
      prev = time
      requestAnimationFrame(draw)
   }
   requestAnimationFrame(draw)
}
