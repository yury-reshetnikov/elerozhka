(function(){
    var xmlns = "http://www.w3.org/2000/svg"
    var plugin

    var append_child = function(node, child) { node.appendChild(child) }

    var p_run = function(p, args) {
	var list1 = p.list
	var list2 = p.list = []
	plugin.run(p, args, 0)
	p.list = list1.concat(list2)
	return list2
    }

    var append = function(obj, method) {
	var p = function() { return p_run(p, arguments) }
	if(!method) method = append_child
	p.obj = obj
	p.list = []
	p.add = function(c) {
	    method(this.obj, c)
	    this.list.push(c)
	    return c
	}
	p.tag = function() { return p.add(plugin.tag(arguments)) }
	return p
    }

    // +++ prepend

    var merge = function() {
	var p = function() { return p_run(p, arguments) }
	p.list = []
	p.add = function(c) { this.list.push(c); return c; }
	p.tag = function() { return p.add(plugin.tag(arguments)) }
	return p;
    };

    plugin = window.svggen = function(a0) {
	if(arguments.length) {
	    if(a0 instanceof Element) return plugin.run(append(a0), arguments, 1)
	    else if(a0 instanceof Array && (a0.length == 2 || a0.length == 3) && a0[0] == '#')
		return plugin.run(append(plugin._id(a0)), arguments, 1)
	    else if(a0 instanceof Array) return plugin.run(merge(), arguments, 0)
	    else if(a0 instanceof Function && a0.list && a0.add)
		return plugin.run(a0, arguments, 1)
	    else return plugin.tag(arguments)
	}
    }

    plugin.any = function(t) { return plugin.run(t, arguments, 1) }

    plugin.run = function(p, a, i) {
	for(; i < a.length; i++) {
	    var def = a[i]
	    if(typeof def === "undefined") ;
	    else if(def instanceof Element) p.add(def)
	    else if(def instanceof Array) {
		if(def.length) {
		    var cmd
		    if(typeof def[0] !== 'string') plugin.run(p, def, 0)
		    else if(cmd = plugin.cmds[def[0]]) cmd(p, def)
		    else p.add(plugin.tag(def))
		}
	    }
	    else if(def instanceof Function) def(p)
	    else p.add(document.createTextNode(def))
	    // else throw new Error('Элемент не поддерживается: ' + def)
	}
	return p.list
    }

    plugin.attr = function(tag, attr) {
	var style
	for(var k in attr) {
	    if(k == 'style' && attr[k] instanceof Object) {
		for(var s in attr['style']) tag.style[s] = attr['style'][s]
	    }
	    // +++ else if(k.substr(0, 2) == 'on' && attr[k] instanceof Function) tag.bind(k.substr(2), attr[k]);
	    else tag.setAttribute(k, attr[k]);
	}
    }

    plugin.tag = function(def) {
	var tag = document.createElementNS(xmlns, def[0])
	if(def.length > 1) {
	    var i = 1
	    if(def[1] instanceof Object && !(
		    def[1] instanceof Array || def[1] instanceof Function)) {
		plugin.attr(tag, def[1])
		++i
	    }
	    plugin.run(append(tag), def, i)
	}
	return tag
    }

    plugin.cmds = {

	noop: function(p, def) { ; },
	ce: function(p, def) { plugin.run(p, def, 1); },
	run: function(p, def) { plugin.run(p, def[1], def.length > 2 ? def[2] : 0); },

	join: function(p, def) {
	    if(def.length > 2) {
		plugin.any(p, def[2])
		for(var i = 3; i < def.length; i++) {
		    plugin.any(p, def[1], def[i])
		}
	    }
	},

	map: function(p, def) {
	    var arr = def[1], cb = def[2], sep = def[3]
	    if(!arr || !arr.length) return
	    if(sep) {
		cb(p, arr[0])
		for(var i = 1; i < arr.length; i++) { p(sep); cb(p, arr[i]); }
	    }
	    else for(var i = 0; i < arr.length; i++) cb(p, arr[i])
	},

	phpmap: function(p, def) {
	    if(def[1] instanceof Array) {
		for(var i = 0; i < def[1].length; i++) def[2](p, def[1][i])
	    }
	    else { for(var k in def[1]) def[2](p, def[1][k]); }
	},

	objmap: function(p, def) { if(def[1]) for(var k in def[1]) def[2](p, def[1][k], k); },

    }

    plugin.id = function(id, cr) {
	var r = document.getElementById(id);
	if(r) return r
	else {
	    if(arguments.length == 1) throw new Error('Не найден элемент #' + id)
	    else if(cr === false) return
	    else {
		r = cr()
		if(r === false) return
		else if(r instanceof Element) return r
		else {
		    var r = document.getElementById(id)
		    if(r) return r
		    else throw new Error('Не найден элемент #' + id)
		}
	    }
	}
    }
    plugin._id = function(def) {
	if(def.length < 2) throw new Error('Слишком мало аргументов для \'#\'')
	else if(def.length == 2) return plugin.id(def[1])
	else return plugin.id(def[1], def[2])
    };
})()
