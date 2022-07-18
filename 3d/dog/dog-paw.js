function Paw(g, foot_points) {
    let points = [
	foot_points
    ]
    let segments = [
	{pl:[0,1,2]}, // pl === points level
	{pl:[3,4]},
	{pl:[5,6]},
    ]
    let bases
    let ind = g.index.array
    let pos = g.attributes.position.array
    function lp(base, prev) { // linked points
	let next = []
	for(let t = 0; t < g.index.count; t = t + 3) {
	    if(base.includes(ind[t]) || base.includes(ind[t+1]) ||
	       base.includes(ind[t+2]))
		for(let i = t; i < t + 3; ++i) {
		    let p = ind[i]
		    if(!base.includes(p) && !prev.includes(p) &&
		       !next.includes(p))
			next.push(p)
		}
	}
	next.sort((a,b)=>a-b)
	return next
    }
    points.push(lp(points[points.length-1], []))
    for(let i = 2; i < 7; ++i)
	points.push(lp(points[points.length-1],
		       points[points.length-2]))
    // считаем bases
    this.calc_bases = function() {
	bases = []
    let centres = points.map(function(list) {
	if(list.length == 0) return
	else if(list.length == 1) {
	    let a = list[0] * 3
	    return Array.from(pos.slice(a, a + 3))
	}
	else {
	    let s = [0,0,0]
	    list.forEach(function(item) {
		let a = item * 3
		for(let i = 0; i < 3; ++i,++a) s[i] = s[i] + pos[a]
	    })
	    return s.map((v) => v / list.length)
	}
    })
    segments[0].rc = centres[3]
    segments[1].rc = [0,1,2].map(function(n) {
	return (centres[4][n] + centres[5][n]) / 2 })
    segments[2].rc = [
	centres[6][0], centres[6][1] + 0.9, centres[6][2] ]
    let prev_rc
    for(let s = 0; s <= 2; ++s) {
	let rc = (new THREE.Vector3()).fromArray(segments[s].rc)
	let bases_points = []
	segments[s].pl.forEach(function(n) {
	    points[n].forEach(function(p) {
		let v = (new THREE.Vector3()).subVectors((new THREE.Vector3()).fromBufferAttribute(g.attributes.position, p), rc)
		bases_points.push(v.x, v.y, v.z)
	    })
	})
	if(s) {
	    let v = (new THREE.Vector3()).subVectors(prev_rc, rc)
	    bases_points.push(v.x, v.y, v.z)
	}
	bases.push(bases_points)
	prev_rc = rc
    }
    }
    this.calc_bases()
    let current_angles = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.current_angles = function() { return current_angles }
    this.get_points = function() { return points }
    this.get_base_rotation_centre = function() { return segments[2].rc }
    this.rotate = function() {
	current_angles = [...arguments]
	let angle = new THREE.Quaternion() // +++ TODO учесть текущий поворот корпуса
	let rc = (new THREE.Vector3()).fromArray(segments[2].rc)
	for(let s = 2; s >= 0; --s) {
	    let euler = new THREE.Euler(
		THREE.MathUtils.degToRad(arguments[(2-s)*3]),
		THREE.MathUtils.degToRad(arguments[(2-s)*3+1]),
		THREE.MathUtils.degToRad(arguments[(2-s)*3+2]),
		'XYZ')
	    angle = angle.multiply((new THREE.Quaternion()).setFromEuler(euler))
	    let k = 0
	    segments[s].pl.forEach(function(n) {
		points[n].forEach(function(p,i) {
		    let v = (new THREE.Vector3()).fromArray(bases[s],
			(k++)*3).applyQuaternion(angle)
		    let d = (new THREE.Vector3()).addVectors(rc, v)
		    g.attributes.position.setXYZ(p, d.x, d.y, d.z)
		})
	    })
	    if(s) {
		let v = (new THREE.Vector3()).fromArray(bases[s], k*3).applyQuaternion(angle)
		rc = (new THREE.Vector3()).addVectors(rc, v)
	    }
	}
	g.attributes.position.needsUpdate = true
    }
    this.qrotate = function() {
	current_angles = [...arguments]
	let angle = new THREE.Quaternion() // +++ TODO учесть текущий поворот корпуса
	let rc = (new THREE.Vector3()).fromArray(segments[2].rc)
	for(let s = 2; s >= 0; --s) {
	    angle = angle.multiply(arguments[2-s])
	    let k = 0
	    segments[s].pl.forEach(function(n) {
		points[n].forEach(function(p,i) {
		    let v = (new THREE.Vector3()).fromArray(bases[s],
			(k++)*3).applyQuaternion(angle)
		    let d = (new THREE.Vector3()).addVectors(rc, v)
		    g.attributes.position.setXYZ(p, d.x, d.y, d.z)
		})
	    })
	    if(s) {
		let v = (new THREE.Vector3()).fromArray(bases[s], k*3).applyQuaternion(angle)
		rc = (new THREE.Vector3()).addVectors(rc, v)
	    }
	}
	g.attributes.position.needsUpdate = true
    }
    this.zy_rotate = function(y,z1,z2,z3) {
	current_angles = []
	let angle = new THREE.Quaternion() // +++ TODO учесть текущий поворот корпуса
	function amul(a,z) {
	    return a.clone().multiply((new THREE.Quaternion()).setFromEuler(
		new THREE.Euler(0,0, THREE.MathUtils.degToRad(z), 'XYZ')
	    ))
	}
	let a1 = amul(angle, z1)
	let a2 = amul(a1, z2)
	let a3 = amul(a2, z3)
	let ay = (new THREE.Quaternion()).setFromEuler(
	    new THREE.Euler(0, THREE.MathUtils.degToRad(y), 0, 'XYZ')
	)
	let angles = [a1.clone().multiply(ay),
		      a2.clone().multiply(ay),
		      a3.clone().multiply(ay)]
	let rc = (new THREE.Vector3()).fromArray(segments[2].rc)
	for(let s = 2; s >= 0; --s) {
	    angle = angles[2-s]
	    let k = 0
	    segments[s].pl.forEach(function(n) {
		points[n].forEach(function(p,i) {
		    let v = (new THREE.Vector3()).fromArray(bases[s],
			(k++)*3).applyQuaternion(angle)
		    let d = (new THREE.Vector3()).addVectors(rc, v)
		    g.attributes.position.setXYZ(p, d.x, d.y, d.z)
		})
	    })
	    if(s) {
		let v = (new THREE.Vector3()).fromArray(bases[s], k*3).applyQuaternion(angle)
		rc = (new THREE.Vector3()).addVectors(rc, v)
	    }
	}
	g.attributes.position.needsUpdate = true
    }
}
