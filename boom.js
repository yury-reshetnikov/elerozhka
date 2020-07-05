let snake_body = document.getElementById('snake_body')

function create_ball(cx, cy, r, element) {
    let ball = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    ball.setAttribute('cx', cx)
    ball.setAttribute('cy', cy)
    ball.setAttribute('r', r)
    ball.setAttribute('fill', 'green')
    ball.setAttribute('stroke', 'black')
    document.children[0].insertBefore(ball, element)
    return ball
}

/*function play() {
    create_ball(4875, 4800, 100, snake_body)
    create_ball(5125, 4800, 100, snake_body)
    create_ball(4750, 5000, 100, snake_body)
    create_ball(5250, 5000, 100, snake_body)
    create_ball(4875, 5200, 100, snake_body)
    create_ball(5125, 5200, 100, snake_body)
    create_ball(5000, 5000, 400, snake_body)
}*/

function animate_big_ball(animate_id, ball) {
    let animate_fill = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    animate_fill.setAttribute('id', animate_id)
    animate_fill.setAttribute('attributeName', 'fill-opacity')
    animate_fill.setAttribute('by', '-1')
    animate_fill.setAttribute('dur', '0.2s')
    animate_fill.setAttribute('fill', 'freeze')
    animate_fill.setAttribute('begin', 'indefinite')
    ball.append(animate_fill)
    let animate_stroke = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    animate_stroke.setAttribute('attributeName', 'stroke-opacity')
    animate_stroke.setAttribute('by', '-1')
    animate_stroke.setAttribute('dur', '0.2s')
    animate_stroke.setAttribute('fill', 'freeze')
    animate_stroke.setAttribute('begin', animate_id + '.begin')
    ball.append(animate_stroke)
}

function animate_small_balls(animate_id, ball, sign_x, sign_y) {
    let animate_flight_x = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    animate_flight_x.setAttribute('attributeName', 'cx')
    animate_flight_x.setAttribute('by', 10000 * sign_x)
    animate_flight_x.setAttribute('dur', '1s')
    animate_flight_x.setAttribute('fill', 'freeze')
    animate_flight_x.setAttribute('begin', animate_id + '.begin')
    ball.append(animate_flight_x)
    let animate_flight_y = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    animate_flight_y.setAttribute('attributeName', 'cy')
    animate_flight_y.setAttribute('by', -5000 * sign_y)
    animate_flight_y.setAttribute('dur', '1s')
    animate_flight_y.setAttribute('fill', 'freeze')
    animate_flight_y.setAttribute('begin', animate_id + '.begin')
    ball.append(animate_flight_y)
    let animate_fill = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    animate_fill.setAttribute('attributeName', 'fill-opacity')
    animate_fill.setAttribute('by', '-1')
    animate_fill.setAttribute('dur', '0.2s')
    animate_fill.setAttribute('fill', 'freeze')
    animate_fill.setAttribute('begin', animate_id + '.begin + 0.8s')
    ball.append(animate_fill)
    let animate_stroke = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    animate_stroke.setAttribute('attributeName', 'stroke-opacity')
    animate_stroke.setAttribute('by', '-1')
    animate_stroke.setAttribute('dur', '0.2s')
    animate_stroke.setAttribute('fill', 'freeze')
    animate_stroke.setAttribute('begin', animate_id + '.begin + 0.8s')
    ball.append(animate_stroke)
}

function create_balls_group(animate_id, x, y) {
    let big_ball = create_ball(x, y, 400, snake_body)
    /*
    for(let n = 0; n < 12; ++n) {
	let angle = Math.PI / 6 * n
	// console.log('n',n,'angle',angle,'x',Math.round(Math.cos(angle)*250),'y',Math.round(Math.sin(angle)*250))
	create_ball(x + Math.round(Math.cos(angle)*250),
		    y + Math.round(Math.sin(angle)*250), 100, big_ball)
    }
    */
    let ball_1 = create_ball(x-125, y-200, 100, big_ball)
    let ball_2 = create_ball(x+125, y-200, 100, big_ball)
    let ball_3 = create_ball(x-250, y, 100, big_ball)
    let ball_4 = create_ball(x+250, y, 100, big_ball)
    let ball_5 = create_ball(x-125, y+200, 100, big_ball)
    let ball_6 = create_ball(x+125, y+200, 100, big_ball)
    animate_big_ball(animate_id, big_ball)
    animate_small_balls(animate_id, ball_1, -1, 1)
    animate_small_balls(animate_id, ball_2, 1, 1)
    animate_small_balls(animate_id, ball_3, 1, -1/2)
    animate_small_balls(animate_id, ball_4, 1, -1)
    animate_small_balls(animate_id, ball_5, -1, -1)
    animate_small_balls(animate_id, ball_6, -1/2, 1)
}
