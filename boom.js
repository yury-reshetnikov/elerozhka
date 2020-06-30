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

function create_balls_group(x, y) {
    let big_ball = create_ball(x, y, 400, snake_body)
    create_ball(x-125, y-200, 100, big_ball)
    create_ball(x+125, y-200, 100, big_ball)
    create_ball(x-250, y, 100, big_ball)
    create_ball(x+250, y, 100, big_ball)
    create_ball(x-125, y+200, 100, big_ball)
    create_ball(x+125, y+200, 100, big_ball)
}
