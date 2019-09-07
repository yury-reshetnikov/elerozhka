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
        // return
	var a = new Animate3
	var t1 = 0, t2 = 2000, t1a = t1 + (t2 - t1) * 2 / 3
	a.path_2('bird_near_wing_up', 'bird_near_wing_up_t001', t1, t2)
	a.path_2('bird_near_wing_upext', 'bird_near_wing_upext_t001', t1, t2)
	var t3 = t2 // + 3000;
	var t4 = t3 + 4000
	a.path('bird_near_wing_up', 'bird_near_wing_up_t001', 'bird_near_wing_up_t003', t3, t4)
	a.path('bird_near_wing_upext', 'bird_near_wing_upext_t001', 'bird_near_wing_upext_t003', t3, t4)
	a.start(); return
	var t5 = t4 + 3000
	a.path('bird_near_wing_up', 'bird_near_wing_up_t003', 'bird_near_wing_up_t004', t4, t5)
	a.path('bird_near_wing_upext', 'bird_near_wing_upext_t003', 'bird_near_wing_upext_t004', t4, t5)
	var t6 = t5 + 1000
	a.path('bird_near_wing_up', 'bird_near_wing_up_t004', 'bird_near_wing_up_t005', t5, t6)
	a.path('bird_near_wing_upext', 'bird_near_wing_upext_t004', 'bird_near_wing_upext_t005', t5, t6)
	var t7 = t6 + 1000
	a.display('bird_near_wing_up', false, t6)
	a.path('bird_near_wing_upext', 'bird_near_wing_upext_t006', 'bird_near_wing_upext_t007', t6, t7)
	a.start()
}

/*
 * Local Variables:
 * mode: JavaScript
 * coding: windows-1251-dos
 * tab-width: 4
 * End:
 */
