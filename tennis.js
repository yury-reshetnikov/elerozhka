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
    // console.log({ax1:ax1,ay1:ay1,ax2:ax2,ay2:ay2,bx1:bx1,by1:by1,bx2:bx2,by2:by2})
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
    if(ax1 == ax2) {
        if(bx1 == bx2) return false
        let x = ax1
        if (x < bx1 || x > bx2) return false
        let k2 = (by2 - by1) / (bx2 - bx1)
        let b2 = by1 - k2 * bx1
        let y = Math.round(k2 * x + b2)
        if(y < Math.min(ay1, ay2) || y > Math.max(ay1, ay2) || y < Math.min(by1, by2) || y > Math.max(by1, by2)) return false
        return {x:x, y:y}
    }
    else if(bx1 == bx2) {
        let x = bx1
        if(x < ax1 || x > ax2) return false
        let k1 = (ay2 - ay1) / (ax2 - ax1)
        let b1 = ay1 - k1 * ax1
        let y = Math.round(k1 * x + b1)
        if(y < Math.min(ay1, ay2) || y > Math.max(ay1, ay2) || y < Math.min(by1, by2) || y > Math.max(by1, by2)) return false
        return {x:x, y:y}
    }
    let k1 = (ay2 - ay1) / (ax2 - ax1)
    let k2 = (by2 - by1) / (bx2 - bx1)
    if(k1 == k2) return false
    let b1 = ay1 - k1 * ax1
    let b2 = by1 - k2 * bx1
    let x = Math.round((b2 - b1) / (k1 - k2))
    let y = Math.round(k1 * x + b1)
    // Шаг 9 в источнике признан ошибочным
    if(x < ax1 || x > ax2 || x < bx1 || x > bx2 || y < Math.min(ay1, ay2) || y > Math.max(ay1, ay2) || y < Math.min(by1, by2) || y > Math.max(by1, by2)) return false
    console.log({ax1:ax1,ay1:ay1,ax2:ax2,ay2:ay2,bx1:bx1,by1:by1,bx2:bx2,by2:by2,k1:k1,k2:k2,b1:b1,b2:b2,x:x,y:y})
    return {x:x, y:y}
}

// console.log(intersection(10, 10, 100, 100, 20, 40, 70, 10))

let rocket = {
    active: false,
    click: function(event) {
        // console.log({rx:this.x,ry:this.y})
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
            this.element.transform.baseVal[0].matrix.e = this.x = Math.round(x)
            let dy = p.y - this.mouse.y
            let y = this.origin.y + dy
            if(y < this.limit.y.top) y = this.limit.y.top
            if(y > this.limit.y.bottom) y = this.limit.y.bottom
            this.element.transform.baseVal[0].matrix.f = this.y = Math.round(y)
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
   let rocket_height = rocket_base.attributes['stroke-width'].value
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
                   box.attributes['stroke-width'].value - rocket_height,
         },
         y: {
            top: 0,
            bottom: box.height.baseVal.value - (rocket_base.y2.baseVal.value - rocket_base.y1.baseVal.value) -
                   box.attributes['stroke-width'].value - rocket_height,
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
      let rocket_delta = Math.round(rocket_height / 2 + ball_base.r.baseVal.value)
      let rocket_box = {x1:rocket.x - rocket_delta, y1:rocket.y - rocket_delta, x2:rocket.x + rocket.width + rocket_delta, y2:rocket.y + rocket_delta}
      let intersection_point
      for(;;)
        if(x > rocket_box.x1 && x < rocket_box.x2 && y > rocket_box.y1 && y < rocket_box.y2) { //новая позиция шарика находится внутри ракетки
            if(intersection_point = intersection(old_x, old_y, x, y, rocket_box.x1, rocket_box.y1, rocket_box.x2, rocket_box.y1)) { //пересечение с верхней гранью ракетки
                console.log({old_x:old_x,old_y:old_y,x:x,y:y,box:rocket_box,p:intersection_point})
                y = y - 2 * (y - intersection_point.y)
                old_x = intersection_point.x
                old_y = intersection_point.y
                speed.y = -speed.y
                console.log({old_x:old_x,old_y:old_y,x:x,y:y})
            }
            else if(intersection_point = intersection(old_x, old_y, x, y, rocket_box.x1, rocket_box.y2, rocket_box.x2, rocket_box.y2)) { //пересечение с нижней гранью ракетки
                console.log({old_x:old_x,old_y:old_y,x:x,y:y,box:rocket_box,p:intersection_point})
                y = y - 2 * (y - intersection_point.y)
                old_x = intersection_point.x
                old_y = intersection_point.y
                speed.y = -speed.y
                console.log({old_x:old_x,old_y:old_y,x:x,y:y})
            }
            else {
                console.log({rocket:rocket,rocket_box:rocket_box,old_x:old_x,old_y:old_y,x:x,y:y})
                break
            }
        }
        else if(intersection_point = intersection(old_x, old_y, x, y, rocket.x, rocket.y, rocket.x + rocket.width, rocket.y)) {
            console.log(intersection_point)
            if(isNaN(intersection_point.x) || isNaN(intersection_point.y)) return
            y = y - 2 * (y - intersection_point.y)
            old_x = intersection_point.x
            old_y = intersection_point.y
            speed.y = -speed.y
        }
        // +++ !!! при отражении поменять old_x и old_y на точку отражения (у стенки)
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
