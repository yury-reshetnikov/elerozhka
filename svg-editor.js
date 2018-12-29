(function() {
    var text_height = 400, text_line = 100
    var edgroup, text, selection, selno = false, bbox

    var plugin

    var create = function(svg) {
	window.svg = svg
	var old_width = svg.viewBox.baseVal.width
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
	edgroup = svggen(svg, ['g', {id: 'svg-editor-group'}])[0]
	svggen(edgroup, ['rect', {
	    fill:"rgb(250,250,250)", 'fill-opacity':.8,
	    x:old_width, y:0,
	    width: svg.viewBox.baseVal.width - old_width, height: svg.viewBox.baseVal.height
	}])
	selection = svggen(edgroup, ['rect', {
	    fill:"rgb(100,255,100)", 'fill-opacity':.9,
	    x: old_width, y: text_line,
	    width: svg.viewBox.baseVal.width - old_width, height: text_height,
	    style: { display: 'none' }
	}])[0]
	text = svggen(edgroup, ['text', {'font-size': text_height}])[0]
	var text_top = 0
	for(let item of svg.children) {
	    if(item.nodeName == 'script') ;
	    else if(item.nodeName == 'g' && item.id == 'svg-editor-group') ;
	    else {
		text_top += text_height
		var t = svggen(text, ['tspan', {
		    'font-size': text_height, x: old_width, y: text_top
		}, item.nodeName])[0]
		t.editor_data = item
		if(item.id) svggen(t, ['tspan', '#'+item.id])
		if(item.nodeName == 'path') {
		    svggen(t, ['tspan', ' '+item.attributes['d'].value])
		}
		if(text_top >= svg.viewBox.baseVal.height) break
	    }
	}
    }

    var show_selection = function() {
	selection.y.baseVal.value = text_line + selno * text_height
	selection.style.display = ''
	if(bbox) bbox.remove()
	var p = text.children[selno].editor_data.getBBox()
	bbox = svggen(edgroup, ['rect', {
	    fill:"rgb(250,250,250)", 'fill-opacity':.8,
	    stroke: 'black', 'stroke-dasharray': '1 3',
	    x: p.x, y: p.y, width: p.width, height: p.height
	}])[0]
    }

    plugin = window.svgeditor = function(e) {
	if(e.key == 'e') {
	    if(!edgroup) create(document.children[0])
	    else edgroup.style.display = ''
	}
	else if(!edgroup) ;
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
		console.log(text.children[selno].editor_data.getBBox())
	    }
	}
	// else console.log(e)
    }

})();
