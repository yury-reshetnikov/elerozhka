(function(jQuery) {
    if (typeof(jQuery.reshu) === "undefined") {
        jQuery.reshu = {};
    }

    var plugin;
    var g = jQuery.reshu.pagegen;

    plugin = jQuery.reshu.svgeditor = function(svg) {
	console.log(svg.children.length)
	// g(jQuery(svg), ['rect', {stroke:"none", fill:"rgb(114,159,207)", x:4710, y:2781, width:10399, height:7719}])
        // <rect stroke="none" fill="rgb(114,159,207)" x="4710" y="2781" width="10399" height="7719"/>
        // <text class="TextShape"><tspan class="TextParagraph" font-family="Liberation Sans, sans-serif" font-size="635px" font-weight="400"><tspan class="TextPosition" x="6122" y="5924"><tspan fill="rgb(0,0,0)" stroke="none">Это есть текстовое </tspan></tspan><tspan class="TextPosition" x="6122" y="6635"><tspan fill="rgb(0,0,0)" stroke="none">поле</tspan></tspan></tspan></text>
	var xmlns = "http://www.w3.org/2000/svg"
	var rect = document.createElementNS(xmlns, 'rect')
	rect.setAttributeNS(null, 'fill', 'rgb(230,230,230)')
	rect.setAttributeNS(null, 'x', 4710)
	rect.setAttributeNS(null, 'y', 2781)
	rect.setAttributeNS(null, 'width', 10399)
	rect.setAttributeNS(null, 'height', 7719)
	rect.setAttributeNS(null, 'fill-opacity', .9)
	svg.appendChild(rect)
    }

})(jQuery);
