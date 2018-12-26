(function(jQuery) {
    if (typeof(jQuery.reshu) === "undefined") {
        jQuery.reshu = {};
    }

    var plugin;
    // var g = jQuery.reshu.pagegen;

    plugin = jQuery.reshu.svgeditor = function(svg) {
	console.log(svg.children.length)
        // <text class="TextShape"><tspan class="TextParagraph" font-family="Liberation Sans, sans-serif" font-size="635px" font-weight="400"><tspan class="TextPosition" x="6122" y="5924"><tspan fill="rgb(0,0,0)" stroke="none">Это есть текстовое </tspan></tspan><tspan class="TextPosition" x="6122" y="6635"><tspan fill="rgb(0,0,0)" stroke="none">поле</tspan></tspan></tspan></text>
	svg.width.baseVal.value = svg.clientWidth
	svg.viewBox.baseVal.width = svg.width.baseVal.valueInSpecifiedUnits * 100
	if(svg.height.baseVal.value < svg.clientHeight) {
	    svg.height.baseVal.value = svg.clientHeight
	    svg.viewBox.baseVal.height = svg.height.baseVal.valueInSpecifiedUnits * 100
	}
	/*
	var xmlns = "http://www.w3.org/2000/svg"
	var rect = document.createElementNS(xmlns, 'rect')
	rect.setAttribute('fill', 'rgb(230,230,230)')
	rect.setAttribute('x', 20000)
	rect.setAttribute('y', 2781)
	rect.setAttribute('width', 10399)
	rect.setAttribute('height', 7719)
	rect.setAttribute('fill-opacity', .9)
	svg.appendChild(rect)
	window.rect = rect
	*/
	window.rect = svggen(svg, ['rect', {fill:"rgb(230,230,230)", x:20000, y:2781, width:10399, height:7719, 'fill-opacity':.9}])
	window.svg = svg
    }

})(jQuery);
