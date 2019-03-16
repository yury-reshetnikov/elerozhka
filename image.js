var star = 1
function id_display(id, display) {
    document.getElementById(id).style.display = display
}
function star_display(state, display) { id_display('star'+star+state, display) }
function star_eye(show) {
    if(show) id_display('eye_open', '')
    else {
	id_display('eye_open', 'none')
	id_display('eye_close', 'none')
    }
}
function star_eye2(show) {
    if(show) id_display('eye2_open', '')
    else {
	id_display('eye2_open', 'none')
    }
}
function set_star(n) {
    if(star != n) {
	star_display('on', 'none')
	star_display('off', '')
	star = n
	star_display('off', 'none')
	star_display('on', '')
	star_eye(star == 1)
	star_eye2(star == 2)
    }
}
function close_eye() {
    document.getElementById('eye_open').style.display = 'none'
    document.getElementById('eye_close').style.display = ''
}
function open_eye() {
    document.getElementById('eye_open').style.display = ''
    document.getElementById('eye_close').style.display = 'none'
}
function open_eye2(eye) {
	    ['eye2_open','eye2_right','eye2_right2','eye2_right3',
	     'eye2_almost_open_1','eye2_almost_open_2','eye2_almost_close_1',"eye2_almost_close_2","eye2_close"].forEach(function(item) {
		id_display(item, eye == item ? '' : 'none')
	    })
}
function animate(timeout,finish,count,...steps) {
    var pos = 0
    var call = function iterate() {
	steps[pos]()
	if(!--count) finish()
	else {
	    if(++pos >= steps.length) pos = 0
	    setTimeout(iterate, timeout)
	}
    }
    call()
}
function animate2(timeout,finish,count,steps) {
    var pos = 0
    count = count * steps.length + 1
    var call = function iterate() {
	var steps_pos = steps[pos]
	var show = steps_pos instanceof Array ? function(item) {
	    var d = 'none'
	    steps_pos.forEach(function(sp) {
		if(sp == item) d = ''
	    })
	    id_display(item, d)
	} : function(item) {
	    id_display(item, item == steps_pos ? '' : 'none')
	}
	steps.forEach(function(item) {
	    if(item instanceof Array) item.forEach(show)
	    else show(item)
	})
	if(!--count) finish()
	else {
	    if(++pos >= steps.length) pos = 0
	    setTimeout(iterate, timeout)
	}
    }
    call()
}
var wink_started = false
function wink() {
    if(wink_started || sneeze_started) return
    if(star == 1) {
	wink_started = true
	animate(300, function() { wink_started = false }, 5,
		function() { open_eye() },
		function() { close_eye() })
    }
    else if(star == 2) {
	wink_started = true
	animate(100, function() { wink_started = false }, 1+1*16,
		function() { open_eye2('eye2_open') },
		function() { open_eye2('eye2_right') },
		function() { open_eye2('eye2_right2') },
		function() { open_eye2('eye2_right3') },
		function() { open_eye2('eye2_right2') },
		function() { open_eye2('eye2_right') },
		function() { open_eye2('eye2_open') },
		function() { open_eye2('eye2_almost_open_1') },
		function() { open_eye2('eye2_almost_open_2') },
		function() { open_eye2('eye2_almost_close_1') },
		function() { open_eye2('eye2_almost_close_2') },
		function() { open_eye2('eye2_close') },
		function() { open_eye2('eye2_almost_close_2') },
		function() { open_eye2('eye2_almost_close_1') },
		function() { open_eye2('eye2_almost_open_2') },
		function() { open_eye2('eye2_almost_open_1') },
	       )
    }
}

var stomp_started = false
function stomp() {
    if(stomp_started) return
    stomp_started = true
    animate2(200, function() { stomp_started = false }, 2, [
		'raised_hoof_1', 'raised_hoof_2', 'raised_hoof_3', 'raised_hoof_2',
		['raised_hoof_1', 'hit3'], ['raised_hoof_1', 'hit2'], ['raised_hoof_1', 'hit1'],
    ]);
}

var wag_started = false
function wag() {
    if(wag_started || sneeze_started) return
    wag_started = true
    animate2(150, function() { wag_started = false }, 3, [
                'tail_3', 'tail_2', 'tail_1', 'tail_2'
              ])
}

var smile_started = false
function smile() {
    if(smile_started) return
    smile_started = true
    // animate2(150, function() { smile_started = false }, 2, [
    //             'jowl_2', 'jowl_1'
    //           ])
    var a = new Animate3
    a.rotate('jowl', -15, 0, 0, 200)
    a.rotate('jowl', 0, -15, 200,400)
    a.rotate('jowl', -15, 0, 400, 600)
    a.rotate('jowl', 0, -15, 600, 800)
    a.finish(function() { smile_started = false })
    a.start()
}

var sneeze_started = false
function sneeze() {
    if(sneeze_started || wink_started || wag_started) return
    sneeze_started = true
    animate2(300, function() { sneeze_started = false }, 1, [
                ['head','tail_3'], ['head_up1','tail_3'], ['head_up2','tail_3'],
		['head_up1_eye','tail_3'], ['head_up','tail_3'],
		['head_down', 'tail_sneeze'],
                ['head','tail_3','germs2'], ['head_up1','tail_3'], ['head_up2','tail_3'],
		['head_up1_eye','tail_3'], ['head_up','tail_3'],
		['head_down', 'tail_sneeze'],
		['head','tail_3','germs2']
                ])
}

var eating_started = false
function eating() {
    if(eating_started || sneeze_started || wink_started) return
    eating_started = true
    var a = new Animate3
    a.rotate('head_without_neck', 0, -50, 0, 1000)
    a.path_rotate('contour', 'contour_t0', 10807, 12015, [0,2], 0, -50, 0, 1000)
    a.path('back', 'back_t0', 'back_t1', 0, 1000)
    a.rotate('jowl', -15, -30, 800, 1000)
    a.rotate('jowl', -30, 0, 1000, 1300)
    a.display('eated_no', false, 1200)
    a.display('eated', true, 1200)
    a.display('eated_2', true, 1200)
    a.rotate('eated_2', 0, -150, 1200, 1300)
    a.display('eated_2', false, 1300)
    a.display('eated_3', true, 1300)
    if(true) { // up
	a.rotate('head_without_neck', -50, 0, 1300, 2300)
	a.path_rotate('contour', 'contour_t0', 10807, 12015, [0,2], -50, 0, 1300, 2300)
	a.path('back', 'back_t1', 'back_t0', 1300, 2300)
	a.translate('eated_3', 0, 0, 2000, -500, 2300, 3300)
	a.rotate('jowl', 0, -15, 2300, 2500);
	[0,1].forEach(function(i) {
	    var t = 2500+i*400
	    a.rotate('jowl', -15, 0, t, t+200)
	    a.rotate('jowl', 0, -15, t+200, t+2*200)
	})
	a.display('eated_3', false, 3300)
	a.rotate('eated_2', -160, 0, 3300, 3500) // +++ перенести возврат в finish
	a.path('eated', 'eated_t0', 'eated_t1', 3500, 5500, 6000)
	a.display('eated_no', true, 6000)
	a.display('eated', false, 6000)
    }
    a.finish(function() {
	a.path_restore('eated', 'eated_t0')
	a.transform_restore('eated_3')
	eating_started = false
    })
    a.start()
}

function rotate_head(r) {
    document.getElementById('head_without_neck').setAttribute('transform', 'rotate('+r+')')
}

function open_mouth() {
    var a = new Animate3
    a.rotate('jowl', 0, -30, 0, 1000)
    a.start()
}

window.onkeyup = svgeditor
