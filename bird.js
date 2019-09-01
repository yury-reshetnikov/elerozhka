svgeditor(window)

function fly() {
	var a = new Animate3
	var wings_one = function(t0) {
		var t1 = t0 + 1000
		var t2 = t1 + 1000
		a.path('bird_far_wing_up', 'bird_far_wing_up_t', 'bird_far_wing_down', t0, t1)
		a.path('bird_near_wing_up', 'bird_near_wing_up_t', 'bird_near_wing_down', t0, t1)
		a.path('bird_far_wing_up', 'bird_far_wing_down', 'bird_far_wing_up_t', t1, t2)
		a.path('bird_near_wing_up', 'bird_near_wing_down', 'bird_near_wing_up_t', t1, t2)
		return t2
	}
	function wings_series(jump_a, count) {
		var n
		for(n = 0; n < count; ++n) jump_a = wings_one(jump_a)
		return jump_a
	}
	wings_series(0, 10)
	a.start()
}

function test_wing() {
	// var wing = document.getElementById('bird_near_wing_up')
	// console.dir(wing)
	// console.dir(wing.attributes.d)
	var a = new Animate3
	var t1 = 0, t2 = 2000, t1a = t1 + (t2 - t1) * 2 / 3
	// a.path_translate_2('bird_near_wing_up', [1], 0, 0, 200, 1500, t1, t2)
	// a.path_translate_2('bird_near_wing_up', [22,23], 0, 0, 0, 500, t1, t2)
	// a.path_translate_2('bird_near_wing_up', [21], 0, 0, -300, 900, t1, t2)
	// a.path_translate_2('bird_near_wing_up', [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 0, 0, -500, 1000, t1, t2)
	// a.path_translate_2('bird_near_wing_up', [25], 0, 0, 300, 100, t1, t1a)
	// a.path_translate_2('bird_near_wing_up', [25], 300, 100, 1000, -220, t1a, t2)
	a.path_2('bird_near_wing_up', 'bird_near_wing_up_t001', t1, t2)
	a.path_2('bird_near_wing_upext', 'bird_near_wing_upext_t001', t1, t2)
	var t3 = t2 // + 3000;
	// a.path_translate_2('bird_near_wing_up', [1], 200, 1500, 200, 1800, t2, t3)
	// a.path_translate_2('bird_near_wing_up', [2], -500, 1000, -500, 3500, t2, t3)
	// a.path_translate_2('bird_near_wing_up', [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], -500, 1000, -500, 3000, t2, t3)
	// a.path_translate_2('bird_near_wing_up', [21], -300, 900, -300, 1800, t2, t3)
	// a.path_translate_2('bird_near_wing_up', [22,23], 0, 500, 0, 1200, t2, t3)
	// a.path_translate_2('bird_near_wing_up', [24], 0, 0, -400, 600, t2, t3)
	// a.path_translate_2('bird_near_wing_up', [25], 1000, -220, 750, 475, t2, t3)
	// a.path('bird_near_wing_up', 'bird_near_wing_up_t001', 'bird_near_wing_up_t002', t2, t3)
	// a.path('bird_near_wing_upext', 'bird_near_wing_upext_t001', 'bird_near_wing_upext_t002', t2, t3)
	var t4 = t3 + 4000
	// a.path_translate('bird_near_wing_up', 'bird_near_wing_up_t002', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25], 0, 0, 0, 700, t3, t4)
	a.path('bird_near_wing_up', 'bird_near_wing_up_t001', 'bird_near_wing_up_t003', t3, t4)
	a.path('bird_near_wing_upext', 'bird_near_wing_upext_t001', 'bird_near_wing_upext_t003', t3, t4)
	var t5 = t4 + 3000
	//a.path_translate('bird_near_wing_up', 'bird_near_wing_up_t003', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25], 0, 0, 0, 1700, t4, t5)
	a.path('bird_near_wing_up', 'bird_near_wing_up_t003', 'bird_near_wing_up_t004', t4, t5)
	a.path('bird_near_wing_upext', 'bird_near_wing_upext_t003', 'bird_near_wing_upext_t004', t4, t5)
	// var t6 = t5 + 1000
	// a.path_translate('bird_near_wing_up', 'bird_near_wing_up_t004', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25], 0, 0, 0, -400, t5, t6)
	// a.path_translate('bird_near_wing_upext', 'bird_near_wing_upext_t004', [2,3,4,5,6,7], 0, 0, 0, -400, t5, t6)
	var t6 = t5 + 1000
	a.path('bird_near_wing_up', 'bird_near_wing_up_t004', 'bird_near_wing_up_t005', t5, t6)
	a.path('bird_near_wing_upext', 'bird_near_wing_upext_t004', 'bird_near_wing_upext_t005', t5, t6)
	a.start()
}

/*
 * Local Variables:
 * mode: JavaScript
 * coding: windows-1251-dos
 * tab-width: 4
 * End:
 */
