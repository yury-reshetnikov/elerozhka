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
   rocket.element = document.getElementById('rocket')
   let speed = {
      x: 9, y: 3
   }
   let prev = (new Date).getTime()
   function draw() {
      let time = (new Date).getTime()
      let tp = time - prev
      let x = ball.cx.baseVal.value + speed.x * tp
      let y = ball.cy.baseVal.value + speed.y * tp
      let limit = {
         x: {
            left: box.x.baseVal.value + ball.r.baseVal.value,
            right: box.x.baseVal.value + box.width.baseVal.value - ball.r.baseVal.value,
         },
         y: {
            top: box.y.baseVal.value + ball.r.baseVal.value,
            bottom: box.y.baseVal.value + box.height.baseVal.value - ball.r.baseVal.value,
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
      ball.cx.baseVal.value = x
      ball.cy.baseVal.value = y
      prev = time
      requestAnimationFrame(draw)
   }
   requestAnimationFrame(draw)
}
