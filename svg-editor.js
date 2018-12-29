(function() {
    var text_height = 400
    var edgroup

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
	    fill:"rgb(230,230,230)", 'fill-opacity':.9,
	    x:old_width, y:0,
	    width: svg.viewBox.baseVal.width - old_width, height: svg.viewBox.baseVal.height
	}])
	var text_top = 0
	for(let item of svg.children) {
	    if(item.nodeName == 'script') ;
	    else if(item.nodeName == 'g' && item.id == 'svg-editor-group') ;
	    else {
		text_top += text_height
		var t = svggen(edgroup, ['text', {
		    'font-size': text_height, x: old_width, y: text_top
		}, item.nodeName])[0]
		if(item.id) svggen(t, ['tspan', '#'+item.id])
		if(text_top >= svg.viewBox.baseVal.height) break
	    }
	}
    }

    plugin = window.svgeditor = function(e) {
	if(e.key == 'e') {
	    if(!edgroup) create(document.children[0])
	    else edgroup.style.display = ''
	}
	else if(e.key == 'Escape') {
	    if(edgroup) edgroup.style.display = 'none'
	}
	// else console.log(e)
    }

})();
