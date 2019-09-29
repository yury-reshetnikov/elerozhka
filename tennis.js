function get_mouse_position(e) {
    let CTM = document.children[0].getScreenCTM()
    return {
	x: (e.screenX - CTM.e) / CTM.a,
	y: (e.screenY - CTM.f) / CTM.d
    }
}

function intersection(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
        // Взято здесь: https://profmeter.com.ua/communication/learning/course/course19/lesson194/
        // Чтобы вычислить правильные угловые коэффициенты, должно выполняться условие x1 ≤ x2; x3 ≤ x4;
        // Если нет - то меняем местами пары координат отрезков.
    if(ax1 > ax2) {
        let t = ax1
        ax1 = ax2
        ax2 = t
        t = ay1
        ay1 = ay2
        ay2 = t
    }
    if(bx1 > bx2) {
        let t = bx1
        bx1 = bx2
        bx2 = t
        t = by1
        by1 = by2
        by2 = t
    }
    let k1 = (ay2 - ay1) / (ax2 - ax1) // !!! +++ деление на 0!!! при x1 == x2
    let k2 = (by2 - by1) / (bx2 - bx1)
    if(k1 == k2) return false
    let b1 = ay1 - k1 * ax1
    let b2 = by1 - k2 * bx1
    let x = (b2 - b1) / (k1 - k2)
    let y = k1 * x + b1
    // Шаг 9 в источнике признан ошибочным
    if(x < ax1 || x > ax2 || x < bx1 || x > bx2 || y < Math.min(ay1, ay2) || y > Math.max(ay1, ay2) || y < Math.min(by1, by2) || y > Math.max(by1, by2)) return false
    console.log({ax1:ax1,ay1:ay1,ax2:ax2,ay2:ay2,bx1:bx1,by1:by1,bx2:bx2,by2:by2,k1:k1,k2:k2,b1:b1,b2:b2,x:x,y:y})
    return {x:x, y:y}
}

let rocket = {
    active: false,
    click: function(event) {
        if(this.active) this.active = false
        else {
            this.active = true
            this.origin = {}
            this.origin.x = this.element.transform.baseVal[0].matrix.e
            this.origin.y = this.element.transform.baseVal[0].matrix.f
            this.mouse = {}
            let p = get_mouse_position(event)
            this.mouse.x = p.x
            this.mouse.y = p.y
        }
    },
    close: function(event) {
        this.active = false
    },
    move: function(event) {
        if(this.active) {
            let p = get_mouse_position(event)
            let dx = p.x - this.mouse.x
            let x = this.origin.x + dx
            if(x < this.limit.x.left) x = this.limit.x.left
            if(x > this.limit.x.right) x = this.limit.x.right
            this.element.transform.baseVal[0].matrix.e = this.x = x
            let dy = p.y - this.mouse.y
            let y = this.origin.y + dy
            if(y < this.limit.y.top) y = this.limit.y.top
            if(y > this.limit.y.bottom) y = this.limit.y.bottom
            this.element.transform.baseVal[0].matrix.f = this.y = y
        }
    },
}

function start() {
   let box = document.getElementById('box')
   let ball = document.getElementById('ball')
   let ball_base = document.getElementById('ball_base')
   rocket.element = document.getElementById('rocket')
   rocket.x = rocket.element.transform.baseVal[0].matrix.e
   rocket.y = rocket.element.transform.baseVal[0].matrix.f
   let rocket_base = document.getElementById('rocket_base')
   let speed = {
      x: 9, y: 3
   }
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
   rocket.limit = {
         x: {
            left: 0,
            right: box.width.baseVal.value - (rocket_base.x2.baseVal.value - rocket_base.x1.baseVal.value) -
                   box.attributes['stroke-width'].value - rocket_base.attributes['stroke-width'].value,
         },
         y: {
            top: 0,
            bottom: box.height.baseVal.value - (rocket_base.y2.baseVal.value - rocket_base.y1.baseVal.value) -
                   box.attributes['stroke-width'].value - rocket_base.attributes['stroke-width'].value,
         }
      }
   rocket.width = rocket_base.x2.baseVal.value - rocket_base.x1.baseVal.value
   let prev = (new Date).getTime()
   function draw() {
      let time = (new Date).getTime()
      let tp = time - prev
      let old_x = ball.transform.baseVal[0].matrix.e
      let x = old_x + speed.x * tp
      let old_y = ball.transform.baseVal[0].matrix.f
      let y = old_y + speed.y * tp
      let intersection_point
      for(;;)
        if(intersection_point = intersection(old_x, old_y, x, y, rocket.x, rocket.y, rocket.x + rocket.width, rocket.y)) {
            console.log(intersection_point)
            if(isNaN(intersection_point.x) || isNaN(intersection_point.y)) return
            break
        }
	else if(x < limit.x.left) {
	    x = 2 * limit.x.left - x
	    // x = limit.x.left + (limit.x.left - x)
	    speed.x = -speed.x
	}
	else if(x > limit.x.right) {
	    x = 2 * limit.x.right - x
	    // x = limit_x_right - (x - limit_x_right)
	    speed.x = -speed.x
	}
	else if(y < limit.y.top) {
	    y = 2 * limit.y.top - y
	    speed.y = -speed.y
	}
	else if(y > limit.y.bottom) {
	    y = 2 * limit.y.bottom - y
	    speed.y = -speed.y
	}
	else break
      ball.transform.baseVal[0].matrix.e = x
      ball.transform.baseVal[0].matrix.f = y
      prev = time
      requestAnimationFrame(draw)
   }
   requestAnimationFrame(draw)
}
