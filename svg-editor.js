(function() {
    var text_left, text_height = 400, text_line = 100
    var svg, showgroup, edgroup, text, selection, selno = false, bbox, root, rootsel = []
    var scale = 1
    var point_drag = {}

    var plugin

    var get_mouse_position = function(e) {
	var CTM = svg.getScreenCTM()
	return {
	    x: (e.clientX - CTM.e) / CTM.a,
	    y: (e.clientY - CTM.f) / CTM.d
	}
    }

    point_drag.start = function(e) {
	if(bbox && bbox._reshu_draggable) {
	    var o = bbox._reshu_draggable.offset = get_mouse_position(e)
	    var m = bbox._reshu_draggable.translate.matrix
	    o.x -= m.e * scale
	    o.y -= m.f * scale
	}
    }

    point_drag.drag = function(e) {
	if(bbox && bbox._reshu_draggable) {
	    var d = bbox._reshu_draggable
	    var o = d.offset
	    if(o) {
		e.preventDefault()
		var c = get_mouse_position(e)
		var x = Math.trunc((c.x - o.x) / scale), y = Math.trunc((c.y - o.y) / scale)
		d.translate.setTranslate(x, y)
		x += d.x
		y += d.y
		var n = text.children[selno]
		n.textContent = ''+x+','+y
		n.editor_data.nodeName = n.textContent
		root.attributes.d.value = n.editor_data.before + n.textContent + n.editor_data.after
		d.changed = true
	    }
	}
    }

    point_drag.end = function(e) {
	if(bbox && bbox._reshu_draggable && bbox._reshu_draggable.offset)
	    bbox._reshu_draggable.offset = false
    }

    var text_node = function(item, text_top) {
	var t = svggen(text, ['tspan', {
	    'font-size': text_height, x: text_left, y: text_top
	}, item.nodeName])[0]
	t.editor_data = item
	if(item.id) svggen(t, ['tspan', '#'+item.id])
	if(item.nodeName == 'path') {
	    svggen(t, ['tspan', ' '+item.attributes.d.value])
	}
    }

    var text_children = function(root, text_top) {
	if(root.nodeName == 'path') {
	    var before = '', after = []
	    root.attributes.d.value.split(/\s+/).forEach(function(item) {
		text_top += text_height
		var n = {nodeName: item, before: before, after: ''}
		text_node(n, text_top)
		// +++ if(text_top >= svg.viewBox.baseVal.height) break // +++ доработать after
		after.forEach(function(n) { n.after += ' ' + item })
		before += item + ' '
		after.push(n)
	    })
	}
	else for(let item of root.children) {
	    text_top += text_height
	    text_node(item, text_top)
	    if(text_top >= svg.viewBox.baseVal.height) break
	}
    }

    var create = function() {
	window.svg = svg
	text_left = svg.viewBox.baseVal.width
	if(svg.width.baseVal.value < svg.clientWidth) {
	    svg.width.baseVal.value = svg.clientWidth
	    svg.viewBox.baseVal.width = svg.width.baseVal.valueInSpecifiedUnits * 100
	}
	else {
	    console.log('svg.width:' + svg.width + ' svg.clientWidth:' + svg.clientWidth)
	    return
	}
	if(svg.height.baseVal.value < svg.clientHeight) {
	    svg.height.baseVal.value = svg.clientHeight
	    svg.viewBox.baseVal.height = svg.height.baseVal.valueInSpecifiedUnits * 100
	}
	showgroup = svggen(svg, ['g', {id: 'svg-show-group'}])[0]
	edgroup = svggen(svg, ['g', {id: 'svg-editor-group'}])[0]
	svggen(edgroup, ['rect', {
	    fill:"rgb(250,250,250)", 'fill-opacity':.8,
	    x:text_left, y:0,
	    width: svg.viewBox.baseVal.width - text_left, height: svg.viewBox.baseVal.height
	}])
	selection = svggen(edgroup, ['rect', {
	    fill:"rgb(100,255,100)", 'fill-opacity':.9,
	    x: text_left, y: text_line,
	    width: svg.viewBox.baseVal.width - text_left, height: text_height,
	    style: { display: 'none' }
	}])[0]
	text = svggen(edgroup, ['text', {'font-size': text_height}])[0]
	var list = []
	for(let item of svg.children) {
	    if(item.nodeName == 'script') ;
	    else if(item.nodeName == 'style') ;
	    else if(item.nodeName == 'g' && (
		item.id == 'svg-show-group' || item.id == 'svg-editor-group')) ;
	    else list.push(item)
	}
	list.forEach(function(item) { showgroup.appendChild(item) })
	text_children(showgroup, 0)
    }

    var show_selection = function() {
	selection.y.baseVal.value = text_line + selno * text_height
	selection.style.display = ''
	if(bbox) {
	    bbox.remove()
	    if(bbox._reshu_draggable && bbox._reshu_draggable.changed) {
		while(text.firstChild) text.removeChild(text.firstChild)
		text_node(root, text_height)
		text_children(root, text_height)
	    }
	}
	var node = text.children[selno].editor_data
	if(node.getBBox) {
	    var p = node.getBBox()
	    if(p.width < 100) { p.x -= (100 - p.width) / 2; p.width = 100; }
	    if(p.height < 100) { p.y -= (100 - p.height) / 2; p.height = 100; }
	    bbox = svggen(showgroup, ['rect', {
		fill:"rgb(250,250,250)", 'fill-opacity':.8,
		stroke: 'black', 'stroke-dasharray': '1 3',
		x: p.x - p.width / 10, y: p.y - p.height / 10,
		width: p.width * 1.2, height: p.height * 1.2
	    }])[0]
	}
	else {
	    var m = node.nodeName.match(/(\d+),(\d+)/)
	    if(m) {
		var d = 500
		var x = m[1] - d/2, y = m[2] - d/2, r = x + d, b = y + d
		bbox = svggen(showgroup, ['g', ['rect', {
		    fill:"rgb(250,250,250)", 'fill-opacity':.8, stroke: 'none',
		    style: { cursor: 'move' },
		    x: x, y: y, width: d, height: d,
		}], ['path', { stroke: 'black', d: 'M '+x+','+y+' L '+r+','+b }],
		    ['path', { stroke: 'black', d: 'M '+x+','+b+' L '+r+','+y }]])[0]
		bbox.onmousedown = point_drag.start
		bbox.onmousemove = point_drag.drag
		bbox.onmouseup = point_drag.end
		bbox.onmouseleave = point_drag.end
		var t = svg.createSVGTransform()
		t.setTranslate(0, 0)
		bbox.transform.baseVal.appendItem(t)
		bbox._reshu_draggable = {
		    translate: t,
		    x: parseInt(m[1]), y: parseInt(m[2]),
		}
	    }
	}
    }

    plugin = window.svgeditor = function(e) {
	if(e.key == 'e') {
	    if(!edgroup) { svg = document.children[0]; create(svg); }
	    else edgroup.style.display = ''
	}
	else if(!edgroup || edgroup.style.display == 'none') ;
	else if(e.key == 'Escape') {
	    if(selection.style.display == '') {
		selection.style.display = 'none'
		if(bbox) {
		    bbox.remove()
		    bbox = false
		}
	    }
	    else edgroup.style.display = 'none'
	}
	else if(e.key == 'ArrowDown') {
	    if(selno === false) {
		if(text.children.length) {
		    selno = 0
		    show_selection()
		}
	    }
	    else if(selection.style.display == 'none') show_selection()
	    else if(selno < text.children.length - 1) {
		++selno
		show_selection()
	    }
	}
	else if(e.key == 'ArrowUp') {
	    if(selno === false) {
		if(text.children.length) {
		    selno = text.children.length - 1
		    show_selection()
		}
	    }
	    else if(selection.style.display == 'none') show_selection()
	    else if(selno > 0) {
		--selno
		show_selection()
	    }
	}
	else if(e.key == 'Home') {
	    if(selno === false) {
		if(text.children.length) {
		    selno = 0
		    show_selection()
		}
	    }
	    else {
		selno = 0
		show_selection()
	    }
	}
	else if(e.key == 'End') {
	    if(selno === false) {
		if(text.children.length) {
		    selno = text.children.length - 1
		    show_selection()
		}
	    }
	    else {
		selno = text.children.length - 1
		show_selection()
	    }
	}
	else if(e.key == 'Enter') {
	    if(selno === false) ;
	    else {
		if(root == text.children[selno].editor_data) {
		    root = text.children[selno].editor_data.parentNode
		    selno = rootsel.pop()
		}
		else if(!text.children[selno].editor_data.parentNode) return
		else {
		    root = text.children[selno].editor_data
		    rootsel.push(selno)
		    selno = 0
		}
		while(text.firstChild) text.removeChild(text.firstChild)
		if(bbox) bbox.remove()
		if(root.nodeName == 'svg' || (root.id == 'svg-show-group'))
		    text_children(root, 0)
		else {
		    text_node(root, text_height)
		    text_children(root, text_height)
		}
		show_selection()
	    }
	}
	else if(e.key == 'Backspace') {
	    if(selno === false) ;
	    else if(rootsel.length) {
		root = root.parentNode
		selno = rootsel.pop()
		while(text.firstChild) text.removeChild(text.firstChild)
		if(bbox) bbox.remove()
		if(root.nodeName == 'svg' || (root.id == 'svg-show-group'))
		    text_children(root, 0)
		else {
		    text_node(root, text_height)
		    text_children(root, text_height)
		}
		show_selection()
	    }
	}
	else if(e.key == '+') {
	    scale *= 2
	    var tx = 0, ty = 0
	    if(bbox) {
		var p = bbox.getBBox()
		tx = ((text_left - p.width*scale)/2 - p.x*scale) / scale
		if(tx > 0) tx = 0
		ty = ((svg.viewBox.baseVal.height - p.height*scale)/2 - p.y*scale) / scale
		if(ty > 0) ty = 0
	    }
	    showgroup.setAttribute('transform', 'scale('+scale+') translate('+tx+','+ty+')')
	}
	else if(e.key == '-') {
	    scale /= 2
	    showgroup.setAttribute('transform', 'scale('+scale+')')
	}
	else if(e.key == '*') {
	    scale = 1
	    showgroup.setAttribute('transform', '')
	}
	else if(e.key == 'd') {
	    if(root && root.nodeName == 'path') prompt('', root.attributes.d.value)
	}
	else if(e.key == 'p') {
	    if(root && root.nodeName == 'path') {
		if(selno === false) ;
		else prompt('', text.children[selno].textContent)
	    }
	}
	// else console.log(e)
	// else return;
	// e.preventDefault()
	// console.log(e)
    }

})();
