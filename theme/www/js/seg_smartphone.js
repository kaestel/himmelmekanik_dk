
/*seg_smartphone_include.js*/

/*seg_smartphone.js*/
if(!u || !Util) {
	var u, Util = u = new function() {};
	u.version = "0.9.2";
	u.bug = u.nodeId = u.exception = function() {};
	u.stats = new function() {this.pageView = function(){};this.event = function(){};}
	u.txt = function(index) {return index;}
}
function fun(v) {return (typeof(v) === "function")}
function obj(v) {return (typeof(v) === "object")}
function str(v) {return (typeof(v) === "string")}
u.bug_console_only = true;
Util.debugURL = function(url) {
	if(u.bug_force) {
		return true;
	}
	return document.domain.match(/(\.local|\.proxy)$/);
}
Util.nodeId = function(node, include_path) {
	console.log("Util.nodeId IS DEPRECATED. Use commas in u.bug in stead.");
	console.log(arguments.callee.caller);
	try {
		if(!include_path) {
			return node.id ? node.nodeName+"#"+node.id : (node.className ? node.nodeName+"."+node.className : (node.name ? node.nodeName + "["+node.name+"]" : node.nodeName));
		}
		else {
			if(node.parentNode && node.parentNode.nodeName != "HTML") {
				return u.nodeId(node.parentNode, include_path) + "->" + u.nodeId(node);
			}
			else {
				return u.nodeId(node);
			}
		}
	}
	catch(exception) {
		u.exception("u.nodeId", arguments, exception);
	}
	return "Unindentifiable node!";
}
Util.exception = function(name, _arguments, _exception) {
	u.bug("Exception in: " + name + " (" + _exception + ")");
	console.error(_exception);
	u.bug("Invoked with arguments:");
	console.log(_arguments);
}
Util.bug = function() {
	if(u.debugURL()) {
		if(!u.bug_console_only) {
			var i, message;
			if(obj(console)) {
				for(i = 0; i < arguments.length; i++) {
					if(arguments[i] || typeof(arguments[i]) == "undefined") {
						console.log(arguments[i]);
					}
				}
			}
			var option, options = new Array([0, "auto", "auto", 0], [0, 0, "auto", "auto"], ["auto", 0, 0, "auto"], ["auto", "auto", 0, 0]);
			var corner = u.bug_corner ? u.bug_corner : 0;
			var color = u.bug_color ? u.bug_color : "black";
			option = options[corner];
			if(!document.getElementById("debug_id_"+corner)) {
				var d_target = u.ae(document.body, "div", {"class":"debug_"+corner, "id":"debug_id_"+corner});
				d_target.style.position = u.bug_position ? u.bug_position : "absolute";
				d_target.style.zIndex = 16000;
				d_target.style.top = option[0];
				d_target.style.right = option[1];
				d_target.style.bottom = option[2];
				d_target.style.left = option[3];
				d_target.style.backgroundColor = u.bug_bg ? u.bug_bg : "#ffffff";
				d_target.style.color = "#000000";
				d_target.style.fontSize = "11px";
				d_target.style.lineHeight = "11px";
				d_target.style.textAlign = "left";
				if(d_target.style.maxWidth) {
					d_target.style.maxWidth = u.bug_max_width ? u.bug_max_width+"px" : "auto";
				}
				d_target.style.padding = "2px 3px";
			}
			for(i = 0; i < arguments.length; i++) {
				if(arguments[i] === undefined) {
					message = "undefined";
				}
				else if(!str(arguments[i]) && fun(arguments[i].toString)) {
					message = arguments[i].toString();
				}
				else {
					message = arguments[i];
				}
				var debug_div = document.getElementById("debug_id_"+corner);
				message = message ? message.replace(/\>/g, "&gt;").replace(/\</g, "&lt;").replace(/&lt;br&gt;/g, "<br>") : "Util.bug with no message?";
				u.ae(debug_div, "div", {"style":"color: " + color, "html": message});
			}
		}
		else if(typeof(console) !== "undefined" && obj(console)) {
			var i;
			for(i = 0; i < arguments.length; i++) {
				console.log(arguments[i]);
			}
		}
	}
}
Util.xInObject = function(object, _options) {
	if(u.debugURL()) {
		var return_string = false;
		var explore_objects = false;
		if(obj(_options)) {
			var _argument;
			for(_argument in _options) {
				switch(_argument) {
					case "return"     : return_string               = _options[_argument]; break;
					case "objects"    : explore_objects             = _options[_argument]; break;
				}
			}
		}
		var x, s = "--- start object ---\n";
		for(x in object) {
			if(explore_objects && object[x] && obj(object[x]) && !str(object[x].nodeName)) {
				s += x + "=" + object[x]+" => \n";
				s += u.xInObject(object[x], true);
			}
			else if(object[x] && obj(object[x]) && str(object[x].nodeName)) {
				s += x + "=" + object[x]+" -> " + u.nodeId(object[x], 1) + "\n";
			}
			else if(object[x] && fun(object[x])) {
				s += x + "=function\n";
			}
			else {
				s += x + "=" + object[x]+"\n";
			}
		}
		s += "--- end object ---\n";
		if(return_string) {
			return s;
		}
		else {
			u.bug(s);
		}
	}
}
Util.Animation = u.a = new function() {
	this.support3d = function() {
		if(this._support3d === undefined) {
			var node = u.ae(document.body, "div");
			try {
				u.as(node, "transform", "translate3d(10px, 10px, 10px)");
				if(u.gcs(node, "transform").match(/matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 10, 10, 1\)/)) {
					this._support3d = true;
				}
	 			else {
					this._support3d = false;
				}
			}
			catch(exception) {
				this._support3d = false;
			}
			document.body.removeChild(node);
		}
		return this._support3d;
	}
	this.transition = function(node, transition, callback) {
		try {
			var duration = transition.match(/[0-9.]+[ms]+/g);
			if(duration) {
				node.duration = duration[0].match("ms") ? parseFloat(duration[0]) : (parseFloat(duration[0]) * 1000);
				if(callback) {
					var transitioned;
					transitioned = (function(event) {
						u.e.removeEvent(event.target, u.a.transitionEndEventName(), transitioned);
						if(event.target == this) {
							u.a.transition(this, "none");
							if(fun(callback)) {
								var key = u.randomString(4);
								node[key] = callback;
								node[key](event);
								delete node[key];
								callback = null;
							}
							else if(fun(this[callback])) {
								this[callback](event);
							}
						}
						else {
						}
					});
					u.e.addEvent(node, u.a.transitionEndEventName(), transitioned);
				}
				else {
					u.e.addEvent(node, u.a.transitionEndEventName(), this._transitioned);
				}
			}
			else {
				node.duration = false;
			}
			u.as(node, "transition", transition);
		}
		catch(exception) {
			u.exception("u.a.transition", arguments, exception);
		}
	}
	this.transitionEndEventName = function() {
		if(!this._transition_end_event_name) {
			this._transition_end_event_name = "transitionend";
			var transitions = {
				"transition": "transitionend",
				"MozTransition": "transitionend",
				"msTransition": "transitionend",
				"webkitTransition": "webkitTransitionEnd",
				"OTransition": "otransitionend"
			};
			var x, div = document.createElement("div");
			for(x in transitions){
				if(typeof(div.style[x]) !== "undefined") {
					this._transition_end_event_name = transitions[x];
					break;
				}
			}
		}
		return this._transition_end_event_name;
	}
	this._transitioned = function(event) {
		if(event.target == this) {
			u.e.removeEvent(event.target, u.a.transitionEndEventName(), u.a._transitioned);
			u.a.transition(event.target, "none");
			if(fun(this.transitioned)) {
				this.transitioned_before = this.transitioned;
				this.transitioned(event);
				if(this.transitioned === this.transitioned_before) {
					this.transitioned = null;
				}
			}
		}
	}
	this.translate = function(node, x, y) {
		if(this.support3d()) {
			u.as(node, "transform", "translate3d("+x+"px, "+y+"px, 0)");
		}
		else {
			u.as(node, "transform", "translate("+x+"px, "+y+"px)");
		}
		node._x = x;
		node._y = y;
	}
	this.rotate = function(node, deg) {
		u.as(node, "transform", "rotate("+deg+"deg)");
		node._rotation = deg;
	}
	this.scale = function(node, scale) {
		u.as(node, "transform", "scale("+scale+")");
		node._scale = scale;
	}
	this.setOpacity = this.opacity = function(node, opacity) {
		u.as(node, "opacity", opacity);
		node._opacity = opacity;
	}
	this.setWidth = this.width = function(node, width) {
		width = width.toString().match(/\%|auto|px/) ? width : (width + "px");
		node.style.width = width;
		node._width = width;
		node.offsetHeight;
	}
	this.setHeight = this.height = function(node, height) {
		height = height.toString().match(/\%|auto|px/) ? height : (height + "px");
		node.style.height = height;
		node._height = height;
		node.offsetHeight;
	}
	this.setBgPos = this.bgPos = function(node, x, y) {
		x = x.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? x : (x + "px");
		y = y.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? y : (y + "px");
		node.style.backgroundPosition = x + " " + y;
		node._bg_x = x;
		node._bg_y = y;
		node.offsetHeight;
	}
	this.setBgColor = this.bgColor = function(node, color) {
		node.style.backgroundColor = color;
		node._bg_color = color;
		node.offsetHeight;
	}
	this._animationqueue = {};
	this.requestAnimationFrame = function(node, callback, duration) {
		if(!u.a.__animation_frame_start) {
			u.a.__animation_frame_start = Date.now();
		}
		var id = u.randomString();
		u.a._animationqueue[id] = {};
		u.a._animationqueue[id].id = id;
		u.a._animationqueue[id].node = node;
		u.a._animationqueue[id].callback = callback;
		u.a._animationqueue[id].duration = duration;
		u.t.setTimer(u.a, function() {u.a.finalAnimationFrame(id)}, duration);
		if(!u.a._animationframe) {
			window._requestAnimationFrame = eval(u.vendorProperty("requestAnimationFrame"));
			window._cancelAnimationFrame = eval(u.vendorProperty("cancelAnimationFrame"));
			u.a._animationframe = function(timestamp) {
				var id, animation;
				for(id in u.a._animationqueue) {
					animation = u.a._animationqueue[id];
					if(!animation["__animation_frame_start_"+id]) {
						animation["__animation_frame_start_"+id] = timestamp;
					}
					if(fun(animation.node[animation.callback])) {
						animation.node[animation.callback]((timestamp-animation["__animation_frame_start_"+id]) / animation.duration);
					}
				}
				if(Object.keys(u.a._animationqueue).length) {
					u.a._requestAnimationId = window._requestAnimationFrame(u.a._animationframe);
				}
			}
		}
		if(!u.a._requestAnimationId) {
			u.a._requestAnimationId = window._requestAnimationFrame(u.a._animationframe);
		}
		return id;
	}
	this.finalAnimationFrame = function(id) {
		var animation = u.a._animationqueue[id];
		animation["__animation_frame_start_"+id] = false;
		if(fun(animation.node[animation.callback])) {
			animation.node[animation.callback](1);
		}
		if(fun(animation.node.transitioned)) {
			animation.node.transitioned({});
		}
		delete u.a._animationqueue[id];
		if(!Object.keys(u.a._animationqueue).length) {
			this.cancelAnimationFrame(id);
		}
	}
	this.cancelAnimationFrame = function(id) {
		if(id && u.a._animationqueue[id]) {
			delete u.a._animationqueue[id];
		}
		if(u.a._requestAnimationId) {
			window._cancelAnimationFrame(u.a._requestAnimationId);
			u.a.__animation_frame_start = false;
			u.a._requestAnimationId = false;
		}
	}
}
Util.saveCookie = function(name, value, _options) {
	var expires = true;
	var path = false;
	var force = false;
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "expires"	: expires	= _options[_argument]; break;
				case "path"		: path		= _options[_argument]; break;
				case "force"	: force		= _options[_argument]; break;
			}
		}
	}
	if(!force && obj(window.localStorage) && obj(window.sessionStorage)) {
		if(expires === true) {
			window.sessionStorage.setItem(name, value);
		}
		else {
			window.localStorage.setItem(name, value);
		}
		return;
	}
	if(expires === false) {
		expires = ";expires=Mon, 04-Apr-2020 05:00:00 GMT";
	}
	else if(str(expires)) {
		expires = ";expires="+expires;
	}
	else {
		expires = "";
	}
	if(str(path)) {
		path = ";path="+path;
	}
	else {
		path = "";
	}
	document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + path + expires;
}
Util.getCookie = function(name) {
	var matches;
	if(obj(window.sessionStorage) && window.sessionStorage.getItem(name)) {
		return window.sessionStorage.getItem(name)
	}
	else if(obj(window.localStorage) && window.localStorage.getItem(name)) {
		return window.localStorage.getItem(name)
	}
	return (matches = document.cookie.match(encodeURIComponent(name) + "=([^;]+)")) ? decodeURIComponent(matches[1]) : false;
}
Util.deleteCookie = function(name, _options) {
	var path = false;
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "path"	: path	= _options[_argument]; break;
			}
		}
	}
	if(obj(window.sessionStorage)) {
		window.sessionStorage.removeItem(name);
	}
	if(obj(window.localStorage)) {
		window.localStorage.removeItem(name);
	}
	if(str(path)) {
		path = ";path="+path;
	}
	else {
		path = "";
	}
	document.cookie = encodeURIComponent(name) + "=" + path + ";expires=Thu, 01-Jan-70 00:00:01 GMT";
}
Util.saveNodeCookie = function(node, name, value, _options) {
	var ref = u.cookieReference(node, _options);
	var mem = JSON.parse(u.getCookie("man_mem"));
	if(!mem) {
		mem = {};
	}
	if(!mem[ref]) {
		mem[ref] = {};
	}
	mem[ref][name] = (value !== false && value !== undefined) ? value : "";
	u.saveCookie("man_mem", JSON.stringify(mem), {"path":"/"});
}
Util.getNodeCookie = function(node, name, _options) {
	var ref = u.cookieReference(node, _options);
	var mem = JSON.parse(u.getCookie("man_mem"));
	if(mem && mem[ref]) {
		if(name) {
			return mem[ref][name] ? mem[ref][name] : "";
		}
		else {
			return mem[ref];
		}
	}
	return false;
}
Util.deleteNodeCookie = function(node, name, _options) {
	var ref = u.cookieReference(node, _options);
	var mem = JSON.parse(u.getCookie("man_mem"));
	if(mem && mem[ref]) {
		if(name) {
			delete mem[ref][name];
		}
		else {
			delete mem[ref];
		}
	}
	u.saveCookie("man_mem", JSON.stringify(mem), {"path":"/"});
}
Util.cookieReference = function(node, _options) {
	var ref;
	var ignore_classnames = false;
	var ignore_classvars = false;
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "ignore_classnames"	: ignore_classnames	= _options[_argument]; break;
				case "ignore_classvars" 	: ignore_classvars	= _options[_argument]; break;
			}
		}
	}
	if(node.id) {
		ref = node.nodeName + "#" + node.id;
	}
	else {
		var node_identifier = "";
		if(node.name) {
			node_identifier = node.nodeName + "["+node.name+"]";
		}
		else if(node.className) {
			var classname = node.className;
			if(ignore_classnames) {
				var regex = new RegExp("(^| )("+ignore_classnames.split(",").join("|")+")($| )", "g");
				classname = classname.replace(regex, " ").replace(/[ ]{2,4}/, " ");
			}
			if(ignore_classvars) {
				classname = classname.replace(/\b[a-zA-Z_]+\:[\?\=\w\/\\#~\:\.\,\+\&\%\@\!\-]+\b/g, "").replace(/[ ]{2,4}/g, " ");
			}
			node_identifier = node.nodeName+"."+classname.trim().replace(/ /g, ".");
		}
		else {
			node_identifier = node.nodeName
		}
		var id_node = node;
		while(!id_node.id) {
			id_node = id_node.parentNode;
		}
		if(id_node.id) {
			ref = id_node.nodeName + "#" + id_node.id + " " + node_identifier;
		}
		else {
			ref = node_identifier;
		}
	}
	return ref;
}
Util.querySelector = u.qs = function(query, scope) {
	scope = scope ? scope : document;
	return scope.querySelector(query);
}
Util.querySelectorAll = u.qsa = function(query, scope) {
	try {
		scope = scope ? scope : document;
		return scope.querySelectorAll(query);
	}
	catch(exception) {
		u.exception("u.qsa", arguments, exception);
	}
	return [];
}
Util.getElement = u.ge = function(identifier, scope) {
	var node, nodes, i, regexp;
	if(document.getElementById(identifier)) {
		return document.getElementById(identifier);
	}
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	nodes = scope.getElementsByTagName("*");
	for(i = 0; i < nodes.length; i++) {
		node = nodes[i];
		if(regexp.test(node.className)) {
			return node;
		}
	}
	return scope.getElementsByTagName(identifier).length ? scope.getElementsByTagName(identifier)[0] : false;
}
Util.getElements = u.ges = function(identifier, scope) {
	var node, nodes, i, regexp;
	var return_nodes = new Array();
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	nodes = scope.getElementsByTagName("*");
	for(i = 0; i < nodes.length; i++) {
		node = nodes[i];
		if(regexp.test(node.className)) {
			return_nodes.push(node);
		}
	}
	return return_nodes.length ? return_nodes : scope.getElementsByTagName(identifier);
}
Util.parentNode = u.pn = function(node, _options) {
	var exclude = "";
	var include = "";
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "include"      : include       = _options[_argument]; break;
				case "exclude"      : exclude       = _options[_argument]; break;
			}
		}
	}
	var exclude_nodes = exclude ? u.qsa(exclude) : [];
	var include_nodes = include ? u.qsa(include) : [];
	node = node.parentNode;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || (exclude && (u.inNodeList(node, exclude_nodes))) || (include && (!u.inNodeList(node, include_nodes))))) {
		node = node.parentNode;
	}
	return node;
}
Util.previousSibling = u.ps = function(node, _options) {
	var exclude = "";
	var include = "";
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "include"      : include       = _options[_argument]; break;
				case "exclude"      : exclude       = _options[_argument]; break;
			}
		}
	}
	var exclude_nodes = exclude ? u.qsa(exclude, node.parentNode) : [];
	var include_nodes = include ? u.qsa(include, node.parentNode) : [];
	node = node.previousSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || (exclude && (u.inNodeList(node, exclude_nodes))) || (include && (!u.inNodeList(node, include_nodes))))) {
		node = node.previousSibling;
	}
	return node;
}
Util.nextSibling = u.ns = function(node, _options) {
	var exclude = "";
	var include = "";
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "include"      : include       = _options[_argument]; break;
				case "exclude"      : exclude       = _options[_argument]; break;
			}
		}
	}
	var exclude_nodes = exclude ? u.qsa(exclude, node.parentNode) : [];
	var include_nodes = include ? u.qsa(include, node.parentNode) : [];
	node = node.nextSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || (exclude && (u.inNodeList(node, exclude_nodes))) || (include && (!u.inNodeList(node, include_nodes))))) {
		node = node.nextSibling;
	}
	return node;
}
Util.childNodes = u.cn = function(node, _options) {
	var exclude = "";
	var include = "";
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "include"      : include       = _options[_argument]; break;
				case "exclude"      : exclude       = _options[_argument]; break;
			}
		}
	}
	var exclude_nodes = exclude ? u.qsa(exclude, node) : [];
	var include_nodes = include ? u.qsa(include, node) : [];
	var i, child;
	var children = new Array();
	for(i = 0; i < node.childNodes.length; i++) {
		child = node.childNodes[i]
		if(child && child.nodeType != 3 && child.nodeType != 8 && (!exclude || (!u.inNodeList(child, exclude_nodes))) && (!include || (u.inNodeList(child, include_nodes)))) {
			children.push(child);
		}
	}
	return children;
}
Util.appendElement = u.ae = function(_parent, node_type, attributes) {
	try {
		var node = (obj(node_type)) ? node_type : (node_type == "svg" ? document.createElementNS("http://www.w3.org/2000/svg", node_type) : document.createElement(node_type));
		node = _parent.appendChild(node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute];
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.exception("u.ae", arguments, exception);
	}
	return false;
}
Util.insertElement = u.ie = function(_parent, node_type, attributes) {
	try {
		var node = (obj(node_type)) ? node_type : (node_type == "svg" ? document.createElementNS("http://www.w3.org/2000/svg", node_type) : document.createElement(node_type));
		node = _parent.insertBefore(node, _parent.firstChild);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute];
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.exception("u.ie", arguments, exception);
	}
	return false;
}
Util.wrapElement = u.we = function(node, node_type, attributes) {
	try {
		var wrapper_node = node.parentNode.insertBefore(document.createElement(node_type), node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				wrapper_node.setAttribute(attribute, attributes[attribute]);
			}
		}	
		wrapper_node.appendChild(node);
		return wrapper_node;
	}
	catch(exception) {
		u.exception("u.we", arguments, exception);
	}
	return false;
}
Util.wrapContent = u.wc = function(node, node_type, attributes) {
	try {
		var wrapper_node = document.createElement(node_type);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				wrapper_node.setAttribute(attribute, attributes[attribute]);
			}
		}	
		while(node.childNodes.length) {
			wrapper_node.appendChild(node.childNodes[0]);
		}
		node.appendChild(wrapper_node);
		return wrapper_node;
	}
	catch(exception) {
		u.exception("u.wc", arguments, exception);
	}
	return false;
}
Util.textContent = u.text = function(node) {
	try {
		return node.textContent;
	}
	catch(exception) {
		u.exception("u.text", arguments, exception);
	}
	return "";
}
Util.clickableElement = u.ce = function(node, _options) {
	node._use_link = "a";
	node._click_type = "manual";
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "use"			: node._use_link		= _options[_argument]; break;
				case "type"			: node._click_type		= _options[_argument]; break;
			}
		}
	}
	var a = (node.nodeName.toLowerCase() == "a" ? node : u.qs(node._use_link, node));
	if(a) {
		u.ac(node, "link");
		if(a.getAttribute("href") !== null) {
			node.url = a.href;
			a.removeAttribute("href");
			node._a = a;
		}
	}
	else {
		u.ac(node, "clickable");
	}
	if(obj(u.e) && fun(u.e.click)) {
		u.e.click(node, _options);
		if(node._click_type == "link") {
			node.clicked = function(event) {
				if(fun(node.preClicked)) {
					node.preClicked();
				}
				if(event && (event.metaKey || event.ctrlKey)) {
					window.open(this.url);
				}
				else {
					if(obj(u.h) && u.h.is_listening) {
						u.h.navigate(this.url, this);
					}
					else {
						location.href = this.url;
					}
				}
			}
		}
	}
	return node;
}
Util.classVar = u.cv = function(node, var_name) {
	try {
		var regexp = new RegExp("(\^| )" + var_name + ":[?=\\w/\\#~:.,?+=?&%@!\\-]*");
		var match = node.className.match(regexp);
		if(match) {
			return match[0].replace(var_name + ":", "").trim();
		}
	}
	catch(exception) {
		u.exception("u.cv", arguments, exception);
	}
	return false;
}
Util.setClass = u.sc = function(node, classname, dom_update) {
	var old_class;
	if(node instanceof SVGElement) {
		old_class = node.className.baseVal;
		node.setAttribute("class", classname);
	}
	else {
		old_class = node.className;
		node.className = classname;
	}
	dom_update = (dom_update === false) || (node.offsetTop);
	return old_class;
}
Util.hasClass = u.hc = function(node, classname) {
	if(node.classList.contains(classname)) {
		return true;
	}
	else {
		var regexp = new RegExp("(^|\\s)(" + classname + ")(\\s|$)");
		if(node instanceof SVGElement) {
			if(regexp.test(node.className.baseVal)) {
				return true;
			}
		}
		else {
			if(regexp.test(node.className)) {
				return true;
			}
		}
	}
	return false;
}
Util.addClass = u.ac = function(node, classname, dom_update) {
	var classnames = classname.split(" ");
	while(classnames.length) {
		node.classList.add(classnames.shift());
	}
	dom_update = (dom_update === false) || (node.offsetTop);
	return node.className;
}
Util.removeClass = u.rc = function(node, classname, dom_update) {
	if(node.classList.contains(classname)) {
		node.classList.remove(classname);
	}
	else {
		var regexp = new RegExp("(^|\\s)(" + classname + ")(?=[\\s]|$)", "g");
		if(node instanceof SVGElement) {
			node.setAttribute("class", node.className.baseVal.replace(regexp, " ").trim().replace(/[\s]{2}/g, " "));
		}
		else {
			node.className = node.className.replace(regexp, " ").trim().replace(/[\s]{2}/g, " ");
		}
	}
	dom_update = (dom_update === false) || (node.offsetTop);
	return node.className;
}
Util.toggleClass = u.tc = function(node, classname, _classname, dom_update) {
	if(u.hc(node, classname)) {
		u.rc(node, classname);
		if(_classname) {
			u.ac(node, _classname);
		}
	}
	else {
		u.ac(node, classname);
		if(_classname) {
			u.rc(node, _classname);
		}
	}
	dom_update = (dom_update === false) || (node.offsetTop);
	return node.className;
}
Util.applyStyle = u.as = function(node, property, value, dom_update) {
	node.style[u.vendorProperty(property)] = value;
	dom_update = (dom_update === false) || (node.offsetTop);
}
Util.applyStyles = u.ass = function(node, styles, dom_update) {
	if(styles) {
		var style;
		for(style in styles) {
			if(obj(u.a) && style == "transition") {
				u.a.transition(node, styles[style]);
			}
			else {
				node.style[u.vendorProperty(style)] = styles[style];
			}
		}
	}
	dom_update = (dom_update === false) || (node.offsetTop);
}
Util.getComputedStyle = u.gcs = function(node, property) {
	var dom_update = node.offsetHeight;
	property = (u.vendorProperty(property).replace(/([A-Z]{1})/g, "-$1")).toLowerCase().replace(/^(webkit|ms)/, "-$1");
	return window.getComputedStyle(node, null).getPropertyValue(property);
}
Util.hasFixedParent = u.hfp = function(node) {
	while(node.nodeName.toLowerCase() != "body") {
		if(u.gcs(node.parentNode, "position").match("fixed")) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}
u.contains = function(scope, node) {
	if(scope != node) {
		if(scope.contains(node)) {
			return true
		}
	}
	return false;
}
u.containsOrIs = function(scope, node) {
	if(scope == node || u.contains(scope, node)) {
		return true
	}
	return false;
}
Util.insertAfter = u.ia = function(after_node, insert_node) {
	var next_node = u.ns(after_node);
	if(next_node) {
		after_node.parentNode.insertBefore(next_node, insert_node);
	}
	else {
		after_node.parentNode.appendChild(insert_node);
	}
}
Util.selectText = function(node) {
	var selection = window.getSelection();
	var range = document.createRange();
	range.selectNodeContents(node);
	selection.removeAllRanges();
	selection.addRange(range);
}
Util.inNodeList = function(node, list) {
	var i, list_node;
	for(i = 0; i < list.length; i++) {
		list_node = list[i]
		if(list_node === node) {
			return true;
		}
	}
	return false;
}
u.easings = new function() {
	this["ease-in"] = function(progress) {
		return Math.pow((progress), 3);
	}
	this["linear"] = function(progress) {
		return progress;
	}
	this["ease-out"] = function(progress) {
		return 1 - Math.pow(1 - ((progress)), 3);
	}
	this["linear"] = function(progress) {
		return (progress);
	}
	this["ease-in-out-veryslow"] = function(progress) {
		if(progress > 0.5) {
			return 4*Math.pow((progress-1),3)+1;
		}
		return 4*Math.pow(progress,3);  
	}
	this["ease-in-out"] = function(progress) {
		if(progress > 0.5) {
			return 1 - Math.pow(1 - ((progress)), 2);
		}
		return Math.pow((progress), 2);
	}
	this["ease-out-slow"] = function(progress) {
		return 1 - Math.pow(1 - ((progress)), 2);
	}
	this["ease-in-slow"] = function(progress) {
		return Math.pow((progress), 2);
	}
	this["ease-in-veryslow"] = function(progress) {
		return Math.pow((progress), 1.5);
	}
	this["ease-in-fast"] = function(progress) {
		return Math.pow((progress), 4);
	}
	this["easeOutQuad"] = function (progress) {
		d = 1;
		b = 0;
		c = progress;
		t = progress;
		t /= d;
		return -c * t*(t-2) + b;
	};
	this["easeOutCubic"] = function (progress) {
		d = 1;
		b = 0;
		c = progress;
		t = progress;
		t /= d;
		t--;
		return c*(t*t*t + 1) + b;
	};
	this["easeOutQuint"] = function (progress) {
		d = 1;
		b = 0;
		c = progress;
		t = progress;
		t /= d;
		t--;
		return c*(t*t*t*t*t + 1) + b;
	};
	this["easeInOutSine"] = function (progress) {
		d = 1;
		b = 0;
		c = progress;
		t = progress;
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	};
	this["easeInOutElastic"] = function (progress) {
		d = 1;
		b = 0;
		c = progress;
		t = progress;
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	}
	this["easeOutBounce"] = function (progress) {
		d = 1;
		b = 0;
		c = progress;
		t = progress;
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
	}
	this["easeInBack"] = function (progress) {
		var s = 1.70158;
		d = 1;
		b = 0;
		c = progress;
		t = progress;
			return c*(t/=d)*t*((s+1)*t - s) + b;
	}
}
Util.Events = u.e = new function() {
	this.event_pref = typeof(document.ontouchmove) == "undefined" || (navigator.maxTouchPoints > 1 && navigator.userAgent.match(/Windows/i)) ? "mouse" : "touch";
	if (navigator.userAgent.match(/Windows/i) && ((obj(document.ontouchmove) && obj(document.onmousemove)) || (fun(document.ontouchmove) && fun(document.onmousemove)))) {
		this.event_support = "multi";
	}
	else if (obj(document.ontouchmove) || fun(document.ontouchmove)) {
		this.event_support = "touch";
	}
	else {
		this.event_support = "mouse";
	}
	this.events = {
		"mouse": {
			"start":"mousedown",
			"move":"mousemove",
			"end":"mouseup",
			"over":"mouseover",
			"out":"mouseout"
		},
		"touch": {
			"start":"touchstart",
			"move":"touchmove",
			"end":"touchend",
			"over":"touchstart",
			"out":"touchend"
		}
	}
	this.kill = function(event) {
		if(event) {
			event.preventDefault();
			event.stopPropagation();
		}
	}
	this.addEvent = function(node, type, action) {
		try {
			node.addEventListener(type, action, false);
		}
		catch(exception) {
			u.exception("u.e.addEvent", arguments, exception);
		}
	}
	this.removeEvent = function(node, type, action) {
		try {
			node.removeEventListener(type, action, false);
		}
		catch(exception) {
			u.exception("u.e.removeEvent", arguments, exception);
		}
	}
	this.addStartEvent = this.addDownEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.addEvent(node, this.events.mouse.start, action);
			u.e.addEvent(node, this.events.touch.start, action);
		}
		else {
			u.e.addEvent(node, this.events[this.event_support].start, action);
		}
	}
	this.removeStartEvent = this.removeDownEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.removeEvent(node, this.events.mouse.start, action);
			u.e.removeEvent(node, this.events.touch.start, action);
		}
		else {
			u.e.removeEvent(node, this.events[this.event_support].start, action);
		}
	}
	this.addMoveEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.addEvent(node, this.events.mouse.move, action);
			u.e.addEvent(node, this.events.touch.move, action);
		}
		else {
			u.e.addEvent(node, this.events[this.event_support].move, action);
		}
	}
	this.removeMoveEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.removeEvent(node, this.events.mouse.move, action);
			u.e.removeEvent(node, this.events.touch.move, action);
		}
		else {
			u.e.removeEvent(node, this.events[this.event_support].move, action);
		}
	}
	this.addEndEvent = this.addUpEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.addEvent(node, this.events.mouse.end, action);
			u.e.addEvent(node, this.events.touch.end, action);
		}
		else {
			u.e.addEvent(node, this.events[this.event_support].end, action);
		}
	}
	this.removeEndEvent = this.removeUpEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.removeEvent(node, this.events.mouse.end, action);
			u.e.removeEvent(node, this.events.touch.end, action);
		}
		else {
			u.e.removeEvent(node, this.events[this.event_support].end, action);
		}
	}
	this.addOverEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.addEvent(node, this.events.mouse.over, action);
			u.e.addEvent(node, this.events.touch.over, action);
		}
		else {
			u.e.addEvent(node, this.events[this.event_support].over, action);
		}
	}
	this.removeOverEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.removeEvent(node, this.events.mouse.over, action);
			u.e.removeEvent(node, this.events.touch.over, action);
		}
		else {
			u.e.removeEvent(node, this.events[this.event_support].over, action);
		}
	}
	this.addOutEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.addEvent(node, this.events.mouse.out, action);
			u.e.addEvent(node, this.events.touch.out, action);
		}
		else {
			u.e.addEvent(node, this.events[this.event_support].out, action);
		}
	}
	this.removeOutEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.removeEvent(node, this.events.mouse.out, action);
			u.e.removeEvent(node, this.events.touch.out, action);
		}
		else {
			u.e.removeEvent(node, this.events[this.event_support].out, action);
		}
	}
	this.resetClickEvents = function(node) {
		u.t.resetTimer(node.t_held);
		u.t.resetTimer(node.t_clicked);
		this.removeEvent(node, "mouseup", this._dblclicked);
		this.removeEvent(node, "touchend", this._dblclicked);
		this.removeEvent(node, "mouseup", this._rightclicked);
		this.removeEvent(node, "touchend", this._rightclicked);
		this.removeEvent(node, "mousemove", this._cancelClick);
		this.removeEvent(node, "touchmove", this._cancelClick);
		this.removeEvent(node, "mouseout", this._cancelClick);
		this.removeEvent(node, "mousemove", this._move);
		this.removeEvent(node, "touchmove", this._move);
	}
	this.resetEvents = function(node) {
		this.resetClickEvents(node);
		if(fun(this.resetDragEvents)) {
			this.resetDragEvents(node);
		}
	}
	this.resetNestedEvents = function(node) {
		while(node && node.nodeName != "HTML") {
			this.resetEvents(node);
			node = node.parentNode;
		}
	}
	this._inputStart = function(event) {
		this.event_var = event;
		this.input_timestamp = event.timeStamp;
		this.start_event_x = u.eventX(event);
		this.start_event_y = u.eventY(event);
		this.current_xps = 0;
		this.current_yps = 0;
		this.move_timestamp = event.timeStamp;
		this.move_last_x = 0;
		this.move_last_y = 0;
		this.swiped = false;
		if(!event.button) {
			if(this.e_click || this.e_dblclick || this.e_hold) {
				if(event.type.match(/mouse/)) {
					var node = this;
					while(node) {
						if(node.e_drag || node.e_swipe) {
							u.e.addMoveEvent(this, u.e._cancelClick);
							break;
						}
						else {
							node = node.parentNode;
						}
					}
					u.e.addEvent(this, "mouseout", u.e._cancelClick);
				}
				else {
					u.e.addMoveEvent(this, u.e._cancelClick);
				}
				u.e.addMoveEvent(this, u.e._move);
				u.e.addEndEvent(this, u.e._dblclicked);
				if(this.e_hold) {
					this.t_held = u.t.setTimer(this, u.e._held, 750);
				}
			}
			if(this.e_drag || this.e_swipe) {
				u.e.addMoveEvent(this, u.e._pick);
			}
			if(this.e_scroll) {
				u.e.addMoveEvent(this, u.e._scrollStart);
				u.e.addEndEvent(this, u.e._scrollEnd);
			}
		}
		else if(event.button === 2) {
			if(this.e_rightclick) {
				if(event.type.match(/mouse/)) {
					u.e.addEvent(this, "mouseout", u.e._cancelClick);
				}
				else {
					u.e.addMoveEvent(this, u.e._cancelClick);
				}
				u.e.addMoveEvent(this, u.e._move);
				u.e.addEndEvent(this, u.e._rightclicked);
			}
		}
		if(fun(this.inputStarted)) {
			this.inputStarted(event);
		}
	}
	this._cancelClick = function(event) {
		var offset_x = u.eventX(event) - this.start_event_x;
		var offset_y = u.eventY(event) - this.start_event_y;
		if(event.type.match(/mouseout/) || (event.type.match(/move/) && (Math.abs(offset_x) > 15 || Math.abs(offset_y) > 15))) {
			u.e.resetClickEvents(this);
			if(fun(this.clickCancelled)) {
				this.clickCancelled(event);
			}
		}
	}
	this._move = function(event) {
		if(fun(this.moved)) {
			this.current_x = u.eventX(event) - this.start_event_x;
			this.current_y = u.eventY(event) - this.start_event_y;
			this.current_xps = Math.round(((this.current_x - this.move_last_x) / (event.timeStamp - this.move_timestamp)) * 1000);
			this.current_yps = Math.round(((this.current_y - this.move_last_y) / (event.timeStamp - this.move_timestamp)) * 1000);
			this.move_timestamp = event.timeStamp;
			this.move_last_x = this.current_x;
			this.move_last_y = this.current_y;
			this.moved(event);
		}
	}
	this.hold = function(node, _options) {
		node.e_hold_options = _options ? _options : {};
		node.e_hold_options.eventAction = u.stringOr(node.e_hold_options.eventAction, "Held");
		node.e_hold = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._held = function(event) {
		this.e_hold_options.event = event;
		u.stats.event(this, this.e_hold_options);
		u.e.resetNestedEvents(this);
		if(fun(this.held)) {
			this.held(event);
		}
	}
	this.click = this.tap = function(node, _options) {
		node.e_click_options = _options ? _options : {};
		node.e_click_options.eventAction = u.stringOr(node.e_click_options.eventAction, "Clicked");
		node.e_click = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._clicked = function(event) {
		if(this.e_click_options) {
			this.e_click_options.event = event;
			u.stats.event(this, this.e_click_options);
		}
		u.e.resetNestedEvents(this);
		if(fun(this.clicked)) {
			this.clicked(event);
		}
	}
	this.rightclick = function(node, _options) {
		node.e_rightclick_options = _options ? _options : {};
		node.e_rightclick_options.eventAction = u.stringOr(node.e_rightclick_options.eventAction, "RightClicked");
		node.e_rightclick = true;
		u.e.addStartEvent(node, this._inputStart);
		u.e.addEvent(node, "contextmenu", function(event){u.e.kill(event);});
	}
	this._rightclicked = function(event) {
		u.bug("_rightclicked:", this);
		if(this.e_rightclick_options) {
			this.e_rightclick_options.event = event;
			u.stats.event(this, this.e_rightclick_options);
		}
		u.e.resetNestedEvents(this);
		if(fun(this.rightclicked)) {
			this.rightclicked(event);
		}
	}
	this.dblclick = this.doubleclick = this.doubletap = this.dbltap = function(node, _options) {
		node.e_dblclick_options = _options ? _options : {};
		node.e_dblclick_options.eventAction = u.stringOr(node.e_dblclick_options.eventAction, "DblClicked");
		node.e_dblclick = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._dblclicked = function(event) {
		if(u.t.valid(this.t_clicked) && event) {
			this.e_dblclick_options.event = event;
			u.stats.event(this, this.e_dblclick_options);
			u.e.resetNestedEvents(this);
			if(fun(this.dblclicked)) {
				this.dblclicked(event);
			}
			return;
		}
		else if(!this.e_dblclick) {
			this._clicked = u.e._clicked;
			this._clicked(event);
		}
		else if(event.type == "timeout") {
			this._clicked = u.e._clicked;
			this._clicked(this.event_var);
		}
		else {
			u.e.resetNestedEvents(this);
			this.t_clicked = u.t.setTimer(this, u.e._dblclicked, 400);
		}
	}
	this.hover = function(node, _options) {
		node._hover_out_delay = 100;
		node._hover_over_delay = 0;
		node._callback_out = "out";
		node._callback_over = "over";
		if(obj(_options)) {
			var argument;
			for(argument in _options) {
				switch(argument) {
					case "over"				: node._callback_over		= _options[argument]; break;
					case "out"				: node._callback_out		= _options[argument]; break;
					case "delay_over"		: node._hover_over_delay	= _options[argument]; break;
					case "delay"			: node._hover_out_delay		= _options[argument]; break;
				}
			}
		}
		node.e_hover = true;
		u.e.addOverEvent(node, this._over);
		u.e.addOutEvent(node, this._out);
	}
	this._over = function(event) {
		u.t.resetTimer(this.t_out);
		if(!this._hover_over_delay) {
			u.e.__over.call(this, event);
		}
		else if(!u.t.valid(this.t_over)) {
			this.t_over = u.t.setTimer(this, u.e.__over, this._hover_over_delay, event);
		}
	}
	this.__over = function(event) {
		u.t.resetTimer(this.t_out);
		if(!this.is_hovered) {
			this.is_hovered = true;
			u.e.removeOverEvent(this, u.e._over);
			u.e.addOverEvent(this, u.e.__over);
			if(fun(this[this._callback_over])) {
				this[this._callback_over](event);
			}
		}
	}
	this._out = function(event) {
		u.t.resetTimer(this.t_over);
		u.t.resetTimer(this.t_out);
		this.t_out = u.t.setTimer(this, u.e.__out, this._hover_out_delay, event);
	}
	this.__out = function(event) {
		this.is_hovered = false;
		u.e.removeOverEvent(this, u.e.__over);
		u.e.addOverEvent(this, u.e._over);
		if(fun(this[this._callback_out])) {
			this[this._callback_out](event);
		}
	}
}
u.e.addDOMReadyEvent = function(action) {
	if(document.readyState && document.addEventListener) {
		if((document.readyState == "interactive" && !u.browser("ie")) || document.readyState == "complete" || document.readyState == "loaded") {
			action();
		}
		else {
			var id = u.randomString();
			window["DOMReady_" + id] = action;
			eval('window["_DOMReady_' + id + '"] = function() {window["DOMReady_'+id+'"](); u.e.removeEvent(document, "DOMContentLoaded", window["_DOMReady_' + id + '"])}');
			u.e.addEvent(document, "DOMContentLoaded", window["_DOMReady_" + id]);
		}
	}
	else {
		u.e.addOnloadEvent(action);
	}
}
u.e.addOnloadEvent = function(action) {
	if(document.readyState && (document.readyState == "complete" || document.readyState == "loaded")) {
		action();
	}
	else {
		var id = u.randomString();
		window["Onload_" + id] = action;
		eval('window["_Onload_' + id + '"] = function() {window["Onload_'+id+'"](); u.e.removeEvent(window, "load", window["_Onload_' + id + '"])}');
		u.e.addEvent(window, "load", window["_Onload_" + id]);
	}
}
u.e.addWindowEvent = function(node, type, action) {
	var id = u.randomString();
	window["_OnWindowEvent_node_"+ id] = node;
	if(fun(action)) {
		eval('window["_OnWindowEvent_callback_' + id + '"] = function(event) {window["_OnWindowEvent_node_'+ id + '"]._OnWindowEvent_callback_'+id+' = '+action+'; window["_OnWindowEvent_node_'+ id + '"]._OnWindowEvent_callback_'+id+'(event);};');
	} 
	else {
		eval('window["_OnWindowEvent_callback_' + id + '"] = function(event) {if(fun(window["_OnWindowEvent_node_'+ id + '"]["'+action+'"])) {window["_OnWindowEvent_node_'+id+'"]["'+action+'"](event);}};');
	}
	u.e.addEvent(window, type, window["_OnWindowEvent_callback_" + id]);
	return id;
}
u.e.removeWindowEvent = function(node, type, id) {
	u.e.removeEvent(window, type, window["_OnWindowEvent_callback_"+id]);
	window["_OnWindowEvent_node_"+id] = null;
	window["_OnWindowEvent_callback_"+id] = null;
}
u.e.addWindowStartEvent = function(node, action) {
	var id = u.randomString();
	window["_Onstart_node_"+ id] = node;
	if(fun(action)) {
		eval('window["_Onstart_callback_' + id + '"] = function(event) {window["_Onstart_node_'+ id + '"]._Onstart_callback_'+id+' = '+action+'; window["_Onstart_node_'+ id + '"]._Onstart_callback_'+id+'(event);};');
	} 
	else {
		eval('window["_Onstart_callback_' + id + '"] = function(event) {if(fun(window["_Onstart_node_'+ id + '"]["'+action+'"])) {window["_Onstart_node_'+id+'"]["'+action+'"](event);}};');
	}
	u.e.addStartEvent(window, window["_Onstart_callback_" + id]);
	return id;
}
u.e.removeWindowStartEvent = function(node, id) {
	u.e.removeStartEvent(window, window["_Onstart_callback_"+id]);
	window["_Onstart_node_"+id]["_Onstart_callback_"+id] = null;
	window["_Onstart_node_"+id] = null;
	window["_Onstart_callback_"+id] = null;
}
u.e.addWindowMoveEvent = function(node, action) {
	var id = u.randomString();
	window["_Onmove_node_"+ id] = node;
	if(fun(action)) {
		eval('window["_Onmove_callback_' + id + '"] = function(event) {window["_Onmove_node_'+ id + '"]._Onmove_callback_'+id+' = '+action+'; window["_Onmove_node_'+ id + '"]._Onmove_callback_'+id+'(event);};');
	} 
	else {
		eval('window["_Onmove_callback_' + id + '"] = function(event) {if(fun(window["_Onmove_node_'+ id + '"]["'+action+'"])) {window["_Onmove_node_'+id+'"]["'+action+'"](event);}};');
	}
	u.e.addMoveEvent(window, window["_Onmove_callback_" + id]);
	return id;
}
u.e.removeWindowMoveEvent = function(node, id) {
	u.e.removeMoveEvent(window, window["_Onmove_callback_" + id]);
	window["_Onmove_node_"+ id]["_Onmove_callback_"+id] = null;
	window["_Onmove_node_"+ id] = null;
	window["_Onmove_callback_"+ id] = null;
}
u.e.addWindowEndEvent = function(node, action) {
	var id = u.randomString();
	window["_Onend_node_"+ id] = node;
	if(fun(action)) {
		eval('window["_Onend_callback_' + id + '"] = function(event) {window["_Onend_node_'+ id + '"]._Onend_callback_'+id+' = '+action+'; window["_Onend_node_'+ id + '"]._Onend_callback_'+id+'(event);};');
	} 
	else {
		eval('window["_Onend_callback_' + id + '"] = function(event) {if(fun(window["_Onend_node_'+ id + '"]["'+action+'"])) {window["_Onend_node_'+id+'"]["'+action+'"](event);}};');
	}
	u.e.addEndEvent(window, window["_Onend_callback_" + id]);
	return id;
}
u.e.removeWindowEndEvent = function(node, id) {
	u.e.removeEndEvent(window, window["_Onend_callback_" + id]);
	window["_Onend_node_"+ id]["_Onend_callback_"+id] = null;
	window["_Onend_node_"+ id] = null;
	window["_Onend_callback_"+ id] = null;
}
u.e.resetDragEvents = function(node) {
	node._moves_pick = 0;
	this.removeEvent(node, "mousemove", this._pick);
	this.removeEvent(node, "touchmove", this._pick);
	this.removeEvent(node, "mousemove", this._drag);
	this.removeEvent(node, "touchmove", this._drag);
	this.removeEvent(node, "mouseup", this._drop);
	this.removeEvent(node, "touchend", this._drop);
	this.removeEvent(node, "mouseout", this._drop_out);
	this.removeEvent(node, "mouseover", this._drop_over);
	this.removeEvent(node, "mousemove", this._scrollStart);
	this.removeEvent(node, "touchmove", this._scrollStart);
	this.removeEvent(node, "mousemove", this._scrolling);
	this.removeEvent(node, "touchmove", this._scrolling);
	this.removeEvent(node, "mouseup", this._scrollEnd);
	this.removeEvent(node, "touchend", this._scrollEnd);
}
u.e.overlap = function(node, boundaries, strict) {
	if(boundaries.constructor.toString().match("Array")) {
		var boundaries_start_x = Number(boundaries[0]);
		var boundaries_start_y = Number(boundaries[1]);
		var boundaries_end_x = Number(boundaries[2]);
		var boundaries_end_y = Number(boundaries[3]);
	}
	else if(boundaries.constructor.toString().match("HTML")) {
		var boundaries_start_x = u.absX(boundaries) - u.absX(node);
		var boundaries_start_y =  u.absY(boundaries) - u.absY(node);
		var boundaries_end_x = Number(boundaries_start_x + boundaries.offsetWidth);
		var boundaries_end_y = Number(boundaries_start_y + boundaries.offsetHeight);
	}
	var node_start_x = Number(node._x);
	var node_start_y = Number(node._y);
	var node_end_x = Number(node_start_x + node.offsetWidth);
	var node_end_y = Number(node_start_y + node.offsetHeight);
	if(strict) {
		if(node_start_x >= boundaries_start_x && node_start_y >= boundaries_start_y && node_end_x <= boundaries_end_x && node_end_y <= boundaries_end_y) {
			return true;
		}
		else {
			return false;
		}
	} 
	else if(node_end_x < boundaries_start_x || node_start_x > boundaries_end_x || node_end_y < boundaries_start_y || node_start_y > boundaries_end_y) {
		return false;
	}
	return true;
}
u.e.drag = function(node, boundaries, _options) {
	node.e_drag_options = _options ? _options : {};
	node.e_drag = true;
	if(node.childNodes.length < 2 && node.innerHTML.trim() == "") {
		node.innerHTML = "&nbsp;";
	}
	node.distance_to_pick = 2;
	node.drag_strict = true;
	node.drag_overflow = false;
	node.drag_elastica = 0;
	node.drag_dropout = true;
	node.show_bounds = false;
	node.callback_ready = "ready";
	node.callback_picked = "picked";
	node.callback_moved = "moved";
	node.callback_dropped = "dropped";
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "strict"			: node.drag_strict			= _options[_argument]; break;
				case "overflow"			: node.drag_overflow		= _options[_argument]; break;
				case "elastica"			: node.drag_elastica		= Number(_options[_argument]); break;
				case "dropout"			: node.drag_dropout			= _options[_argument]; break;
				case "show_bounds"		: node.show_bounds			= _options[_argument]; break; 
				case "vertical_lock"	: node.vertical_lock		= _options[_argument]; break;
				case "horizontal_lock"	: node.horizontal_lock		= _options[_argument]; break;
				case "callback_picked"	: node.callback_picked		= _options[_argument]; break;
				case "callback_moved"	: node.callback_moved		= _options[_argument]; break;
				case "callback_dropped"	: node.callback_dropped		= _options[_argument]; break;
			}
		}
	}
	u.e.setDragBoundaries(node, boundaries);
	u.e.addStartEvent(node, this._inputStart);
	if(fun(node[node.callback_ready])) {
		node[node.callback_ready](event);
	}
}
u.e._pick = function(event) {
	var init_speed_x = Math.abs(this.start_event_x - u.eventX(event));
	var init_speed_y = Math.abs(this.start_event_y - u.eventY(event));
	if(
		(init_speed_x > init_speed_y && this.only_horizontal) || 
		(init_speed_x < init_speed_y && this.only_vertical) ||
		(!this.only_vertical && !this.only_horizontal)) {
		if((init_speed_x > this.distance_to_pick || init_speed_y > this.distance_to_pick)) {
			u.e.resetNestedEvents(this);
			u.e.kill(event);
			if(u.hasFixedParent(this)) {
				this.has_fixed_parent = true;
			}
			else {
				this.has_fixed_parent = false;
			}
			this.move_timestamp = event.timeStamp;
			this.move_last_x = this._x;
			this.move_last_y = this._y;
			if(u.hasFixedParent(this)) {
				this.start_input_x = u.eventX(event) - this._x - u.scrollX(); 
				this.start_input_y = u.eventY(event) - this._y - u.scrollY();
			}
			else {
				this.start_input_x = u.eventX(event) - this._x; 
				this.start_input_y = u.eventY(event) - this._y;
			}
			this.current_xps = 0;
			this.current_yps = 0;
			u.a.transition(this, "none");
			u.e.addMoveEvent(this, u.e._drag);
			u.e.addEndEvent(this, u.e._drop);
			if(fun(this[this.callback_picked])) {
				this[this.callback_picked](event);
			}
			if(this.drag_dropout && event.type.match(/mouse/)) {
				this._dropOutDrag = u.e._drag;
				this._dropOutDrop = u.e._drop;
				u.e.addOutEvent(this, u.e._drop_out);
			}
		}
	}
}
u.e._drag = function(event) {
	if(this.has_fixed_parent) {
		this.current_x = u.eventX(event) - this.start_input_x - u.scrollX();
		this.current_y = u.eventY(event) - this.start_input_y - u.scrollY();
	}
	else {
		this.current_x = u.eventX(event) - this.start_input_x;
		this.current_y = u.eventY(event) - this.start_input_y;
	}
	this.current_xps = Math.round(((this.current_x - this.move_last_x) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.current_yps = Math.round(((this.current_y - this.move_last_y) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.move_timestamp = event.timeStamp;
	this.move_last_x = this.current_x;
	this.move_last_y = this.current_y;
	if(!this.locked && this.only_vertical) {
		this._y = this.current_y;
	}
	else if(!this.locked && this.only_horizontal) {
		this._x = this.current_x;
	}
	else if(!this.locked) {
		this._x = this.current_x;
		this._y = this.current_y;
	}
	if(this.e_swipe) {
		if(this.only_horizontal) {
			if(this.current_xps < 0) {
				this.swiped = "left";
			}
			else {
				this.swiped = "right";
			}
		}
		else if(this.only_vertical) {
			if(this.current_yps < 0) {
				this.swiped = "up";
			}
			else {
				this.swiped = "down";
			}
		}
		else {
			if(Math.abs(this.current_xps) > Math.abs(this.current_yps)) {
				if(this.current_xps < 0) {
					this.swiped = "left";
				}
				else {
					this.swiped = "right";
				}
			}
			else if(Math.abs(this.current_xps) < Math.abs(this.current_yps)) {
				if(this.current_yps < 0) {
					this.swiped = "up";
				}
				else {
					this.swiped = "down";
				}
			}
		}
	}
	if(!this.locked) {
		if(u.e.overlap(this, [this.start_drag_x, this.start_drag_y, this.end_drag_x, this.end_drag_y], true)) {
			u.a.translate(this, this._x, this._y);
		}
		else if(this.drag_elastica) {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			var offset = false;
			if(!this.only_vertical && this._x < this.start_drag_x) {
				offset = this._x < this.start_drag_x - this.drag_elastica ? - this.drag_elastica : this._x - this.start_drag_x;
				this._x = this.start_drag_x;
				this.current_x = this._x + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.only_vertical && this._x + this.offsetWidth > this.end_drag_x) {
				offset = this._x + this.offsetWidth > this.end_drag_x + this.drag_elastica ? this.drag_elastica : this._x + this.offsetWidth - this.end_drag_x;
				this._x = this.end_drag_x - this.offsetWidth;
				this.current_x = this._x + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_x = this._x;
			}
			if(!this.only_horizontal && this._y < this.start_drag_y) {
				offset = this._y < this.start_drag_y - this.drag_elastica ? - this.drag_elastica : this._y - this.start_drag_y;
				this._y = this.start_drag_y;
				this.current_y = this._y + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.horizontal && this._y + this.offsetHeight > this.end_drag_y) {
				offset = (this._y + this.offsetHeight > this.end_drag_y + this.drag_elastica) ? this.drag_elastica : (this._y + this.offsetHeight - this.end_drag_y);
				this._y = this.end_drag_y - this.offsetHeight;
				this.current_y = this._y + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_y = this._y;
			}
			if(offset) {
				u.a.translate(this, this.current_x, this.current_y);
			}
		}
		else {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			if(this._x < this.start_drag_x) {
				this._x = this.start_drag_x;
			}
			else if(this._x + this.offsetWidth > this.end_drag_x) {
				this._x = this.end_drag_x - this.offsetWidth;
			}
			if(this._y < this.start_drag_y) {
				this._y = this.start_drag_y;
			}
			else if(this._y + this.offsetHeight > this.end_drag_y) { 
				this._y = this.end_drag_y - this.offsetHeight;
			}
			u.a.translate(this, this._x, this._y);
		}
	}
	if(fun(this[this.callback_moved])) {
		this[this.callback_moved](event);
	}
}
u.e._drop = function(event) {
	u.e.resetEvents(this);
	if(this.e_swipe && this.swiped) {
		this.e_swipe_options.eventAction = "Swiped "+ this.swiped;
		u.stats.event(this, this.e_swipe_options);
		if(this.swiped == "left" && fun(this.swipedLeft)) {
			this.swipedLeft(event);
		}
		else if(this.swiped == "right" && fun(this.swipedRight)) {
			this.swipedRight(event);
		}
		else if(this.swiped == "down" && fun(this.swipedDown)) {
			this.swipedDown(event);
		}
		else if(this.swiped == "up" && fun(this.swipedUp)) {
			this.swipedUp(event);
		}
	}
	else if(!this.drag_strict && !this.locked) {
		this.current_x = Math.round(this._x + (this.current_xps/2));
		this.current_y = Math.round(this._y + (this.current_yps/2));
		if(this.only_vertical || this.current_x < this.start_drag_x) {
			this.current_x = this.start_drag_x;
		}
		else if(this.current_x + this.offsetWidth > this.end_drag_x) {
			this.current_x = this.end_drag_x - this.offsetWidth;
		}
		if(this.only_horizontal || this.current_y < this.start_drag_y) {
			this.current_y = this.start_drag_y;
		}
		else if(this.current_y + this.offsetHeight > this.end_drag_y) {
			this.current_y = this.end_drag_y - this.offsetHeight;
		}
		this.transitioned = function() {
			if(fun(this.projected)) {
				this.projected(event);
			}
		}
		if(this.current_xps || this.current_yps) {
			u.a.transition(this, "all 1s cubic-bezier(0,0,0.25,1)");
		}
		else {
			u.a.transition(this, "none");
		}
		u.a.translate(this, this.current_x, this.current_y);
	}
	if(this.e_drag && !this.e_swipe) {
		this.e_drag_options.eventAction = u.stringOr(this.e_drag_options.eventAction, "Dropped");
		u.stats.event(this, this.e_drag_options);
	}
	if(fun(this[this.callback_dropped])) {
		this[this.callback_dropped](event);
	}
}
u.e._drop_out = function(event) {
	this._drop_out_id = u.randomString();
	document["_DroppedOutNode" + this._drop_out_id] = this;
	eval('document["_DroppedOutMove' + this._drop_out_id + '"] = function(event) {document["_DroppedOutNode' + this._drop_out_id + '"]._dropOutDrag(event);}');
	eval('document["_DroppedOutOver' + this._drop_out_id + '"] = function(event) {u.e.removeEvent(document, "mousemove", document["_DroppedOutMove' + this._drop_out_id + '"]);u.e.removeEvent(document, "mouseup", document["_DroppedOutEnd' + this._drop_out_id + '"]);u.e.removeEvent(document["_DroppedOutNode' + this._drop_out_id + '"], "mouseover", document["_DroppedOutOver' + this._drop_out_id + '"]);}');
	eval('document["_DroppedOutEnd' + this._drop_out_id + '"] = function(event) {u.e.removeEvent(document, "mousemove", document["_DroppedOutMove' + this._drop_out_id + '"]);u.e.removeEvent(document, "mouseup", document["_DroppedOutEnd' + this._drop_out_id + '"]);u.e.removeEvent(document["_DroppedOutNode' + this._drop_out_id + '"], "mouseover", document["_DroppedOutOver' + this._drop_out_id + '"]);document["_DroppedOutNode' + this._drop_out_id + '"]._dropOutDrop(event);}');
	u.e.addEvent(document, "mousemove", document["_DroppedOutMove" + this._drop_out_id]);
	u.e.addEvent(this, "mouseover", document["_DroppedOutOver" + this._drop_out_id]);
	u.e.addEvent(document, "mouseup", document["_DroppedOutEnd" + this._drop_out_id]);
}
u.e.setDragBoundaries = function(node, boundaries) {
	if((boundaries.constructor && boundaries.constructor.toString().match("Array")) || (boundaries.scopeName && boundaries.scopeName != "HTML")) {
		node.start_drag_x = Number(boundaries[0]);
		node.start_drag_y = Number(boundaries[1]);
		node.end_drag_x = Number(boundaries[2]);
		node.end_drag_y = Number(boundaries[3]);
	}
	else if((boundaries.constructor && boundaries.constructor.toString().match("HTML")) || (boundaries.scopeName && boundaries.scopeName == "HTML")) {
		if(node.drag_overflow == "scroll") {
			node.start_drag_x = node.offsetWidth > boundaries.offsetWidth ? boundaries.offsetWidth - node.offsetWidth : 0;
			node.start_drag_y = node.offsetHeight > boundaries.offsetHeight ? boundaries.offsetHeight - node.offsetHeight : 0;
			node.end_drag_x = node.offsetWidth > boundaries.offsetWidth ? node.offsetWidth : boundaries.offsetWidth;
			node.end_drag_y = node.offsetHeight > boundaries.offsetHeight ? node.offsetHeight : boundaries.offsetHeight;
		}
		else {
			node.start_drag_x = u.absX(boundaries) - u.absX(node);
			node.start_drag_y = u.absY(boundaries) - u.absY(node);
			node.end_drag_x = node.start_drag_x + boundaries.offsetWidth;
			node.end_drag_y = node.start_drag_y + boundaries.offsetHeight;
		}
	}
	if(node.show_bounds) {
		var debug_bounds = u.ae(document.body, "div", {"class":"debug_bounds"})
		debug_bounds.style.position = "absolute";
		debug_bounds.style.background = "red"
		debug_bounds.style.left = (u.absX(node) + node.start_drag_x - 1) + "px";
		debug_bounds.style.top = (u.absY(node) + node.start_drag_y - 1) + "px";
		debug_bounds.style.width = (node.end_drag_x - node.start_drag_x) + "px";
		debug_bounds.style.height = (node.end_drag_y - node.start_drag_y) + "px";
		debug_bounds.style.border = "1px solid white";
		debug_bounds.style.zIndex = 9999;
		debug_bounds.style.opacity = .5;
		if(document.readyState && document.readyState == "interactive") {
			debug_bounds.innerHTML = "WARNING - injected on DOMLoaded"; 
		}
		u.bug("node: "+u.nodeId(node)+" in (" + u.absX(node) + "," + u.absY(node) + "), (" + (u.absX(node)+node.offsetWidth) + "," + (u.absY(node)+node.offsetHeight) +")");
		u.bug("boundaries: (" + node.start_drag_x + "," + node.start_drag_y + "), (" + node.end_drag_x + ", " + node.end_drag_y + ")");
	}
	node._x = node._x ? node._x : 0;
	node._y = node._y ? node._y : 0;
	if(node.drag_overflow == "scroll" && (boundaries.constructor && boundaries.constructor.toString().match("HTML")) || (boundaries.scopeName && boundaries.scopeName == "HTML")) {
		node.locked = ((node.end_drag_x - node.start_drag_x <= boundaries.offsetWidth) && (node.end_drag_y - node.start_drag_y <= boundaries.offsetHeight));
		node.only_vertical = (node.vertical_lock || (!node.locked && node.end_drag_x - node.start_drag_x <= boundaries.offsetWidth));
		node.only_horizontal = (node.horizontal_lock || (!node.locked && node.end_drag_y - node.start_drag_y <= boundaries.offsetHeight));
	}
	else {
		node.locked = ((node.end_drag_x - node.start_drag_x == node.offsetWidth) && (node.end_drag_y - node.start_drag_y == node.offsetHeight));
		node.only_vertical = (node.vertical_lock || (!node.locked && node.end_drag_x - node.start_drag_x == node.offsetWidth));
		node.only_horizontal = (node.horizontal_lock || (!node.locked && node.end_drag_y - node.start_drag_y == node.offsetHeight));
	}
}
u.e.setDragPosition = function(node, x, y) {
	node.current_xps = 0;
	node.current_yps = 0;
	node._x = x;
	node._y = y;
	u.a.translate(node, node._x, node._y);
	if(fun(node[node.callback_moved])) {
		node[node.callback_moved](event);
	}
}
u.e.swipe = function(node, boundaries, _options) {
	node.e_swipe_options = _options ? _options : {};
	node.e_swipe = true;
	u.e.drag(node, boundaries, _options);
}
Util.Form = u.f = new function() {
	this.customInit = {};
	this.customValidate = {};
	this.customSend = {};
	this.customHintPosition = {};
	this.init = function(_form, _options) {
		var i, j, field, action, input, hidden_field;
		if(_form.nodeName.toLowerCase() != "form") {
			_form.native_form = u.pn(_form, {"include":"form"});
			if(!_form.native_form) {
				u.bug("there is no form in this document??");
				return;
			}
		}
		else {
			_form.native_form = _form;
		}
		_form._focus_z_index = 50;
		_form._hover_z_index = 49;
		_form._validation = true;
		_form._debug_init = false;
		if(obj(_options)) {
			var _argument;
			for(_argument in _options) {
				switch(_argument) {
					case "validation"       : _form._validation      = _options[_argument]; break;
					case "focus_z"          : _form._focus_z_index   = _options[_argument]; break;
					case "debug"            : _form._debug_init      = _options[_argument]; break;
				}
			}
		}
		_form.native_form.onsubmit = function(event) {
			if(event.target._form) {
				return false;
			}
		}
		_form.native_form.setAttribute("novalidate", "novalidate");
		_form.DOMsubmit = _form.native_form.submit;
		_form.submit = this._submit;
		_form.DOMreset = _form.native_form.reset;
		_form.reset = this._reset;
		_form.fields = {};
		_form.actions = {};
		_form.error_fields = {};
		_form.labelstyle = u.cv(_form, "labelstyle");
		var fields = u.qsa(".field", _form);
		for(i = 0; i < fields.length; i++) {
			field = fields[i];
			field._base_z_index = u.gcs(field, "z-index");
			field._help = u.qs(".help", field);
			field._hint = u.qs(".hint", field);
			field._error = u.qs(".error", field);
			field._indicator = u.ae(field, "div", {"class":"indicator"});
			if(fun(u.f.fixFieldHTML)) {
				u.f.fixFieldHTML(field);
			}
			field._initialized = false;
			var custom_init;
			for(custom_init in this.customInit) {
				if(u.hc(field, custom_init)) {
					this.customInit[custom_init](_form, field);
					field._initialized = true;
				}
			}
			if(!field._initialized) {
				if(u.hc(field, "string|email|tel|number|integer|password|date|datetime")) {
					field._input = u.qs("input", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					field._input.val = this._value;
					u.e.addEvent(field._input, "keyup", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					this.inputOnEnter(field._input);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else if(u.hc(field, "text")) {
					field._input = u.qs("textarea", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					field._input.val = this._value;
					if(u.hc(field, "autoexpand")) {
						var current_height = parseInt(u.gcs(field._input, "height"));
						var current_value = field._input.val();
						field._input.value = "";
						u.as(field._input, "overflow", "hidden");
						field._input.autoexpand_offset = 0;
						if(parseInt(u.gcs(field._input, "height")) != field._input.scrollHeight) {
							field._input.autoexpand_offset = field._input.scrollHeight - parseInt(u.gcs(field._input, "height"));
						}
						field._input.value = current_value;
						field._input.setHeight = function() {
							var textarea_height = parseInt(u.gcs(this, "height"));
							if(this.val()) {
								if(u.browser("webkit") || u.browser("firefox", ">=29")) {
									if(this.scrollHeight - this.autoexpand_offset > textarea_height) {
										u.a.setHeight(this, this.scrollHeight);
									}
								}
								else if(u.browser("opera") || u.browser("explorer")) {
									if(this.scrollHeight > textarea_height) {
										u.a.setHeight(this, this.scrollHeight);
									}
								}
								else {
									u.a.setHeight(this, this.scrollHeight);
								}
							}
						}
						u.e.addEvent(field._input, "keyup", field._input.setHeight);
						field._input.setHeight();
					}
					u.e.addEvent(field._input, "keyup", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else if(u.hc(field, "select")) {
					field._input = u.qs("select", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					field._input.val = this._value_select;
					u.e.addEvent(field._input, "change", this._updated);
					u.e.addEvent(field._input, "keyup", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else if(u.hc(field, "checkbox|boolean")) {
					field._input = u.qs("input[type=checkbox]", field);
					field._input._form = _form;
					field._input.field = field;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					_form.fields[field._input.name] = field._input;
					field._input.val = this._value_checkbox;
					if(u.browser("explorer", "<=8")) {
						field._input.pre_state = field._input.checked;
						field._input._changed = this._changed;
						field._input._updated = this._updated;
						field._input._update_checkbox_field = this._update_checkbox_field;
						field._input._clicked = function(event) {
							if(this.checked != this.pre_state) {
								this._changed(window.event);
								this._updated(window.event);
								this._update_checkbox_field(window.event);
							}
							this.pre_state = this.checked;
						}
						u.e.addEvent(field._input, "click", field._input._clicked);
					}
					else {
						u.e.addEvent(field._input, "change", this._changed);
						u.e.addEvent(field._input, "change", this._updated);
						u.e.addEvent(field._input, "change", this._update_checkbox_field);
					}
					this.inputOnEnter(field._input);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else if(u.hc(field, "radiobuttons")) {
					field._inputs = u.qsa("input", field);
					field._input = field._inputs[0];
					_form.fields[field._input.name] = field._input;
					for(j = 0; j < field._inputs.length; j++) {
						input = field._inputs[j];
						input.field = field;
						input._form = _form;
						input._label = u.qs("label[for='"+input.id+"']", field);
						input.val = this._value_radiobutton;
						if(u.browser("explorer", "<=8")) {
							input.pre_state = input.checked;
							input._changed = this._changed;
							input._updated = this._updated;
							input._clicked = function(event) {
								var i, input;
								if(this.checked != this.pre_state) {
									this._changed(window.event);
									this._updated(window.event);
								}
								for(i = 0; i < field._input.length; i++) {
									input = this.field._input[i];
									input.pre_state = input.checked;
								}
							}
							u.e.addEvent(input, "click", input._clicked);
						}
						else {
							u.e.addEvent(input, "change", this._changed);
							u.e.addEvent(input, "change", this._updated);
						}
						this.inputOnEnter(input);
						this.activateInput(input);
					}
					this.validate(field._input);
				}
				else if(u.hc(field, "files")) {
					field._input = u.qs("input", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					u.e.addEvent(field._input, "change", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					u.e.addEvent(field._input, "focus", this._focus);
					u.e.addEvent(field._input, "blur", this._blur);
					if(u.e.event_pref == "mouse") {
						u.e.addEvent(field._input, "dragenter", this._focus);
						u.e.addEvent(field._input, "dragleave", this._blur);
						u.e.addEvent(field._input, "mouseenter", this._mouseenter);
						u.e.addEvent(field._input, "mouseleave", this._mouseleave);
					}
					u.e.addEvent(field._input, "blur", this._validate);
					field._input.val = this._value_file;
					this.validate(field._input);
				}
				else if(u.hc(field, "tags")) {
					field._input = u.qs("input", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					field._input.val = this._value;
					u.e.addEvent(field._input, "keyup", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					this.inputOnEnter(field._input);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else if(u.hc(field, "prices")) {
					field._input = u.qs("input", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					field._input.val = this._value;
					u.e.addEvent(field._input, "keyup", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					this.inputOnEnter(field._input);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else {
					u.bug("UNKNOWN FIELD IN FORM INITIALIZATION:" + u.nodeId(field));
				}
			}
		}
		var hidden_fields = u.qsa("input[type=hidden]", _form);
		for(i = 0; i < hidden_fields.length; i++) {
			hidden_field = hidden_fields[i];
			if(!_form.fields[hidden_field.name]) {
				_form.fields[hidden_field.name] = hidden_field;
				hidden_field._form = _form;
				hidden_field.val = this._value;
			}
		}
		var actions = u.qsa(".actions li input[type=button],.actions li input[type=submit],.actions li input[type=reset],.actions li a.button", _form);
		for(i = 0; i < actions.length; i++) {
			action = actions[i];
				action._form = _form;
			this.activateButton(action);
		}
		if(_form._debug_init) {
			u.bug(u.nodeId(_form) + ", fields:");
			u.xInObject(_form.fields);
			u.bug(u.nodeId(_form) + ", actions:");
			u.xInObject(_form.actions);
		}
	}
	this._reset = function (event, iN) {
		for (name in this.fields) {
			if (this.fields[name] && this.fields[name].field && this.fields[name].type != "hidden" && !this.fields[name].getAttribute("readonly")) {
				this.fields[name].used = false;
				this.fields[name].val("");
			}
		}
	}
	this._submit = function(event, iN) {
		for(name in this.fields) {
			if(this.fields[name] && this.fields[name].field && fun(this.fields[name].val)) {
				this.fields[name].used = true;
				u.f.validate(this.fields[name]);
			}
		}
		if(!Object.keys(this.error_fields).length) {
			if(fun(this.preSubmitted)) {
				this.preSubmitted(iN);
			}
			if(fun(this.submitted)) {
				this.submitted(iN);
			}
			else {
				for(name in this.fields) {
					if(this.fields[name] && this.fields[name].default_value && fun(this.fields[name].val) && !this.fields[name].val()) {
						if(this.fields[name].nodeName.match(/^(input|textarea)$/i)) {
							this.fields[name].value = "";
						}
					}
				}
				this.DOMsubmit();
			}
		}
	}
	this._value = function(value) {
		if(value !== undefined) {
			this.value = value;
			if(value !== this.default_value) {
				u.rc(this, "default");
				if(this.pseudolabel) {
					u.as(this.pseudolabel, "display", "none");
				}
			}
			u.f.validate(this);
		}
		return (this.value != this.default_value) ? this.value : "";
	}
	this._value_radiobutton = function(value) {
		var i, option;
		if(value !== undefined) {
			for(i = 0; i < this.field._inputs.length; i++) {
				option = this.field._inputs[i];
				if(option.value == value || (option.value == "true" && value) || (option.value == "false" && value === false)) {
					option.checked = true;
					u.f.validate(this);
				}
				else {
					option.checked = false;
				}
			}
		}
		else {
			for(i = 0; i < this.field._inputs.length; i++) {
				option = this.field._inputs[i];
				if(option.checked) {
					return option.value;
				}
			}
		}
		return "";
	}
	this._value_checkbox = function(value) {
		if(value !== undefined) {
			if(value) {
				this.checked = true
				u.ac(this.field, "checked");
			}
			else {
				this.checked = false;
				u.rc(this.field, "checked");
			}
			u.f.validate(this);
		}
		else {
			if(this.checked) {
				return this.value;
			}
		}
		return "";
	}
	this._value_select = function(value) {
		if(value !== undefined) {
			var i, option;
			for(i = 0; i < this.options.length; i++) {
				option = this.options[i];
				if(option.value == value) {
					this.selectedIndex = i;
					u.f.validate(this);
					return i;
				}
			}
			if (value === "") {
				this.selectedIndex = -1;
				u.f.validate(this);
				return -1;
			}
			return false;
		}
		else {
			return (this.selectedIndex >= 0 && this.default_value != this.options[this.selectedIndex].value) ? this.options[this.selectedIndex].value : "";
		}
	}
	this._value_file = function(value) {
		if(value !== undefined) {
			this.value = value;
			if (value === "") {
				this.value = null;
			}
		}
		else {
			if(this.value && this.files && this.files.length) {
				var i, file, files = [];
				for(i = 0; i < this.files.length; i++) {
					file = this.files[i];
					files.push(file);
				}
				return files;
			}
			else if(this.value) {
				return this.value;
			}
			else if(u.hc(this, "uploaded")){
				return true;
			}
			return "";
		}
	}
	this.inputOnEnter = function(node) {
		node.keyPressed = function(event) {
			if(this.nodeName.match(/input/i) && (event.keyCode == 40 || event.keyCode == 38)) {
				this._submit_disabled = true;
			}
			else if(this.nodeName.match(/input/i) && this._submit_disabled && (
				event.keyCode == 46 || 
				(event.keyCode == 39 && u.browser("firefox")) || 
				(event.keyCode == 37 && u.browser("firefox")) || 
				event.keyCode == 27 || 
				event.keyCode == 13 || 
				event.keyCode == 9 ||
				event.keyCode == 8
			)) {
				this._submit_disabled = false;
			}
			else if(event.keyCode == 13 && !this._submit_disabled) {
				u.e.kill(event);
				this.blur();
				this._form.submitInput = this;
				this._form.submitButton = false;
				this._form.submit(event, this);
			}
		}
		u.e.addEvent(node, "keydown", node.keyPressed);
	}
	this.buttonOnEnter = function(node) {
		node.keyPressed = function(event) {
			if(event.keyCode == 13 && !u.hc(this, "disabled") && fun(this.clicked)) {
				u.e.kill(event);
				this.clicked(event);
			}
		}
		u.e.addEvent(node, "keydown", node.keyPressed);
	}
	this._changed = function(event) {
		this.used = true;
		if(fun(this.changed)) {
			this.changed(this);
		}
		else if(this.field._input && fun(this.field._input.changed)) {
			this.field._input.changed(this);
		}
		if(fun(this.field.changed)) {
			this.field.changed(this);
		}
		if(fun(this._form.changed)) {
			this._form.changed(this);
		}
	}
	this._updated = function(event) {
		if(event.keyCode != 9 && event.keyCode != 13 && event.keyCode != 16 && event.keyCode != 17 && event.keyCode != 18) {
			if(this.used || u.hc(this.field, "error")) {
				u.f.validate(this);
			}
			if(fun(this.updated)) {
				this.updated(this);
			}
			else if(this.field._input && fun(this.field._input.updated)) {
				this.field._input.updated(this);
			}
			if(fun(this.field.updated)) {
				this.field.updated(this);
			}
			if(fun(this._form.updated)) {
				this._form.updated(this);
			}
		}
	}
	this._update_checkbox_field = function(event) {
		if(this.checked) {
			u.ac(this.field, "checked");
		}
		else {
			u.rc(this.field, "checked");
		}
	}
	this._validate = function(event) {
		u.f.validate(this);
	}
	this._mouseenter = function(event) {
		u.ac(this.field, "hover");
		u.ac(this, "hover");
		u.as(this.field, "zIndex", this.field._input._form._hover_z_index);
		u.f.positionHint(this.field);
	}
	this._mouseleave = function(event) {
		u.rc(this.field, "hover");
		u.rc(this, "hover");
		u.as(this.field, "zIndex", this.field._base_z_index);
		u.f.positionHint(this.field);
	}
	this._focus = function(event) {
		this.field.is_focused = true;
		this.is_focused = true;
		u.ac(this.field, "focus");
		u.ac(this, "focus");
		u.as(this.field, "zIndex", this._form._focus_z_index);
		u.f.positionHint(this.field);
		if(fun(this.focused)) {
			this.focused();
		}
		else if(this.field._input && fun(this.field._input.focused)) {
			this.field._input.focused(this);
		}
		if(fun(this._form.focused)) {
			this._form.focused(this);
		}
	}
	this._blur = function(event) {
		this.field.is_focused = false;
		this.is_focused = false;
		u.rc(this.field, "focus");
		u.rc(this, "focus");
		u.as(this.field, "zIndex", this.field._base_z_index);
		u.f.positionHint(this.field);
		this.used = true;
		if(fun(this.blurred)) {
			this.blurred();
		}
		else if(this.field._input && fun(this.field._input.blurred)) {
			this.field._input.blurred(this);
		}
		if(fun(this._form.blurred)) {
			this._form.blurred(this);
		}
	}
	this._button_focus = function(event) {
		u.ac(this, "focus");
		if(fun(this.focused)) {
			this.focused();
		}
		if(fun(this._form.focused)) {
			this._form.focused(this);
		}
	}
	this._button_blur = function(event) {
		u.rc(this, "focus");
		if(fun(this.blurred)) {
			this.blurred();
		}
		if(fun(this._form.blurred)) {
			this._form.blurred(this);
		}
	}
	this._changed_state = function() {
		u.f.updateDefaultState(this);
	}
	this.positionHint = function(field) {
		if(field._help) {
			var custom_hint_position;
			for(custom_hint_position in this.customHintPosition) {
				if(u.hc(field, custom_hint_position)) {
					this.customHintPosition[custom_hint_position](field._form, field);
					return;
				}
			}
			var input_middle, help_top;
 			if(u.hc(field, "html")) {
				input_middle = field._editor.offsetTop + (field._editor.offsetHeight / 2);
			}
			else {
				input_middle = field._input.offsetTop + (field._input.offsetHeight / 2);
			}
			help_top = input_middle - field._help.offsetHeight / 2;
			u.as(field._help, "top", help_top + "px");
		}
	}
	this.activateInput = function(iN) {
		u.e.addEvent(iN, "focus", this._focus);
		u.e.addEvent(iN, "blur", this._blur);
		if(u.e.event_pref == "mouse") {
			u.e.addEvent(iN, "mouseenter", this._mouseenter);
			u.e.addEvent(iN, "mouseleave", this._mouseleave);
		}
		u.e.addEvent(iN, "blur", this._validate);
		if(iN._form.labelstyle == "inject") {
			if(!iN.type || !iN.type.match(/file|radio|checkbox/)) {
				iN.default_value = u.text(iN._label);
				u.e.addEvent(iN, "focus", this._changed_state);
				u.e.addEvent(iN, "blur", this._changed_state);
				if(iN.type.match(/number|integer/)) {
					iN.pseudolabel = u.ae(iN.parentNode, "span", {"class":"pseudolabel", "html":iN.default_value});
					iN.pseudolabel.iN = iN;
					u.as(iN.pseudolabel, "top", iN.offsetTop+"px");
					u.as(iN.pseudolabel, "left", iN.offsetLeft+"px");
					u.ce(iN.pseudolabel)
					iN.pseudolabel.inputStarted = function(event) {
						u.e.kill(event);
						this.iN.focus();
					}
				}
				u.f.updateDefaultState(iN);
			}
		}
		else {
			iN.default_value = "";
		}
	}
	this.activateButton = function(action) {
		if(action.type && action.type == "submit" || action.type == "reset") {
			action.onclick = function(event) {
				u.e.kill(event ? event : window.event);
			}
		}
		u.ce(action);
		if(!action.clicked) {
			action.clicked = function(event) {
				u.e.kill(event);
				if(!u.hc(this, "disabled")) {
					if(this.type && this.type.match(/submit/i)) {
						this._form._submit_button = this;
						this._form._submit_input = false;
						this._form.submit(event, this);
					}
					else if (this.type && this.type.match(/reset/i)) {
						this._form._submit_button = false;
						this._form._submit_input = false;
						this._form.reset(event, this);
					}
					else {
						location.href = this.url;
					}
				}
			}
		}
		this.buttonOnEnter(action);
		var action_name = action.name ? action.name : action.parentNode.className;
		if(action_name) {
			action._form.actions[action_name] = action;
		}
		if(obj(u.k) && u.hc(action, "key:[a-z0-9]+")) {
			u.k.addKey(action, u.cv(action, "key"));
		}
		u.e.addEvent(action, "focus", this._button_focus);
		u.e.addEvent(action, "blur", this._button_blur);
	}
	this.updateDefaultState = function(iN) {
		if(iN.is_focused || iN.val() !== "") {
			u.rc(iN, "default");
			if(iN.val() === "") {
				iN.val("");
			}
			if(iN.pseudolabel) {
				u.as(iN.pseudolabel, "display", "none");
			}
		}
		else {
			if(iN.val() === "") {
				u.ac(iN, "default");
				if(iN.pseudolabel) {
					iN.val(iN.default_value);
					u.as(iN.pseudolabel, "display", "block");
				}
				else {
					iN.val(iN.default_value);
				}
			}
		}
	}
	this.fieldError = function(iN) {
		u.rc(iN, "correct");
		u.rc(iN.field, "correct");
		if(iN.used || iN.val() !== "") {
			u.ac(iN, "error");
			u.ac(iN.field, "error");
			this.positionHint(iN.field);
			iN._form.error_fields[iN.name] = true;
			this.updateFormValidationState(iN);
		}
	}
	this.fieldCorrect = function(iN) {
		if(iN.val() !== "") {
			u.ac(iN, "correct");
			u.ac(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
		else {
			u.rc(iN, "correct");
			u.rc(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
		delete iN._form.error_fields[iN.name];
		this.updateFormValidationState(iN);
	}
	this.checkFormValidation = function(form) {
		if(Object.keys(form.error_fields).length) {
			return false;
		}
		var x, field;
		for(x in form.fields) {
			input = form.fields[x];
			if(input.field && u.hc(form.fields[x].field, "required") && !u.hc(form.fields[x].field, "correct")) {
				return false;
			}
		}
		return true;
	}
	this.updateFormValidationState = function(iN) {
		if(this.checkFormValidation(iN._form)) {
			if(fun(iN.validationPassed)) {
				iN.validationPassed();
			}
			if(fun(iN.field.validationPassed)) {
				iN.field.validationPassed();
			}
			if(fun(iN._form.validationPassed)) {
				iN._form.validationPassed();
			}
			return true;
		}
		else {
			if(fun(iN.validationFailed)) {
				iN.validationFailed(iN._form.error_fields);
			}
			if(fun(iN.field.validationFailed)) {
				iN.field.validationFailed(iN._form.error_fields);
			}
			if(fun(iN._form.validationFailed)) {
				iN._form.validationFailed(iN._form.error_fields);
			}
			return false;
		}
	}
	this.validate = function(iN) {
		if(!iN._form._validation || !iN.field) {
			return true;
		}
		var min, max, pattern, compare_to;
		var validated = false;
		if(!u.hc(iN.field, "required") && iN.val() === "") {
			this.fieldCorrect(iN);
			return true;
		}
		else if(u.hc(iN.field, "required") && iN.val() === "") {
			this.fieldError(iN);
			return false;
		}
		var custom_validate;
		for(custom_validate in u.f.customValidate) {
			if(u.hc(iN.field, custom_validate)) {
				u.f.customValidate[custom_validate](iN);
				validated = true;
			}
		}
		if(!validated) {
			if(u.hc(iN.field, "password")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 8;
				max = max ? max : 255;
				pattern = iN.getAttribute("pattern");
				compare_to = iN.getAttribute("data-compare-to");
				if(
					iN.val().length >= min && 
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$")) &&
					(!compare_to || iN.val() == iN._form.fields[compare_to].val())
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "number")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 0;
				max = max ? max : 99999999999999999999999999999;
				pattern = iN.getAttribute("pattern");
				if(
					!isNaN(iN.val()) && 
					iN.val() >= min && 
					iN.val() <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "integer")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 0;
				max = max ? max : 99999999999999999999999999999;
				pattern = iN.getAttribute("pattern");
				if(
					!isNaN(iN.val()) && 
					Math.round(iN.val()) == iN.val() && 
					iN.val() >= min && 
					iN.val() <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "tel")) {
				pattern = iN.getAttribute("pattern");
				compare_to = iN.getAttribute("data-compare-to");
				if(
					(
						!pattern && iN.val().match(/^([\+0-9\-\.\s\(\)]){5,18}$/)
						||
						(pattern && iN.val().match("^"+pattern+"$"))
					)
					&&
					(!compare_to || iN.val() == iN._form.fields[compare_to].val())
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "email")) {
				compare_to = iN.getAttribute("data-compare-to");
				pattern = iN.getAttribute("pattern");
				if(
					(
						!pattern && iN.val().match(/^([^<>\\\/%$])+\@([^<>\\\/%$])+\.([^<>\\\/%$]{2,20})$/)
						 ||
						(pattern && iN.val().match("^"+pattern+"$"))
					)
					&&
					(!compare_to || iN.val() == iN._form.fields[compare_to].val())
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "text")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 1;
				max = max ? max : 10000000;
				pattern = iN.getAttribute("pattern");
				if(
					iN.val().length >= min && 
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "date")) {
				pattern = iN.getAttribute("pattern");
				if(
					!pattern && iN.val().match(/^([\d]{4}[\-\/\ ]{1}[\d]{2}[\-\/\ ][\d]{2})$/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "datetime")) {
				pattern = iN.getAttribute("pattern");
				if(
					!pattern && iN.val().match(/^([\d]{4}[\-\/\ ]{1}[\d]{2}[\-\/\ ][\d]{2} [\d]{2}[\-\/\ \:]{1}[\d]{2}[\-\/\ \:]{0,1}[\d]{0,2})$/) ||
					(pattern && iN.val().match(pattern))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "files")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 1;
				max = max ? max : 10000000;
				if(
					u.hc(iN, "uploaded") ||
					(iN.val().length >= min && 
					iN.val().length <= max)
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "select")) {
				if(iN.val() !== "") {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "checkbox|boolean|radiobuttons")) {
				if(iN.val() !== "") {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "string")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 1;
				max = max ? max : 255;
				pattern = iN.getAttribute("pattern");
				if(
					iN.val().length >= min &&
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "tags")) {
				if(
					!pattern && iN.val().match(/\:/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "prices")) {
				if(
					!isNaN(iN.val())
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
		}
		if(u.hc(iN.field, "error")) {
			return false;
		}
		else {
			return true;
		}
	}
}
u.f.getParams = function(_form, _options) {
	var send_as = "params";
	var ignore_inputs = "ignoreinput";
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "ignore_inputs"    : ignore_inputs     = _options[_argument]; break;
				case "send_as"          : send_as           = _options[_argument]; break;
			}
		}
	}
	var i, input, select, textarea, param, params;
	if(send_as == "formdata" && (fun(window.FormData) || obj(window.FormData))) {
		params = new FormData();
	}
	else {
		if(send_as == "formdata") {
			send_as == "params";
		}
		params = new Object();
		params.append = function(name, value, filename) {
			this[name] = value;
		}
	}
	if(_form._submit_button && _form._submit_button.name) {
		params.append(_form._submit_button.name, _form._submit_button.value);
	}
	var inputs = u.qsa("input", _form);
	var selects = u.qsa("select", _form)
	var textareas = u.qsa("textarea", _form)
	for(i = 0; i < inputs.length; i++) {
		input = inputs[i];
		if(!u.hc(input, ignore_inputs)) {
			if((input.type == "checkbox" || input.type == "radio") && input.checked) {
				if(fun(input.val)) {
					params.append(input.name, input.val());
				}
				else {
					params.append(input.name, input.value);
				}
			}
			else if(input.type == "file") {
				var f, file, files;
				if(fun(input.val)) {
					files = input.val();
				}
				else {
					files = input.value;
				}
				if(files) {
					for(f = 0; i < files.length; f++) {
						file = files[f];
						params.append(input.name, file, file.name);
					}
				}
				else {
					params.append(input.name, "");
				}
			}
			else if(!input.type.match(/button|submit|reset|file|checkbox|radio/i)) {
				if(fun(input.val)) {
					params.append(input.name, input.val());
				}
				else {
					params.append(input.name, input.value);
				}
			}
		}
	}
	for(i = 0; i < selects.length; i++) {
		select = selects[i];
		if(!u.hc(select, ignore_inputs)) {
			if(fun(select.val)) {
				params.append(select.name, select.val());
			}
			else {
				params.append(select.name, select.options[select.selectedIndex].value);
			}
		}
	}
	for(i = 0; i < textareas.length; i++) {
		textarea = textareas[i];
		if(!u.hc(textarea, ignore_inputs)) {
			if(fun(textarea.val)) {
				params.append(textarea.name, textarea.val());
			}
			else {
				params.append(textarea.name, textarea.value);
			}
		}
	}
	if(send_as && fun(this.customSend[send_as])) {
		return this.customSend[send_as](params, _form);
	}
	else if(send_as == "json") {
		return u.f.convertNamesToJsonObject(params);
	}
	else if(send_as == "formdata") {
		return params;
	}
	else if(send_as == "object") {
		delete params.append;
		return params;
	}
	else {
		var string = "";
		for(param in params) {
			if(!fun(params[param])) {
				string += (string ? "&" : "") + param + "=" + encodeURIComponent(params[param]);
			}
		}
		return string;
	}
}
u.f.convertNamesToJsonObject = function(params) {
 	var indexes, root, indexes_exsists, param;
	var object = new Object();
	for(param in params) {
	 	indexes_exsists = param.match(/\[/);
		if(indexes_exsists) {
			root = param.split("[")[0];
			indexes = param.replace(root, "");
			if(typeof(object[root]) == "undefined") {
				object[root] = new Object();
			}
			object[root] = this.recurseName(object[root], indexes, params[param]);
		}
		else {
			object[param] = params[param];
		}
	}
	return object;
}
u.f.recurseName = function(object, indexes, value) {
	var index = indexes.match(/\[([a-zA-Z0-9\-\_]+)\]/);
	var current_index = index[1];
	indexes = indexes.replace(index[0], "");
 	if(indexes.match(/\[/)) {
		if(object.length !== undefined) {
			var i;
			var added = false;
			for(i = 0; i < object.length; i++) {
				for(exsiting_index in object[i]) {
					if(exsiting_index == current_index) {
						object[i][exsiting_index] = this.recurseName(object[i][exsiting_index], indexes, value);
						added = true;
					}
				}
			}
			if(!added) {
				temp = new Object();
				temp[current_index] = new Object();
				temp[current_index] = this.recurseName(temp[current_index], indexes, value);
				object.push(temp);
			}
		}
		else if(typeof(object[current_index]) != "undefined") {
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
		else {
			object[current_index] = new Object();
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
	}
	else {
		object[current_index] = value;
	}
	return object;
}
u.f.customBuild = {};
u.f.addForm = function(node, _options) {
	var form_name = "js_form";
	var form_action = "#";
	var form_method = "post";
	var form_class = "";
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "name"			: form_name				= _options[_argument]; break;
				case "action"		: form_action			= _options[_argument]; break;
				case "method"		: form_method			= _options[_argument]; break;
				case "class"		: form_class			= _options[_argument]; break;
			}
		}
	}
	var form = u.ae(node, "form", {"class":form_class, "name": form_name, "action":form_action, "method":form_method});
	return form;
}
u.f.addFieldset = function(node, _options) {
	var fieldset_class = "";
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "class"			: fieldset_class			= _options[_argument]; break;
			}
		}
	}
	return u.ae(node, "fieldset", {"class":fieldset_class});
}
u.f.addField = function(node, _options) {
	var field_name = "js_name";
	var field_label = "Label";
	var field_type = "string";
	var field_value = "";
	var field_options = [];
	var field_checked = false;
	var field_class = "";
	var field_id = "";
	var field_max = false;
	var field_min = false;
	var field_disabled = false;
	var field_readonly = false;
	var field_required = false;
	var field_pattern = false;
	var field_error_message = "There is an error in your input";
	var field_hint_message = "";
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "name"					: field_name			= _options[_argument]; break;
				case "label"				: field_label			= _options[_argument]; break;
				case "type"					: field_type			= _options[_argument]; break;
				case "value"				: field_value			= _options[_argument]; break;
				case "options"				: field_options			= _options[_argument]; break;
				case "checked"				: field_checked			= _options[_argument]; break;
				case "class"				: field_class			= _options[_argument]; break;
				case "id"					: field_id				= _options[_argument]; break;
				case "max"					: field_max				= _options[_argument]; break;
				case "min"					: field_min				= _options[_argument]; break;
				case "disabled"				: field_disabled		= _options[_argument]; break;
				case "readonly"				: field_readonly		= _options[_argument]; break;
				case "required"				: field_required		= _options[_argument]; break;
				case "pattern"				: field_pattern			= _options[_argument]; break;
				case "error_message"		: field_error_message	= _options[_argument]; break;
				case "hint_message"			: field_hint_message	= _options[_argument]; break;
			}
		}
	}
	var custom_build;
	if(field_type in u.f.customBuild) {
		return u.f.customBuild[field_type](node, _options);
	}
	field_id = field_id ? field_id : "input_"+field_type+"_"+field_name;
	field_disabled = !field_disabled ? (field_class.match(/(^| )disabled( |$)/) ? "disabled" : false) : "disabled";
	field_readonly = !field_readonly ? (field_class.match(/(^| )readonly( |$)/) ? "readonly" : false) : "readonly";
	field_required = !field_required ? (field_class.match(/(^| )required( |$)/) ? true : false) : true;
	field_class += field_disabled ? (!field_class.match(/(^| )disabled( |$)/) ? " disabled" : "") : "";
	field_class += field_readonly ? (!field_class.match(/(^| )readonly( |$)/) ? " readonly" : "") : "";
	field_class += field_required ? (!field_class.match(/(^| )required( |$)/) ? " required" : "") : "";
	field_class += field_min ? (!field_class.match(/(^| )min:[0-9]+( |$)/) ? " min:"+field_min : "") : "";
	field_class += field_max ? (!field_class.match(/(^| )max:[0-9]+( |$)/) ? " max:"+field_max : "") : "";
	if (field_type == "hidden") {
		return u.ae(node, "input", {"type":"hidden", "name":field_name, "value":field_value, "id":field_id});
	}
	var field = u.ae(node, "div", {"class":"field "+field_type+" "+field_class});
	var attributes = {};
	if(field_type == "string") {
		field_max = field_max ? field_max : 255;
		attributes = {
			"type":"text", 
			"id":field_id, 
			"value":field_value, 
			"name":field_name, 
			"maxlength":field_max, 
			"minlength":field_min,
			"pattern":field_pattern,
			"readonly":field_readonly,
			"disabled":field_disabled
		};
		u.ae(field, "label", {"for":field_id, "html":field_label});
		u.ae(field, "input", u.f.verifyAttributes(attributes));
	}
	else if(field_type == "email" || field_type == "tel" || field_type == "password") {
		field_max = field_max ? field_max : 255;
		attributes = {
			"type":field_type, 
			"id":field_id, 
			"value":field_value, 
			"name":field_name, 
			"maxlength":field_max, 
			"minlength":field_min,
			"pattern":field_pattern,
			"readonly":field_readonly,
			"disabled":field_disabled
		};
		u.ae(field, "label", {"for":field_id, "html":field_label});
		u.ae(field, "input", u.f.verifyAttributes(attributes));
	}
	else if(field_type == "number" || field_type == "integer" || field_type == "date" || field_type == "datetime") {
		attributes = {
			"type":field_type, 
			"id":field_id, 
			"value":field_value, 
			"name":field_name, 
			"max":field_max, 
			"min":field_min,
			"pattern":field_pattern,
			"readonly":field_readonly,
			"disabled":field_disabled
		};
		u.ae(field, "label", {"for":field_id, "html":field_label});
		u.ae(field, "input", u.f.verifyAttributes(attributes));
	}
	else if(field_type == "checkbox") {
		attributes = {
			"type":field_type, 
			"id":field_id, 
			"value":field_value ? field_value : "true", 
			"name":field_name, 
			"disabled":field_disabled,
			"checked":field_checked
		};
		u.ae(field, "input", {"name":field_name, "value":"false", "type":"hidden"});
		u.ae(field, "input", u.f.verifyAttributes(attributes));
		u.ae(field, "label", {"for":field_id, "html":field_label});
	}
	else if(field_type == "text") {
		attributes = {
			"id":field_id, 
			"html":field_value, 
			"name":field_name, 
			"maxlength":field_max, 
			"minlength":field_min,
			"pattern":field_pattern,
			"readonly":field_readonly,
			"disabled":field_disabled
		};
		u.ae(field, "label", {"for":field_id, "html":field_label});
		u.ae(field, "textarea", u.f.verifyAttributes(attributes));
	}
	else if(field_type == "select") {
		attributes = {
			"id":field_id, 
			"name":field_name, 
			"disabled":field_disabled
		};
		u.ae(field, "label", {"for":field_id, "html":field_label});
		var select = u.ae(field, "select", u.f.verifyAttributes(attributes));
		if(field_options) {
			var i, option;
			for(i = 0; i < field_options.length; i++) {
				option = field_options[i];
				if(option.value == field_value) {
					u.ae(select, "option", {"value":option.value, "html":option.text, "selected":"selected"});
				}
				else {
					u.ae(select, "option", {"value":option.value, "html":option.text});
				}
			}
		}
	}
	else if(field_type == "radiobuttons") {
		u.ae(field, "label", {"html":field_label});
		if(field_options) {
			var i, option;
			for(i = 0; i < field_options.length; i++) {
				option = field_options[i];
				var div = u.ae(field, "div", {"class":"item"});
				if(option.value == field_value) {
					u.ae(div, "input", {"value":option.value, "id":field_id+"-"+i, "type":"radio", "name":field_name, "checked":"checked"});
					u.ae(div, "label", {"for":field_id+"-"+i, "html":option.text});
				}
				else {
					u.ae(div, "input", {"value":option.value, "id":field_id+"-"+i, "type":"radio", "name":field_name});
					u.ae(div, "label", {"for":field_id+"-"+i, "html":option.text});
				}
			}
		}
	}
	else if(field_type == "files") {
		u.ae(field, "label", {"for":field_id, "html":field_label});
		u.ae(field, "input", {"id":field_id, "name":field_name, "type":"file"});
	}
	else {
		u.bug("input type not implemented")
	}
	if(field_hint_message || field_error_message) {
		var help = u.ae(field, "div", {"class":"help"});
		if (field_hint_message) {
			u.ae(help, "div", { "class": "hint", "html": field_hint_message });
		}
		if(field_error_message) {
			u.ae(help, "div", { "class": "error", "html": field_error_message });
		}
	}
	return field;
}
u.f.verifyAttributes = function(attributes) {
	for(attribute in attributes) {
		if(attributes[attribute] === undefined || attributes[attribute] === false || attributes[attribute] === null) {
			delete attributes[attribute];
		}
	}
	return attributes;
}
u.f.addAction = function(node, _options) {
	var action_type = "submit";
	var action_name = "js_name";
	var action_value = "";
	var action_class = "";
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "type"			: action_type			= _options[_argument]; break;
				case "name"			: action_name			= _options[_argument]; break;
				case "value"		: action_value			= _options[_argument]; break;
				case "class"		: action_class			= _options[_argument]; break;
			}
		}
	}
	var p_ul = node.nodeName.toLowerCase() == "ul" ? node : u.pn(node, {"include":"ul.actions"});
	if(!p_ul || !u.hc(p_ul, "actions")) {
		if(node.nodeName.toLowerCase() == "form") {
			p_ul = u.qs("ul.actions", node);
		}
		p_ul = p_ul ? p_ul : u.ae(node, "ul", {"class":"actions"});
	}
	var p_li = node.nodeName.toLowerCase() == "li" ? node : u.pn(node, {"include":"li"});
	if(!p_li || p_ul != p_li.parentNode) {
		p_li = u.ae(p_ul, "li", {"class":action_name});
	}
	else {
		p_li = node;
	}
	var action = u.ae(p_li, "input", {"type":action_type, "class":action_class, "value":action_value, "name":action_name})
	return action;
}
Util.absoluteX = u.absX = function(node) {
	if(node.offsetParent) {
		return node.offsetLeft + u.absX(node.offsetParent);
	}
	return node.offsetLeft;
}
Util.absoluteY = u.absY = function(node) {
	if(node.offsetParent) {
		return node.offsetTop + u.absY(node.offsetParent);
	}
	return node.offsetTop;
}
Util.relativeX = u.relX = function(node) {
	if(u.gcs(node, "position").match(/absolute/) == null && node.offsetParent && u.gcs(node.offsetParent, "position").match(/relative|absolute|fixed/) == null) {
		return node.offsetLeft + u.relX(node.offsetParent);
	}
	return node.offsetLeft;
}
Util.relativeY = u.relY = function(node) {
	if(u.gcs(node, "position").match(/absolute/) == null && node.offsetParent && u.gcs(node.offsetParent, "position").match(/relative|absolute|fixed/) == null) {
		return node.offsetTop + u.relY(node.offsetParent);
	}
	return node.offsetTop;
}
Util.actualWidth = u.actualW = function(node) {
	return parseInt(u.gcs(node, "width"));
}
Util.actualHeight = u.actualH = function(node) {
	return parseInt(u.gcs(node, "height"));
}
Util.eventX = function(event){
	return (event.targetTouches && event.targetTouches.length ? event.targetTouches[0].pageX : event.pageX);
}
Util.eventY = function(event){
	return (event.targetTouches && event.targetTouches.length ? event.targetTouches[0].pageY : event.pageY);
}
Util.browserWidth = u.browserW = function() {
	return document.documentElement.clientWidth;
}
Util.browserHeight = u.browserH = function() {
	return document.documentElement.clientHeight;
}
Util.htmlWidth = u.htmlW = function() {
	return document.body.offsetWidth + parseInt(u.gcs(document.body, "margin-left")) + parseInt(u.gcs(document.body, "margin-right"));
}
Util.htmlHeight = u.htmlH = function() {
	return document.body.offsetHeight + parseInt(u.gcs(document.body, "margin-top")) + parseInt(u.gcs(document.body, "margin-bottom"));
}
Util.pageScrollX = u.scrollX = function() {
	return window.pageXOffset;
}
Util.pageScrollY = u.scrollY = function() {
	return window.pageYOffset;
}
Util.History = u.h = new function() {
	this.popstate = ("onpopstate" in window);
	this.callbacks = [];
	this.is_listening = false;
	this.navigate = function(url, node, silent) {
		silent = silent || false;
		if(this.popstate) {
			history.pushState({}, url, url);
			if(!silent) {
				this.callback(url);
			}
		}
		else {
			if(silent) {
				this.next_hash_is_silent = true;
			}
			location.hash = u.h.getCleanUrl(url);
		}
	}
	this.callback = function(url) {
		var i, recipient;
		for(i = 0; i < this.callbacks.length; i++) {
			recipient = this.callbacks[i];
			if(fun(recipient.node[recipient.callback])) {
				recipient.node[recipient.callback](url);
			}
		}
	}
	this.removeEvent = function(node, _options) {
		var callback_urlchange = "navigate";
		if(obj(_options)) {
			var argument;
			for(argument in _options) {
				switch(argument) {
					case "callback"		: callback_urlchange		= _options[argument]; break;
				}
			}
		}
		var i, recipient;
		for(i = 0; recipient = this.callbacks[i]; i++) {
			if(recipient.node == node && recipient.callback == callback_urlchange) {
				this.callbacks.splice(i, 1);
				break;
			}
		}
	}
	this.addEvent = function(node, _options) {
		var callback_urlchange = "navigate";
		if(obj(_options)) {
			var argument;
			for(argument in _options) {
				switch(argument) {
					case "callback"		: callback_urlchange		= _options[argument]; break;
				}
			}
		}
		if(!this.is_listening) {
			this.is_listening = true;
			if(this.popstate) {
				u.e.addEvent(window, "popstate", this._urlChanged);
			}
			else if("onhashchange" in window && !u.browser("explorer", "<=7")) {
				u.e.addEvent(window, "hashchange", this._hashChanged);
			}
			else {
				u.h._current_hash = window.location.hash;
				window.onhashchange = this._hashChanged;
				setInterval(
					function() {
						if(window.location.hash !== u.h._current_hash) {
							u.h._current_hash = window.location.hash;
							window.onhashchange();
						}
					}, 200
				);
			}
		}
		this.callbacks.push({"node":node, "callback":callback_urlchange});
	}
	this._urlChanged = function(event) {
		var url = u.h.getCleanUrl(location.href);
		if(event.state || (!event.state && event.path)) {
			u.h.callback(url);
		}
		else {
			history.replaceState({}, url, url);
		}
	}
	this._hashChanged = function(event) {
		if(!location.hash || !location.hash.match(/^#\//)) {
			location.hash = "#/"
			return;
		}
		var url = u.h.getCleanHash(location.hash);
		if(u.h.next_hash_is_silent) {
			delete u.h.next_hash_is_silent;
		}
		else {
			u.h.callback(url);
		}
	}
	this.trail = [];
	this.addToTrail = function(url, node) {
		this.trail.push({"url":url, "node":node});
	}
	this.getCleanUrl = function(string, levels) {
		string = string.replace(location.protocol+"//"+document.domain, "").match(/[^#$]+/)[0];
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var path = string.split("/");
			levels = levels > path.length-1 ? path.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + path[i];
			}
			return return_string;
		}
	}
	this.getCleanHash = function(string, levels) {
		string = string.replace("#", "");
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var hash = string.split("/");
			levels = levels > hash.length-1 ? hash.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
	this.resolveCurrentUrl = function() {
		return !location.hash ? this.getCleanUrl(location.href) : this.getCleanHash(location.hash);
	}
}
Util.Objects = u.o = new Object();
Util.init = function(scope) {
	var i, node, nodes, object;
	scope = scope && scope.nodeName ? scope : document;
	nodes = u.ges("i\:([_a-zA-Z0-9])+", scope);
	for(i = 0; i < nodes.length; i++) {
		node = nodes[i];
		while((object = u.cv(node, "i"))) {
			u.rc(node, "i:"+object);
			if(object && obj(u.o[object])) {
				u.o[object].init(node);
			}
		}
	}
}
Util.Keyboard = u.k = new function() {
	this.shortcuts = {};
	this.onkeydownCatcher = function(event) {
		u.k.catchKey(event);
	}
	this.addKey = function(node, key, _options) {
		node.callback_keyboard = "clicked";
		node.metakey_required = true;
		if(obj(_options)) {
			var argument;
			for(argument in _options) {
				switch(argument) {
					case "callback"		: node.callback_keyboard	= _options[argument]; break;
					case "metakey"		: node.metakey_required		= _options[argument]; break;
				}
			}
		}
		if(!this.shortcuts.length) {
			u.e.addEvent(document, "keydown", this.onkeydownCatcher);
		}
		if(!this.shortcuts[key.toString().toUpperCase()]) {
			this.shortcuts[key.toString().toUpperCase()] = new Array();
		}
		this.shortcuts[key.toString().toUpperCase()].push(node);
	}
	this.catchKey = function(event) {
		event = event ? event : window.event;
		var key = String.fromCharCode(event.keyCode);
		if(event.keyCode == 27) {
			key = "ESC";
		}
		if(this.shortcuts[key]) {
			var nodes, node, i;
			nodes = this.shortcuts[key];
			for(i = 0; i < nodes.length; i++) {
				node = nodes[i];
				if(u.contains(document.body, node)) {
					if(node.offsetHeight && ((event.ctrlKey || event.metaKey) || (!node.metakey_required || key == "ESC"))) {
						u.e.kill(event);
						if(fun(node[node.callback_keyboard])) {
							node[node.callback_keyboard](event);
						}
					}
				}
				else {
					this.shortcuts[key].splice(i, 1);
					if(!this.shortcuts[key].length) {
						delete this.shortcuts[key];
						break;
					}
					else {
						i--;
					}
				}
			}
		}
	}
}
Util.random = function(min, max) {
	return Math.round((Math.random() * (max - min)) + min);
}
Util.numToHex = function(num) {
	return num.toString(16);
}
Util.hexToNum = function(hex) {
	return parseInt(hex,16);
}
Util.round = function(number, decimals) {
	var round_number = number*Math.pow(10, decimals);
	return Math.round(round_number)/Math.pow(10, decimals);
}
Util.audioPlayer = function(_options) {
	_options = _options || {};
	_options.type = "audio";
	return u.mediaPlayer(_options);
}
Util.videoPlayer = function(_options) {
	_options = _options || {};
	_options.type = "video";
	return u.mediaPlayer(_options);
}
Util.mediaPlayer = function(_options) {
	var player = document.createElement("div");
	player.type = _options && _options.type || "video";
	u.ac(player, player.type+"player");
	player._autoplay = false;
	player._muted = false;
	player._loop = false;
	player._playsinline = false;
	player._crossorigin = "anonymous";
	player._controls = false;
	player._controls_playpause = false;
	player._controls_play = false;
	player._controls_pause = false;
	player._controls_stop = false;
	player._controls_zoom = false;
	player._controls_volume = false;
	player._controls_search = false;
	player._ff_skip = 2;
	player._rw_skip = 2;
	player.media = u.ae(player, player.type);
	if(player.media && fun(player.media.play)) {
		player.load = function(src, _options) {
			if(u.hc(this, "playing")) {
				this.stop();
			}
			u.setupMedia(this, _options);
			if(src) {
				this.media.src = u.correctMediaSource(this, src);
				this.media.load();
			}
		}
		player.play = function(position) {
			if(this.media.currentTime && position !== undefined) {
				this.media.currentTime = position;
			}
			if(this.media.src) {
				return this.media.play();
			}
		}
		player.loadAndPlay = function(src, _options) {
			var position = 0;
			if(obj(_options)) {
				var _argument;
				for(_argument in _options) {
					switch(_argument) {
						case "position"		: position		= _options[_argument]; break;
					}
				}
			}
			this.load(src, _options);
			return this.play(position);
		}
		player.pause = function() {
			this.media.pause();
		}
		player.stop = function() {
			this.media.pause();
			if(this.media.currentTime) {
				this.media.currentTime = 0;
			}
		}
		player.ff = function() {
			if(this.media.src && this.media.currentTime && this.mediaLoaded) {
				this.media.currentTime = (this.media.duration - this.media.currentTime >= this._ff_skip) ? (this.media.currentTime + this._ff_skip) : this.media.duration;
				this.media._timeupdate();
			}
		}
		player.rw = function() {
			if(this.media.src && this.media.currentTime && this.mediaLoaded) {
				this.media.currentTime = (this.media.currentTime >= this._rw_skip) ? (this.media.currentTime - this._rw_skip) : 0;
				this.media._timeupdate();
			}
		}
		player.togglePlay = function() {
			if(u.hc(this, "playing")) {
				this.pause();
			}
			else {
				this.play();
			}
		}
		player.volume = function(value) {
			this.media.volume = value;
			if(value === 0) {
				u.ac(this, "muted");
			}
			else {
				u.rc(this, "muted");
			}
		}
		player.toggleSound = function() {
			if(this.media.volume) {
				this.media.volume = 0;
				u.ac(this, "muted");
			}
			else {
				this.media.volume = 1;
				u.rc(this, "muted");
			}
		}
		player.mute = function() {
			this.media.muted = true;
		}
		player.unmute = function() {
			this.media.removeAttribute(muted);
		}
	}
	else {
		player.load = function() {}
		player.play = function() {}
		player.loadAndPlay = function() {}
		player.pause = function() {}
		player.stop = function() {}
		player.ff = function() {}
		player.rw = function() {}
		player.togglePlay = function() {}
	}
	u.setupMedia(player, _options);
	u.detectMediaAutoplay(player);
	return player;
}
u.setupMedia = function(player, _options) {
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "autoplay"     : player._autoplay               = _options[_argument]; break;
				case "muted"        : player._muted                  = _options[_argument]; break;
				case "loop"         : player._loop                   = _options[_argument]; break;
				case "playsinline"  : player._playsinline            = _options[_argument]; break;
				case "controls"     : player._controls               = _options[_argument]; break;
				case "ff_skip"      : player._ff_skip                = _options[_argument]; break;
				case "rw_skip"      : player._rw_skip                = _options[_argument]; break;
			}
		}
	}
	player.media.autoplay = player._autoplay;
	player.media.loop = player._loop;
	player.media.muted = player._muted;
	player.media.playsinline = player._playsinline;
	player.media.setAttribute("playsinline", player._playsinline);
	player.media.setAttribute("crossorigin", player._crossorigin);
	u.setupMediaControls(player, player._controls);
	player.currentTime = 0;
	player.duration = 0;
	player.mediaLoaded = false;
	player.metaLoaded = false;
	if(!player.media.player) {
		player.media.player = player;
		player.media._loadstart = function(event) {
			u.ac(this.player, "loading");
			if(fun(this.player.loading)) {
				this.player.loading(event);
			}
		}
		u.e.addEvent(player.media, "loadstart", player.media._loadstart);
		player.media._canplaythrough = function(event) {
			u.rc(this.player, "loading");
			if(fun(this.player.canplaythrough)) {
				this.player.canplaythrough(event);
			}
		}
		u.e.addEvent(player.media, "canplaythrough", player.media._canplaythrough);
		player.media._playing = function(event) {
			u.rc(this.player, "loading|paused");
			u.ac(this.player, "playing");
			if(fun(this.player.playing)) {
				this.player.playing(event);
			}
		}
		u.e.addEvent(player.media, "playing", player.media._playing);
		player.media._paused = function(event) {
			u.rc(this.player, "playing|loading");
			u.ac(this.player, "paused");
			if(fun(this.player.paused)) {
				this.player.paused(event);
			}
		}
		u.e.addEvent(player.media, "pause", player.media._paused);
		player.media._stalled = function(event) {
			u.rc(this.player, "playing|paused");
			u.ac(this.player, "loading");
			if(fun(this.player.stalled)) {
				this.player.stalled(event);
			}
		}
		u.e.addEvent(player.media, "stalled", player.media._paused);
		player.media._error = function(event) {
			if(fun(this.player.error)) {
				this.player.error(event);
			}
		}
		u.e.addEvent(player.media, "error", player.media._error);
		player.media._ended = function(event) {
			u.rc(this.player, "playing|paused");
			if(fun(this.player.ended)) {
				this.player.ended(event);
			}
		}
		u.e.addEvent(player.media, "ended", player.media._ended);
		player.media._loadedmetadata = function(event) {
			this.player.duration = this.duration;
			this.player.currentTime = this.currentTime;
			this.player.metaLoaded = true;
			if(fun(this.player.loadedmetadata)) {
				this.player.loadedmetadata(event);
			}
		}
		u.e.addEvent(player.media, "loadedmetadata", player.media._loadedmetadata);
		player.media._loadeddata = function(event) {
			this.player.mediaLoaded = true;
			if(fun(this.player.loadeddata)) {
				this.player.loadeddata(event);
			}
		}
		u.e.addEvent(player.media, "loadeddata", player.media._loadeddata);
		player.media._timeupdate = function(event) {
			this.player.currentTime = this.currentTime;
			if(fun(this.player.timeupdate)) {
				this.player.timeupdate(event);
			}
		}
		u.e.addEvent(player.media, "timeupdate", player.media._timeupdate);
	}
}
u.correctMediaSource = function(player, src) {
	var param = src.match(/\?[^$]+/) ? src.match(/(\?[^$]+)/)[1] : "";
	src = src.replace(/\?[^$]+/, "");
	if(player.type == "video") {
		src = src.replace(/(\.m4v|\.mp4|\.webm|\.ogv|\.3gp|\.mov)$/, "");
		if(player.flash) {
			return src+".mp4"+param;
		}
		else if(player.media.canPlayType("video/mp4")) {
			return src+".mp4"+param;
		}
		else if(player.media.canPlayType("video/ogg")) {
			return src+".ogv"+param;
		}
		else if(player.media.canPlayType("video/3gpp")) {
			return src+".3gp"+param;
		}
		else {
			return src+".mov"+param;
		}
	}
	else {
		src = src.replace(/(.mp3|.ogg|.wav)$/, "");
		if(player.flash) {
			return src+".mp3"+param;
		}
		if(player.media.canPlayType("audio/mpeg")) {
			return src+".mp3"+param;
		}
		else if(player.media.canPlayType("audio/ogg")) {
			return src+".ogg"+param;
		}
		else {
			return src+".wav"+param;
		}
	}
}
u.setupMediaControls = function(player, _options) {
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "playpause"    : player._controls_playpause     = _options[_argument]; break;
				case "play"         : player._controls_play          = _options[_argument]; break;
				case "stop"         : player._controls_stop          = _options[_argument]; break;
				case "pause"        : player._controls_pause         = _options[_argument]; break;
				case "volume"       : player._controls_volume        = _options[_argument]; break;
				case "search"       : player._controls_search        = _options[_argument]; break;
			}
		}
	}
	player._custom_controls = obj(_options) && (
		player._controls_playpause ||
		player._controls_play ||
		player._controls_stop ||
		player._controls_pause ||
		player._controls_volume ||
		player._controls_search
	) || false;
	if(player._custom_controls || !_options) {
		player.media.removeAttribute("controls");
	}
	else {
		player.media.controls = player._controls;
	}
	if(!player._custom_controls && player.controls) {
		player.removeChild(player.controls);
		delete player.controls;
	}
	else if(player._custom_controls) {
		if(!player.controls) {
			player.controls = u.ae(player, "div", {"class":"controls"});
			player.controls.player = player;
			player.controls.out = function() {
				u.a.transition(this, "all 0.3s ease-out");
				u.ass(this, {
					"opacity":0
				});
			}
			player.controls.over = function() {
				u.a.transition(this, "all 0.5s ease-out");
				u.ass(this, {
					"opacity":1
				});
			}
			u.e.hover(player.controls);
		}
		if(player._controls_playpause) {
			if(!player.controls.playpause) {
				player.controls.playpause = u.ae(player.controls, "a", {"class":"playpause"});
				player.controls.playpause.player = player;
				u.e.click(player.controls.playpause);
				player.controls.playpause.clicked = function(event) {
					this.player.togglePlay();
				}
			}
		}
		else if(player.controls.playpause) {
			player.controls.playpause.parentNode.removeChild(player.controls.playpause);
			delete player.controls.playpause;
		}
		if(player._controls_play) {
			if(!player.controls.play) {
				player.controls.play = u.ae(player.controls, "a", {"class":"play"});
				player.controls.play.player = player;
				u.e.click(player.controls.play);
				player.controls.play.clicked = function(event) {
					this.player.togglePlay();
				}
			}
		}
		else if(player.controls.play) {
			player.controls.play.parentNode.removeChild(player.controls.play);
			delete player.controls.play;
		}
		if(player._controls_pause) {
			if(!player.controls.pause) {
				player.controls.pause = u.ae(player.controls, "a", {"class":"pause"});
				player.controls.pause.player = player;
				u.e.click(player.controls.pause);
				player.controls.pause.clicked = function(event) {
					this.player.togglePlay();
				}
			}
		}
		else if(player.controls.pause) {
			player.controls.pause.parentNode.removeChild(player.controls.pause);
			delete player.controls.pause;
		}
		if(player._controls_stop) {
			if(!player.controls.stop) {
				player.controls.stop = u.ae(player.controls, "a", {"class":"stop" });
				player.controls.stop.player = player;
				u.e.click(player.controls.stop);
				player.controls.stop.clicked = function(event) {
					this.player.stop();
				}
			}
		}
		else if(player.controls.stop) {
			player.controls.stop.parentNode.removeChild(player.controls.stop);
			delete player.controls.stop;
		}
		if(player._controls_search) {
			if(!player.controls.search) {
				player.controls.search_ff = u.ae(player.controls, "a", {"class":"ff"});
				player.controls.search_ff._default_display = u.gcs(player.controls.search_ff, "display");
				player.controls.search_ff.player = player;
				player.controls.search_rw = u.ae(player.controls, "a", {"class":"rw"});
				player.controls.search_rw._default_display = u.gcs(player.controls.search_rw, "display");
				player.controls.search_rw.player = player;
				u.e.click(player.controls.search_ff);
				player.controls.search_ff.ffing = function() {
					this.t_ffing = u.t.setTimer(this, this.ffing, 100);
					this.player.ff();
				}
				player.controls.search_ff.inputStarted = function(event) {
					this.ffing();
				}
				player.controls.search_ff.clicked = function(event) {
					u.t.resetTimer(this.t_ffing);
				}
				u.e.click(player.controls.search_rw);
				player.controls.search_rw.rwing = function() {
					this.t_rwing = u.t.setTimer(this, this.rwing, 100);
					this.player.rw();
				}
				player.controls.search_rw.inputStarted = function(event) {
					this.rwing();
				}
				player.controls.search_rw.clicked = function(event) {
					u.t.resetTimer(this.t_rwing);
					this.player.rw();
				}
				player.controls.search = true;
			}
			else {
				u.as(player.controls.search_ff, "display", player.controls.search_ff._default_display);
				u.as(player.controls.search_rw, "display", player.controls.search_rw._default_display);
			}
		}
		else if(player.controls.search) {
			u.as(player.controls.search_ff, "display", "none");
			u.as(player.controls.search_rw, "display", "none");
		}
		if(player._controls_zoom && !player.controls.zoom) {}
		else if(player.controls.zoom) {}
		if(player._controls_volume && !player.controls.volume) {}
		else if(player.controls.volume) {}
	}
}
u.detectMediaAutoplay = function(player) {
	if(!u.media_autoplay_detection) {
		u.media_autoplay_detection = [player];
		u.test_autoplay = document.createElement("video");
		u.test_autoplay.check = function() {
			if(u.media_can_autoplay !== undefined && u.media_can_autoplay_muted !== undefined) {
				for(var i = 0, player; i < u.media_autoplay_detection.length; i++) {
					player = u.media_autoplay_detection[i];
					player.can_autoplay = u.media_can_autoplay;
					player.can_autoplay_muted = u.media_can_autoplay_muted;
					if(fun(player.ready)) {
						player.ready();
					}
				}
				u.media_autoplay_detection = true;
				u.test_autoplay.pause();
				delete u.test_autoplay;
			}
		}
		u.test_autoplay.playing = function(event) {
			u.media_can_autoplay = true;
			u.media_can_autoplay_muted = true;
			this.check();
		}
		u.test_autoplay.notplaying = function() {
			u.media_can_autoplay = false;
			u.test_autoplay.muted = true;
			var promise = u.test_autoplay.play();
			if(promise && fun(promise.then)) {
				promise.then(
					function(){
						if(u.test_autoplay) {
							u.t.resetTimer(window.u.test_autoplay.t_check);
							u.test_autoplay.playing_muted();
						}
					}
				).catch(
					function() {
						if(u.test_autoplay) {
							u.t.resetTimer(window.u.test_autoplay.t_check)
							u.test_autoplay.notplaying_muted();
						}
					}
				);
				u.test_autoplay.t_check = u.t.setTimer(u.test_autoplay, function(){
					u.test_autoplay.pause();
				}, 1000);
			}
		}
		u.test_autoplay.playing_muted = function() {
			u.media_can_autoplay_muted = true;
			this.check();
		}
		u.test_autoplay.notplaying_muted = function() {
			u.media_can_autoplay_muted = false;
			this.check();
		}
		u.test_autoplay.error = function(event) {
			u.media_can_autoplay = false;
			u.media_can_autoplay_muted = false;
			this.check();
		}
		u.e.addEvent(u.test_autoplay, "playing", u.test_autoplay.playing);
		u.e.addEvent(u.test_autoplay, "error", u.test_autoplay.error);
		var data = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAxVtZGF0AAACoAYF//+c3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0xIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDM6MHgxMTMgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTEgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MyBiX3B5cmFtaWQ9MiBiX2FkYXB0PTEgYl9iaWFzPTAgZGlyZWN0PTEgd2VpZ2h0Yj0xIG9wZW5fZ29wPTAgd2VpZ2h0cD0yIGtleWludD0yNTAga2V5aW50X21pbj0yNSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAA9liIQAM//+9uy+BTYUyMEAAAAIQZoibEK//sAAAAAIAZ5BeQr/xIHeBAAAbGliZmFhYyAxLjI4AABCAJMgBDIARyEASZACGQAjgCEASZACGQAjgCEASZACGQAjgCEASZACGQAjgAAABS5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAeAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAACYHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAeAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAEAAAAAgAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAHgAAAQAAAEAAAAAAdhtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAADIAAAAGAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAGDbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAABQ3N0YmwAAACXc3RzZAAAAAAAAAABAAAAh2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAEAAIAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwFkAAr/4QAYZ2QACqzZX+XARAAAAwAEAAADAMg8SJZYAQAGaOvjyyLAAAAAGHN0dHMAAAAAAAAAAQAAAAMAAAIAAAAAFHN0c3MAAAAAAAAAAQAAAAEAAAAoY3R0cwAAAAAAAAADAAAAAQAABAAAAAABAAAGAAAAAAEAAAIAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAADAAAAAQAAACBzdHN6AAAAAAAAAAAAAAADAAACtwAAAAwAAAAMAAAAFHN0Y28AAAAAAAAAAQAAADAAAAH4dHJhawAAAFx0a2hkAAAAAwAAAAAAAAAAAAAAAgAAAAAAAAB1AAAAAAAAAAAAAAABAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAJGVkdHMAAAAcZWxzdAAAAAAAAAABAAAAdQAAAAAAAQAAAAABcG1kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAArEQAABQAVcQAAAAAAC1oZGxyAAAAAAAAAABzb3VuAAAAAAAAAAAAAAAAU291bmRIYW5kbGVyAAAAARttaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAN9zdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAIABICAgBRAFQAAAAAAFYgAABCwBYCAgAISEAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAAAFAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAABQAAAAEAAAAoc3RzegAAAAAAAAAAAAAABQAAABoAAAAJAAAACQAAAAkAAAAJAAAAFHN0Y28AAAAAAAAAAQAAAv8AAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal0b28AAAAdZGF0YQAAAAEAAAAATGF2ZjU2LjQwLjEwMQ==";
		u.test_autoplay.volume = 0.01;
		u.test_autoplay.autoplay = true;
		u.test_autoplay.playsinline = true;
		u.test_autoplay.setAttribute("playsinline", true);
		u.test_autoplay.src = data;
		var promise = u.test_autoplay.play();
		if(promise && fun(promise.then)) {
			u.e.removeEvent(u.test_autoplay, "playing", u.test_autoplay.playing);
			u.e.removeEvent(u.test_autoplay, "error", u.test_autoplay.error);
			promise.then(
				u.test_autoplay.playing.bind(u.test_autoplay)
			).catch(
				u.test_autoplay.notplaying.bind(u.test_autoplay)
			);
		}
	}
	else if(u.media_autoplay_detection !== true) {
		u.media_autoplay_detection.push(player);
	}
	else {
		u.t.setTimer(player, function() {
			this.can_autoplay = u.media_can_autoplay;
			this.can_autoplay_muted = u.media_can_autoplay_muted;
			if(fun(this.ready)){
				this.ready();
			}
		}, 20);
	}
}
u.navigation = function(_options) {
	var navigation_node = page;
	var callback_navigate = "_navigate";
	var initialization_scope = page.cN;
	if(obj(_options)) {
		var argument;
		for(argument in _options) {
			switch(argument) {
				case "callback"       : callback_navigate           = _options[argument]; break;
				case "node"           : navigation_node             = _options[argument]; break;
				case "scope"          : initialization_scope        = _options[argument]; break;
			}
		}
	}
	window._man_nav_path = window._man_nav_path ? window._man_nav_path : u.h.getCleanUrl(location.href, 1);
	navigation_node._navigate = function(url) {
		url = u.h.getCleanUrl(url);
		u.stats.pageView(url);
		if(
			!window._man_nav_path || 
			(!u.h.popstate && window._man_nav_path != u.h.getCleanHash(location.hash, 1)) || 
			(u.h.popstate && window._man_nav_path != u.h.getCleanUrl(location.href, 1))
		) {
			if(this.cN && fun(this.cN.navigate)) {
				this.cN.navigate(url);
			}
		}
		else {
			if(this.cN.scene && this.cN.scene.parentNode && fun(this.cN.scene.navigate)) {
				this.cN.scene.navigate(url);
			}
			else if(this.cN && fun(this.cN.navigate)) {
				this.cN.navigate(url);
			}
		}
		if(!u.h.popstate) {
			window._man_nav_path = u.h.getCleanHash(location.hash, 1);
		}
		else {
			window._man_nav_path = u.h.getCleanUrl(location.href, 1);
		}
	}
	if(location.hash.length && location.hash.match(/^#!/)) {
		location.hash = location.hash.replace(/!/, "");
	}
	var callback_after_init = false;
	if(!this.is_initialized) {
		this.is_initialized = true;
		if(!u.h.popstate) {
			if(location.hash.length < 2) {
				window._man_nav_path = u.h.getCleanUrl(location.href);
				u.h.navigate(window._man_nav_path);
				u.init(initialization_scope);
			}
			else if(location.hash.match(/^#\//) && u.h.getCleanHash(location.hash) != u.h.getCleanUrl(location.href)) {
				callback_after_init = u.h.getCleanHash(location.hash);
			}
			else {
				u.init(initialization_scope);
			}
		}
		else {
			if(u.h.getCleanHash(location.hash) != u.h.getCleanUrl(location.href) && location.hash.match(/^#\//)) {
				window._man_nav_path = u.h.getCleanHash(location.hash);
				u.h.navigate(window._man_nav_path);
				callback_after_init = window._man_nav_path;
			}
			else {
				u.init(initialization_scope);
			}
		}
		var random_string = u.randomString(8);
		if(callback_after_init) {
			eval('navigation_node._initNavigation_'+random_string+' = function() {u.h.addEvent(this, {"callback":"'+callback_navigate+'"});u.h.callback("'+callback_after_init+'");}');
		}
		else {
			eval('navigation_node._initNavigation_'+random_string+' = function() {u.h.addEvent(this, {"callback":"'+callback_navigate+'"});}');
		}
		u.t.setTimer(navigation_node, "_initNavigation_"+random_string, 100);
	}
	else {
		u.h.callbacks.push({"node":navigation_node, "callback":callback_navigate});
	}
}
Util.period = function(format, time) {
	var seconds = 0;
	if(obj(time)) {
		var argument;
		for(argument in time) {
			switch(argument) {
				case "seconds"		: seconds = time[argument]; break;
				case "milliseconds" : seconds = Number(time[argument])/1000; break;
				case "minutes"		: seconds = Number(time[argument])*60; break;
				case "hours"		: seconds = Number(time[argument])*60*60 ; break;
				case "days"			: seconds = Number(time[argument])*60*60*24; break;
				case "months"		: seconds = Number(time[argument])*60*60*24*(365/12); break;
				case "years"		: seconds = Number(time[argument])*60*60*24*365; break;
			}
		}
	}
	var tokens = /y|n|o|O|w|W|c|d|e|D|g|h|H|l|m|M|r|s|S|t|T|u|U/g;
	var chars = new Object();
	chars.y = 0; 
	chars.n = 0; 
	chars.o = (chars.n > 9 ? "" : "0") + chars.n; 
	chars.O = 0; 
	chars.w = 0; 
	chars.W = 0; 
	chars.c = 0; 
	chars.d = 0; 
	chars.e = 0; 
	chars.D = Math.floor(((seconds/60)/60)/24);
	chars.g = Math.floor((seconds/60)/60)%24;
	chars.h = (chars.g > 9 ? "" : "0") + chars.g;
	chars.H = Math.floor((seconds/60)/60);
	chars.l = Math.floor(seconds/60)%60;
	chars.m = (chars.l > 9 ? "" : "0") + chars.l;
	chars.M = Math.floor(seconds/60);
	chars.r = Math.floor(seconds)%60;
	chars.s = (chars.r > 9 ? "" : "0") + chars.r;
	chars.S = Math.floor(seconds);
	chars.t = Math.round((seconds%1)*10);
	chars.T = Math.round((seconds%1)*100);
	chars.T = (chars.T > 9 ? "": "0") + Math.round(chars.T);
	chars.u = Math.round((seconds%1)*1000);
	chars.u = (chars.u > 9 ? chars.u > 99 ? "" : "0" : "00") + Math.round(chars.u);
	chars.U = Math.round(seconds*1000);
	return format.replace(tokens, function (_) {
		return _ in chars ? chars[_] : _.slice(1, _.length - 1);
	});
};
u.preloader = function(node, files, _options) {
	var callback_preloader_loaded = "loaded";
	var callback_preloader_loading = "loading";
	var callback_preloader_waiting = "waiting";
	node._callback_min_delay = 0;
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "loaded"               : callback_preloader_loaded       = _options[_argument]; break;
				case "loading"              : callback_preloader_loading      = _options[_argument]; break;
				case "waiting"              : callback_preloader_waiting      = _options[_argument]; break;
				case "callback_min_delay"   : node._callback_min_delay              = _options[_argument]; break;
			}
		}
	}
	if(!u._preloader_queue) {
		u._preloader_queue = document.createElement("div");
		u._preloader_processes = 0;
		if(u.e && u.e.event_support == "touch") {
			u._preloader_max_processes = 1;
		}
		else {
			u._preloader_max_processes = 2;
		}
	}
	if(node && files) {
		var entry, file;
		var new_queue = u.ae(u._preloader_queue, "ul");
		new_queue._callback_loaded = callback_preloader_loaded;
		new_queue._callback_loading = callback_preloader_loading;
		new_queue._callback_waiting = callback_preloader_waiting;
		new_queue._node = node;
		new_queue._files = files;
		new_queue.nodes = new Array();
		new_queue._start_time = new Date().getTime();
		for(i = 0; i < files.length; i++) {
			file = files[i];
			entry = u.ae(new_queue, "li", {"class":"waiting"});
			entry.i = i;
			entry._queue = new_queue
			entry._file = file;
		}
		u.ac(node, "waiting");
		if(fun(node[new_queue._callback_waiting])) {
			node[new_queue._callback_waiting](new_queue.nodes);
		}
	}
	u._queueLoader();
	return u._preloader_queue;
}
u._queueLoader = function() {
	if(u.qs("li.waiting", u._preloader_queue)) {
		while(u._preloader_processes < u._preloader_max_processes) {
			var next = u.qs("li.waiting", u._preloader_queue);
			if(next) {
				if(u.hc(next._queue._node, "waiting")) {
					u.rc(next._queue._node, "waiting");
					u.ac(next._queue._node, "loading");
					if(fun(next._queue._node[next._queue._callback_loading])) {
						next._queue._node[next._queue._callback_loading](next._queue.nodes);
					}
				}
				u._preloader_processes++;
				u.rc(next, "waiting");
				u.ac(next, "loading");
				if(next._file.match(/png|jpg|gif|svg/)) {
					next.loaded = function(event) {
						this.image = event.target;
						this._image = this.image;
						this._queue.nodes[this.i] = this;
						u.rc(this, "loading");
						u.ac(this, "loaded");
						u._preloader_processes--;
						if(!u.qs("li.waiting,li.loading", this._queue)) {
							u.rc(this._queue._node, "loading");
							if(fun(this._queue._node[this._queue._callback_loaded])) {
								this._queue._node[this._queue._callback_loaded](this._queue.nodes);
							}
						}
						u._queueLoader();
					}
					u.loadImage(next, next._file);
				}
				else if(next._file.match(/mp3|aac|wav|ogg/)) {
					next.loaded = function(event) {
						console.log(event);
						this._queue.nodes[this.i] = this;
						u.rc(this, "loading");
						u.ac(this, "loaded");
						u._preloader_processes--;
						if(!u.qs("li.waiting,li.loading", this._queue)) {
							u.rc(this._queue._node, "loading");
							if(fun(this._queue._node[this._queue._callback_loaded])) {
								this._queue._node[this._queue._callback_loaded](this._queue.nodes);
							}
						}
						u._queueLoader();
					}
					if(fun(u.audioPlayer)) {
						next.audioPlayer = u.audioPlayer();
						next.load(next._file);
					}
					else {
						u.bug("You need u.audioPlayer to preload MP3s");
					}
				}
				else {
				}
			}
			else {
				break
			}
		}
	}
}
u.loadImage = function(node, src) {
	var image = new Image();
	image.node = node;
	u.ac(node, "loading");
    u.e.addEvent(image, 'load', u._imageLoaded);
	u.e.addEvent(image, 'error', u._imageLoadError);
	image.src = src;
}
u._imageLoaded = function(event) {
	u.rc(this.node, "loading");
	if(fun(this.node.loaded)) {
		this.node.loaded(event);
	}
}
u._imageLoadError = function(event) {
	u.rc(this.node, "loading");
	u.ac(this.node, "error");
	if(fun(this.node.loaded) && typeof(this.node.failed) != "function") {
		this.node.loaded(event);
	}
	else if(fun(this.node.failed)) {
		this.node.failed(event);
	}
}
u._imageLoadProgress = function(event) {
	u.bug("progress")
	if(fun(this.node.progress)) {
		this.node.progress(event);
	}
}
u._imageLoadDebug = function(event) {
	u.bug("event:" + event.type);
	u.xInObject(event);
}
Util.createRequestObject = function() {
	return new XMLHttpRequest();
}
Util.request = function(node, url, _options) {
	var request_id = u.randomString(6);
	node[request_id] = {};
	node[request_id].request_url = url;
	node[request_id].request_method = "GET";
	node[request_id].request_async = true;
	node[request_id].request_data = "";
	node[request_id].request_headers = false;
	node[request_id].request_credentials = false;
	node[request_id].response_type = false;
	node[request_id].callback_response = "response";
	node[request_id].callback_error = "responseError";
	node[request_id].jsonp_callback = "callback";
	node[request_id].request_timeout = false;
	if(obj(_options)) {
		var argument;
		for(argument in _options) {
			switch(argument) {
				case "method"				: node[request_id].request_method			= _options[argument]; break;
				case "params"				: node[request_id].request_data				= _options[argument]; break;
				case "data"					: node[request_id].request_data				= _options[argument]; break;
				case "async"				: node[request_id].request_async			= _options[argument]; break;
				case "headers"				: node[request_id].request_headers			= _options[argument]; break;
				case "credentials"			: node[request_id].request_credentials		= _options[argument]; break;
				case "responseType"			: node[request_id].response_type			= _options[argument]; break;
				case "callback"				: node[request_id].callback_response		= _options[argument]; break;
				case "error_callback"		: node[request_id].callback_error			= _options[argument]; break;
				case "jsonp_callback"		: node[request_id].jsonp_callback			= _options[argument]; break;
				case "timeout"				: node[request_id].request_timeout			= _options[argument]; break;
			}
		}
	}
	if(node[request_id].request_method.match(/GET|POST|PUT|PATCH/i)) {
		node[request_id].HTTPRequest = this.createRequestObject();
		node[request_id].HTTPRequest.node = node;
		node[request_id].HTTPRequest.request_id = request_id;
		if(node[request_id].response_type) {
			node[request_id].HTTPRequest.responseType = node[request_id].response_type;
		}
		if(node[request_id].request_async) {
			node[request_id].HTTPRequest.statechanged = function() {
				if(this.readyState == 4 || this.IEreadyState) {
					u.validateResponse(this);
				}
			}
			if(fun(node[request_id].HTTPRequest.addEventListener)) {
				u.e.addEvent(node[request_id].HTTPRequest, "readystatechange", node[request_id].HTTPRequest.statechanged);
			}
		}
		try {
			if(node[request_id].request_method.match(/GET/i)) {
				var params = u.JSONtoParams(node[request_id].request_data);
				node[request_id].request_url += params ? ((!node[request_id].request_url.match(/\?/g) ? "?" : "&") + params) : "";
				node[request_id].HTTPRequest.open(node[request_id].request_method, node[request_id].request_url, node[request_id].request_async);
				if(node[request_id].request_timeout) {
					node[request_id].HTTPRequest.timeout = node[request_id].request_timeout;
				}
				if(node[request_id].request_credentials) {
					node[request_id].HTTPRequest.withCredentials = true;
				}
				if(typeof(node[request_id].request_headers) != "object" || (!node[request_id].request_headers["Content-Type"] && !node[request_id].request_headers["content-type"])) {
					node[request_id].HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				}
				if(obj(node[request_id].request_headers)) {
					var header;
					for(header in node[request_id].request_headers) {
						node[request_id].HTTPRequest.setRequestHeader(header, node[request_id].request_headers[header]);
					}
				}
				node[request_id].HTTPRequest.send("");
			}
			else if(node[request_id].request_method.match(/POST|PUT|PATCH/i)) {
				var params;
				if(obj(node[request_id].request_data) && node[request_id].request_data.constructor.toString().match(/function Object/i)) {
					params = JSON.stringify(node[request_id].request_data);
				}
				else {
					params = node[request_id].request_data;
				}
				node[request_id].HTTPRequest.open(node[request_id].request_method, node[request_id].request_url, node[request_id].request_async);
				if(node[request_id].request_timeout) {
					node[request_id].HTTPRequest.timeout = node[request_id].request_timeout;
				}
				if(node[request_id].request_credentials) {
					node[request_id].HTTPRequest.withCredentials = true;
				}
				if(!params.constructor.toString().match(/FormData/i) && (typeof(node[request_id].request_headers) != "object" || (!node[request_id].request_headers["Content-Type"] && !node[request_id].request_headers["content-type"]))) {
					node[request_id].HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				}
				if(obj(node[request_id].request_headers)) {
					var header;
					for(header in node[request_id].request_headers) {
						node[request_id].HTTPRequest.setRequestHeader(header, node[request_id].request_headers[header]);
					}
				}
				node[request_id].HTTPRequest.send(params);
			}
		}
		catch(exception) {
			node[request_id].HTTPRequest.exception = exception;
			u.validateResponse(node[request_id].HTTPRequest);
			return;
		}
		if(!node[request_id].request_async) {
			u.validateResponse(node[request_id].HTTPRequest);
		}
	}
	else if(node[request_id].request_method.match(/SCRIPT/i)) {
		if(node[request_id].request_timeout) {
			node[request_id].timedOut = function(requestee) {
				this.status = 0;
				delete this.timedOut;
				delete this.t_timeout;
				Util.validateResponse({node: requestee.node, request_id: requestee.request_id});
			}
			node[request_id].t_timeout = u.t.setTimer(node[request_id], "timedOut", node[request_id].request_timeout, {node: node, request_id: request_id});
		}
		var key = u.randomString();
		document[key] = new Object();
		document[key].key = key;
		document[key].node = node;
		document[key].request_id = request_id;
		document[key].responder = function(response) {
			var response_object = new Object();
			response_object.node = this.node;
			response_object.request_id = this.request_id;
			response_object.responseText = response;
			u.t.resetTimer(this.node[this.request_id].t_timeout);
			delete this.node[this.request_id].timedOut;
			delete this.node[this.request_id].t_timeout;
			u.qs("head").removeChild(this.node[this.request_id].script_tag);
			delete this.node[this.request_id].script_tag;
			delete document[this.key];
			u.validateResponse(response_object);
		}
		var params = u.JSONtoParams(node[request_id].request_data);
		node[request_id].request_url += params ? ((!node[request_id].request_url.match(/\?/g) ? "?" : "&") + params) : "";
		node[request_id].request_url += (!node[request_id].request_url.match(/\?/g) ? "?" : "&") + node[request_id].jsonp_callback + "=document."+key+".responder";
		node[request_id].script_tag = u.ae(u.qs("head"), "script", ({"type":"text/javascript", "src":node[request_id].request_url}));
	}
	return request_id;
}
Util.JSONtoParams = function(json) {
	if(obj(json)) {
		var params = "", param;
		for(param in json) {
			params += (params ? "&" : "") + param + "=" + json[param];
		}
		return params
	}
	var object = u.isStringJSON(json);
	if(object) {
		return u.JSONtoParams(object);
	}
	return json;
}
Util.evaluateResponseText = function(responseText) {
	var object;
	if(obj(responseText)) {
		responseText.isJSON = true;
		return responseText;
	}
	else {
		var response_string;
		if(responseText.trim().substr(0, 1).match(/[\"\']/i) && responseText.trim().substr(-1, 1).match(/[\"\']/i)) {
			response_string = responseText.trim().substr(1, responseText.trim().length-2);
		}
		else {
			response_string = responseText;
		}
		var json = u.isStringJSON(response_string);
		if(json) {
			return json;
		}
		var html = u.isStringHTML(response_string);
		if(html) {
			return html;
		}
		return responseText;
	}
}
Util.validateResponse = function(HTTPRequest){
	var object = false;
	if(HTTPRequest) {
		var node = HTTPRequest.node;
		var request_id = HTTPRequest.request_id;
		var request = node[request_id];
		request.response_url = HTTPRequest.responseURL || request.request_url;
		delete request.HTTPRequest;
		if(request.finished) {
			return;
		}
		request.finished = true;
		try {
			request.status = HTTPRequest.status;
			if(HTTPRequest.status && !HTTPRequest.status.toString().match(/[45][\d]{2}/)) {
				if(HTTPRequest.responseType && HTTPRequest.response) {
					object = HTTPRequest.response;
				}
				else if(HTTPRequest.responseText) {
					object = u.evaluateResponseText(HTTPRequest.responseText);
				}
			}
			else if(HTTPRequest.responseText && typeof(HTTPRequest.status) == "undefined") {
				object = u.evaluateResponseText(HTTPRequest.responseText);
			}
		}
		catch(exception) {
			request.exception = exception;
		}
	}
	else {
		console.log("Lost track of this request. There is no way of routing it back to requestee.")
		return;
	}
	if(object !== false) {
		if(fun(request.callback_response)) {
			request.callback_response(object, request_id);
		}
		else if(fun(node[request.callback_response])) {
			node[request.callback_response](object, request_id);
		}
	}
	else {
		if(fun(request.callback_error)) {
			request.callback_error({error:true,status:request.status}, request_id);
		}
		else if(fun(node[request.callback_error])) {
			node[request.callback_error]({error:true,status:request.status}, request_id);
		}
		else if(fun(request.callback_response)) {
			request.callback_response({error:true,status:request.status}, request_id);
		}
		else if(fun(node[request.callback_response])) {
			node[request.callback_response]({error:true,status:request.status}, request_id);
		}
	}
}
u.scrollTo = function(node, _options) {
	node._callback_scroll_to = "scrolledTo";
	node._callback_scroll_cancelled = "scrolledToCancelled";
	var offset_y = 0;
	var offset_x = 0;
	var scroll_to_x = 0;
	var scroll_to_y = 0;
	var to_node = false;
	node._force_scroll_to = false;
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "callback"             : node._callback_scroll_to            = _options[_argument]; break;
				case "callback_cancelled"   : node._callback_scroll_cancelled     = _options[_argument]; break;
				case "offset_y"             : offset_y                           = _options[_argument]; break;
				case "offset_x"             : offset_x                           = _options[_argument]; break;
				case "node"                 : to_node                            = _options[_argument]; break;
				case "x"                    : scroll_to_x                        = _options[_argument]; break;
				case "y"                    : scroll_to_y                        = _options[_argument]; break;
				case "scrollIn"             : scrollIn                           = _options[_argument]; break;
				case "force"                : node._force_scroll_to              = _options[_argument]; break;
			}
		}
	}
	if(to_node) {
		node._to_x = u.absX(to_node);
		node._to_y = u.absY(to_node);
	}
	else {
		node._to_x = scroll_to_x;
		node._to_y = scroll_to_y;
	}
	node._to_x = offset_x ? node._to_x - offset_x : node._to_x;
	node._to_y = offset_y ? node._to_y - offset_y : node._to_y;
	if (Util.support("scrollBehavior")) {
		var test = node.scrollTo({top:node._to_y, left:node._to_x, behavior: 'smooth'});
	}
	else {
		if(node._to_y > (node == window ? document.body.scrollHeight : node.scrollHeight)-u.browserH()) {
			node._to_y = (node == window ? document.body.scrollHeight : node.scrollHeight)-u.browserH();
		}
		if(node._to_x > (node == window ? document.body.scrollWidth : node.scrollWidth)-u.browserW()) {
			node._to_x = (node == window ? document.body.scrollWidth : node.scrollWidth)-u.browserW();
		}
		node._to_x = node._to_x < 0 ? 0 : node._to_x;
		node._to_y = node._to_y < 0 ? 0 : node._to_y;
		node._x_scroll_direction = node._to_x - u.scrollX();
		node._y_scroll_direction = node._to_y - u.scrollY();
		node._scroll_to_x = u.scrollX();
		node._scroll_to_y = u.scrollY();
		node._ignoreWheel = function(event) {
			u.e.kill(event);
		}
		if(node._force_scroll_to) {
			u.e.addEvent(node, "wheel", node._ignoreWheel);
		}
		node._scrollToHandler = function(event) {
			u.t.resetTimer(this.t_scroll);
			this.t_scroll = u.t.setTimer(this, this._scrollTo, 25);
		}
		node._cancelScrollTo = function() {
			if(!this._force_scroll_to) {
				u.t.resetTimer(this.t_scroll);
				this._scrollTo = null;
			}
		}
		node._scrollToFinished = function() {
			u.t.resetTimer(this.t_scroll);
			u.e.removeEvent(this, "wheel", this._ignoreWheel);
			this._scrollTo = null;
		}
		node._ZoomScrollFix = function(s_x, s_y) {
			if(Math.abs(this._scroll_to_y - s_y) <= 2 && Math.abs(this._scroll_to_x - s_x) <= 2) {
				return true;
			}
			return false;
		}
		node._scrollTo = function(start) {
			var s_x = u.scrollX();
			var s_y = u.scrollY();
			if((s_y == this._scroll_to_y && s_x == this._scroll_to_x) || this._force_scroll_to || this._ZoomScrollFix(s_x, s_y)) {
				if(this._x_scroll_direction > 0 && this._to_x > s_x) {
					this._scroll_to_x = Math.ceil(this._scroll_to_x + (this._to_x - this._scroll_to_x)/6);
				}
				else if(this._x_scroll_direction < 0 && this._to_x < s_x) {
					this._scroll_to_x = Math.floor(this._scroll_to_x - (this._scroll_to_x - this._to_x)/6);
				}
				else {
					this._scroll_to_x = this._to_x;
				}
				if(this._y_scroll_direction > 0 && this._to_y > s_y) {
					this._scroll_to_y = Math.ceil(this._scroll_to_y + (this._to_y - this._scroll_to_y)/6);
				}
				else if(this._y_scroll_direction < 0 && this._to_y < s_y) {
					this._scroll_to_y = Math.floor(this._scroll_to_y - (this._scroll_to_y - this._to_y)/6);
				}
				else {
					this._scroll_to_y = this._to_y;
				}
				if(this._scroll_to_x == this._to_x && this._scroll_to_y == this._to_y) {
					this._scrollToFinished();
					this.scrollTo(this._to_x, this._to_y);
					if(fun(this[this._callback_scroll_to])) {
						this[this._callback_scroll_to]();
					}
					return;
				}
				this.scrollTo(this._scroll_to_x, this._scroll_to_y);
				this._scrollToHandler();
			}
			else {
				this._cancelScrollTo();
				if(fun(this[this._callback_scroll_cancelled])) {
					this[this._callback_scroll_cancelled]();
				}
			}	
		}
		node._scrollTo();
	}
}
Util.cutString = function(string, length) {
	var matches, match, i;
	if(string.length <= length) {
		return string;
	}
	else {
		length = length-3;
	}
	matches = string.match(/\&[\w\d]+\;/g);
	if(matches) {
		for(i = 0; i < matches.length; i++){
			match = matches[i];
			if(string.indexOf(match) < length){
				length += match.length-1;
			}
		}
	}
	return string.substring(0, length) + (string.length > length ? "..." : "");
}
Util.prefix = function(string, length, prefix) {
	string = string.toString();
	prefix = prefix ? prefix : "0";
	while(string.length < length) {
		string = prefix + string;
	}
	return string;
}
Util.randomString = function(length) {
	var key = "", i;
	length = length ? length : 8;
	var pattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
	for(i = 0; i < length; i++) {
		key += pattern[u.random(0,35)];
	}
	return key;
}
Util.uuid = function() {
	var chars = '0123456789abcdef'.split('');
	var uuid = [], rnd = Math.random, r, i;
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	uuid[14] = '4';
	for(i = 0; i < 36; i++) {
		if(!uuid[i]) {
			r = 0 | rnd()*16;
			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
		}
 	}
	return uuid.join('');
}
Util.stringOr = u.eitherOr = function(value, replacement) {
	if(value !== undefined && value !== null) {
		return value;
	}
	else {
		return replacement ? replacement : "";
	}	
}
Util.getMatches = function(string, regex) {
	var match, matches = [];
	while(match = regex.exec(string)) {
		matches.push(match[1]);
	}
	return matches;
}
Util.upperCaseFirst = u.ucfirst = function(string) {
	return string.replace(/^(.){1}/, function($1) {return $1.toUpperCase()});
}
Util.lowerCaseFirst = u.lcfirst = function(string) {
	return string.replace(/^(.){1}/, function($1) {return $1.toLowerCase()});
}
Util.normalize = function(string) {
	string = string.toLowerCase();
	string = string.replace(/[^a-z0-9\_]/g, '-');
	string = string.replace(/-+/g, '-');
	string = string.replace(/^-|-$/g, '');
	return string;
}
Util.pluralize = function(count, singular, plural) {
	if(count != 1) {
		return count + " " + plural;
	}
	return count + " " + singular;
}
Util.isStringJSON = function(string) {
	if(string.trim().substr(0, 1).match(/[\{\[]/i) && string.trim().substr(-1, 1).match(/[\}\]]/i)) {
		try {
			var test = JSON.parse(string);
			if(obj(test)) {
				test.isJSON = true;
				return test;
			}
		}
		catch(exception) {
			console.log(exception)
		}
	}
	return false;
}
Util.isStringHTML = function(string) {
	if(string.trim().substr(0, 1).match(/[\<]/i) && string.trim().substr(-1, 1).match(/[\>]/i)) {
		try {
			var test = document.createElement("div");
			test.innerHTML = string;
			if(test.childNodes.length) {
				var body_class = string.match(/<body class="([a-z0-9A-Z_: ]+)"/);
				test.body_class = body_class ? body_class[1] : "";
				var head_title = string.match(/<title>([^$]+)<\/title>/);
				test.head_title = head_title ? head_title[1] : "";
				test.isHTML = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.svg = function(svg_object) {
	var svg, shape, svg_shape;
	if(svg_object.name && u._svg_cache && u._svg_cache[svg_object.name]) {
		svg = u._svg_cache[svg_object.name].cloneNode(true);
	}
	if(!svg) {
		svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		for(shape in svg_object.shapes) {
			Util.svgShape(svg, svg_object.shapes[shape]);
		}
		if(svg_object.name) {
			if(!u._svg_cache) {
				u._svg_cache = {};
			}
			u._svg_cache[svg_object.name] = svg.cloneNode(true);
		}
	}
	if(svg_object.title) {
		svg.setAttributeNS(null, "title", svg_object.title);
	}
	if(svg_object["class"]) {
		svg.setAttributeNS(null, "class", svg_object["class"]);
	}
	if(svg_object.width) {
		svg.setAttributeNS(null, "width", svg_object.width);
	}
	if(svg_object.height) {
		svg.setAttributeNS(null, "height", svg_object.height);
	}
	if(svg_object.id) {
		svg.setAttributeNS(null, "id", svg_object.id);
	}
	if(svg_object.node) {
		svg.node = svg_object.node;
	}
	if(svg_object.node) {
		svg_object.node.appendChild(svg);
	}
	return svg;
}
Util.svgShape = function(svg, svg_object) {
	svg_shape = document.createElementNS("http://www.w3.org/2000/svg", svg_object["type"]);
	svg_object["type"] = null;
	delete svg_object["type"];
	for(detail in svg_object) {
		svg_shape.setAttributeNS(null, detail, svg_object[detail]);
	}
	return svg.appendChild(svg_shape);
}
Util.browser = function(model, version) {
	var current_version = false;
	if(model.match(/\bedge\b/i)) {
		if(navigator.userAgent.match(/Windows[^$]+Gecko[^$]+Edge\/(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/Edge\/(\d+)/i)[1];
		}
	}
	if(model.match(/\bexplorer\b|\bie\b/i)) {
		if(window.ActiveXObject && navigator.userAgent.match(/MSIE (\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/MSIE (\d+.\d)/i)[1];
		}
		else if(navigator.userAgent.match(/Trident\/[\d+]\.\d[^$]+rv:(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/Trident\/[\d+]\.\d[^$]+rv:(\d+.\d)/i)[1];
		}
	}
	if(model.match(/\bfirefox\b|\bgecko\b/i) && !u.browser("ie,edge")) {
		if(navigator.userAgent.match(/Firefox\/(\d+\.\d+)/i)) {
			current_version = navigator.userAgent.match(/Firefox\/(\d+\.\d+)/i)[1];
		}
	}
	if(model.match(/\bwebkit\b/i)) {
		if(navigator.userAgent.match(/WebKit/i) && !u.browser("ie,edge")) {
			current_version = navigator.userAgent.match(/AppleWebKit\/(\d+.\d)/i)[1];
		}
	}
	if(model.match(/\bchrome\b/i)) {
		if(window.chrome && !u.browser("ie,edge")) {
			current_version = navigator.userAgent.match(/Chrome\/(\d+)(.\d)/i)[1];
		}
	}
	if(model.match(/\bsafari\b/i)) {
		u.bug(navigator.userAgent);
		if(!window.chrome && navigator.userAgent.match(/WebKit[^$]+Version\/(\d+)(.\d)/i) && !u.browser("ie,edge")) {
			current_version = navigator.userAgent.match(/Version\/(\d+)(.\d)/i)[1];
		}
	}
	if(model.match(/\bopera\b/i)) {
		if(window.opera) {
			if(navigator.userAgent.match(/Version\//)) {
				current_version = navigator.userAgent.match(/Version\/(\d+)(.\d)/i)[1];
			}
			else {
				current_version = navigator.userAgent.match(/Opera[\/ ]{1}(\d+)(.\d)/i)[1];
			}
		}
	}
	if(current_version) {
		if(!version) {
			return current_version;
		}
		else {
			if(!isNaN(version)) {
				return current_version == version;
			}
			else {
				return eval(current_version + version);
			}
		}
	}
	else {
		return false;
	}
}
Util.segment = function(segment) {
	if(!u.current_segment) {
		var scripts = document.getElementsByTagName("script");
		var script, i, src;
		for(i = 0; i < scripts.length; i++) {
			script = scripts[i];
			seg_src = script.src.match(/\/seg_([a-z_]+)/);
			if(seg_src) {
				u.current_segment = seg_src[1];
			}
		}
	}
	if(segment) {
		return segment == u.current_segment;
	}
	return u.current_segment;
}
Util.system = function(os, version) {
	var current_version = false;
	if(os.match(/\bwindows\b/i)) {
		if(navigator.userAgent.match(/(Windows NT )(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/(Windows NT )(\d+.\d)/i)[2];
		}
	}
	else if(os.match(/\bmac\b/i)) {
		if(navigator.userAgent.match(/(Macintosh; Intel Mac OS X )(\d+[._]{1}\d)/i)) {
			current_version = navigator.userAgent.match(/(Macintosh; Intel Mac OS X )(\d+[._]{1}\d)/i)[2].replace("_", ".");
		}
	}
	else if(os.match(/\blinux\b/i)) {
		if(navigator.userAgent.match(/linux|x11/i) && !navigator.userAgent.match(/android/i)) {
			current_version = true;
		}
	}
	else if(os.match(/\bios\b/i)) {
		if(navigator.userAgent.match(/(OS )(\d+[._]{1}\d+[._\d]*)( like Mac OS X)/i)) {
			current_version = navigator.userAgent.match(/(OS )(\d+[._]{1}\d+[._\d]*)( like Mac OS X)/i)[2].replace(/_/g, ".");
		}
	}
	else if(os.match(/\bandroid\b/i)) {
		if(navigator.userAgent.match(/Android[ ._]?(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/Android[ ._]?(\d+.\d)/i)[1];
		}
	}
	else if(os.match(/\bwinphone\b/i)) {
		if(navigator.userAgent.match(/Windows[ ._]?Phone[ ._]?(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/Windows[ ._]?Phone[ ._]?(\d+.\d)/i)[1];
		}
	}
	if(current_version) {
		if(!version) {
			return current_version;
		}
		else {
			if(!isNaN(version)) {
				return current_version == version;
			}
			else {
				return eval(current_version + version);
			}
		}
	}
	else {
		return false;
	}
}
Util.support = function(property) {
	if(document.documentElement) {
		var style_property = u.lcfirst(property.replace(/^(-(moz|webkit|ms|o)-|(Moz|webkit|Webkit|ms|O))/, "").replace(/(-\w)/g, function(word){return word.replace(/-/, "").toUpperCase()}));
		if(style_property in document.documentElement.style) {
			return true;
		}
		else if(u.vendorPrefix() && (u.vendorPrefix()+u.ucfirst(style_property)) in document.documentElement.style) {
			return true;
		}
	}
	return false;
}
Util.vendor_properties = {};
Util.vendorProperty = function(property) {
	if(!Util.vendor_properties[property]) {
		Util.vendor_properties[property] = property.replace(/(-\w)/g, function(word){return word.replace(/-/, "").toUpperCase()});
		if(document.documentElement) {
			var style_property = u.lcfirst(property.replace(/^(-(moz|webkit|ms|o)-|(Moz|webkit|Webkit|ms|O))/, "").replace(/(-\w)/g, function(word){return word.replace(/-/, "").toUpperCase()}));
			if(style_property in document.documentElement.style) {
				Util.vendor_properties[property] = style_property;
			}
			else if(u.vendorPrefix() && (u.vendorPrefix()+u.ucfirst(style_property)) in document.documentElement.style) {
				Util.vendor_properties[property] = u.vendorPrefix()+u.ucfirst(style_property);
			}
		}
	}
	return Util.vendor_properties[property];
}
Util.vendor_prefix = false;
Util.vendorPrefix = function() {
	if(Util.vendor_prefix === false) {
		Util.vendor_prefix = "";
		if(document.documentElement && fun(window.getComputedStyle)) {
			var styles = window.getComputedStyle(document.documentElement, "");
			if(styles.length) {
				var i, style, match;
				for(i = 0; i < styles.length; i++) {
					style = styles[i];
					match = style.match(/^-(moz|webkit|ms)-/);
					if(match) {
						Util.vendor_prefix = match[1];
						if(Util.vendor_prefix == "moz") {
							Util.vendor_prefix = "Moz";
						}
						break;
					}
				}
			}
			else {
				var x, match;
				for(x in styles) {
					match = x.match(/^(Moz|webkit|ms|OLink)/);
					if(match) {
						Util.vendor_prefix = match[1];
						if(Util.vendor_prefix === "OLink") {
							Util.vendor_prefix = "O";
						}
						break;
					}
				}
			}
		}
	}
	return Util.vendor_prefix;
}
u.textscaler = function(node, _settings) {
	if(typeof(_settings) != "object") {
		_settings = {
			"*":{
				"unit":"rem",
				"min_size":1,
				"min_width":200,
				"min_height":200,
				"max_size":40,
				"max_width":3000,
				"max_height":2000
			}
		};
	}
	node.text_key = u.randomString(8);
	u.ac(node, node.text_key);
	node.text_settings = JSON.parse(JSON.stringify(_settings));
	node.scaleText = function() {
		var tag;
		for(tag in this.text_settings) {
			var settings = this.text_settings[tag];
			var width_wins = false;
			var height_wins = false;
			if(settings.width_factor && settings.height_factor) {
				if(window._man_text._height - settings.min_height < window._man_text._width - settings.min_width) {
					height_wins = true;
				}
				else {
					width_wins = true;
				}
			}
			if(settings.width_factor && !height_wins) {
				if(settings.min_width <= window._man_text._width && settings.max_width >= window._man_text._width) {
					var font_size = settings.min_size + (settings.size_factor * (window._man_text._width - settings.min_width) / settings.width_factor);
					settings.css_rule.style.setProperty("font-size", font_size + settings.unit, "important");
				}
				else if(settings.max_width < window._man_text._width) {
					settings.css_rule.style.setProperty("font-size", settings.max_size + settings.unit, "important");
				}
				else if(settings.min_width > window._man_text._width) {
					settings.css_rule.style.setProperty("font-size", settings.min_size + settings.unit, "important");
				}
			}
			else if(settings.height_factor) {
				if(settings.min_height <= window._man_text._height && settings.max_height >= window._man_text._height) {
					var font_size = settings.min_size + (settings.size_factor * (window._man_text._height - settings.min_height) / settings.height_factor);
					settings.css_rule.style.setProperty("font-size", font_size + settings.unit, "important");
				}
				else if(settings.max_height < window._man_text._height) {
					settings.css_rule.style.setProperty("font-size", settings.max_size + settings.unit, "important");
				}
				else if(settings.min_height > window._man_text._height) {
					settings.css_rule.style.setProperty("font-size", settings.min_size + settings.unit, "important");
				}
			}
		}
	}
	node.cancelTextScaling = function() {
		u.e.removeEvent(window, "resize", window._man_text.scale);
	}
	if(!window._man_text) {
		var man_text = {};
		man_text.nodes = [];
		var style_tag = document.createElement("style");
		style_tag.setAttribute("media", "all")
		style_tag.setAttribute("type", "text/css")
		man_text.style_tag = u.ae(document.head, style_tag);
		man_text.style_tag.appendChild(document.createTextNode(""))
		window._man_text = man_text;
		window._man_text._width = u.browserW();
		window._man_text._height = u.browserH();
		window._man_text.scale = function() {
			var _width = u.browserW();
			var _height = u.browserH();
			window._man_text._width = u.browserW();
			window._man_text._height = u.browserH();
			var i, node;
			for(i = 0; i < window._man_text.nodes.length; i++) {
				node = window._man_text.nodes[i];
				if(node.parentNode) { 
					node.scaleText();
				}
				else {
					window._man_text.nodes.splice(window._man_text.nodes.indexOf(node), 1);
					if(!window._man_text.nodes.length) {
						u.e.removeEvent(window, "resize", window._man_text.scale);
						window._man_text = false;
						break;
					}
				}
			}
		}
		u.e.addEvent(window, "resize", window._man_text.scale);
		window._man_text.precalculate = function() {
			var i, node, tag;
			for(i = 0; i < window._man_text.nodes.length; i++) {
				node = window._man_text.nodes[i];
				if(node.parentNode) { 
					var settings = node.text_settings;
					for(tag in settings) {
						if(settings[tag].max_width && settings[tag].min_width) {
							settings[tag].width_factor = settings[tag].max_width-settings[tag].min_width;
						}
						else if(node._man_text.max_width && node._man_text.min_width) {
							settings[tag].max_width = node._man_text.max_width;
							settings[tag].min_width = node._man_text.min_width;
							settings[tag].width_factor = node._man_text.max_width-node._man_text.min_width;
						}
						else {
							settings[tag].width_factor = false;
						}
						if(settings[tag].max_height && settings[tag].min_height) {
							settings[tag].height_factor = settings[tag].max_height-settings[tag].min_height;
						}
						else if(node._man_text.max_height && node._man_text.min_height) {
							settings[tag].max_height = node._man_text.max_height;
							settings[tag].min_height = node._man_text.min_height;
							settings[tag].height_factor = node._man_text.max_height-node._man_text.min_height;
						}
						else {
							settings[tag].height_factor = false;
						}
						settings[tag].size_factor = settings[tag].max_size-settings[tag].min_size;
						if(!settings[tag].unit) {
							settings[tag].unit = node._man_text.unit;
						}
					}
				}
			}
		}
	}
	var tag;
	node._man_text = {};
	for(tag in node.text_settings) {
		if(tag == "min_height" || tag == "max_height" || tag == "min_width" || tag == "max_width" || tag == "unit" || tag == "ref") {
			node._man_text[tag] = node.text_settings[tag];
			node.text_settings[tag] = null;
			delete node.text_settings[tag];
		}
		else {
			selector = "."+node.text_key + ' ' + tag + ' ';
			node.css_rules_index = window._man_text.style_tag.sheet.insertRule(selector+'{}', 0);
			node.text_settings[tag].css_rule = window._man_text.style_tag.sheet.cssRules[0];
		}
	}
	window._man_text.nodes.push(node);
	window._man_text.precalculate();
	node.scaleText();
}
Util.Timer = u.t = new function() {
	this._timers = new Array();
	this.setTimer = function(node, action, timeout, param) {
		var id = this._timers.length;
		param = param ? param : {"target":node, "type":"timeout"};
		this._timers[id] = {"_a":action, "_n":node, "_p":param, "_t":setTimeout("u.t._executeTimer("+id+")", timeout)};
		return id;
	}
	this.resetTimer = function(id) {
		if(this._timers[id]) {
			clearTimeout(this._timers[id]._t);
			this._timers[id] = false;
		}
	}
	this._executeTimer = function(id) {
		var timer = this._timers[id];
		this._timers[id] = false;
		var node = timer._n;
		if(fun(timer._a)) {
			node._timer_action = timer._a;
			node._timer_action(timer._p);
			node._timer_action = null;
		}
		else if(fun(node[timer._a])) {
			node[timer._a](timer._p);
		}
	}
	this.setInterval = function(node, action, interval, param) {
		var id = this._timers.length;
		param = param ? param : {"target":node, "type":"timeout"};
		this._timers[id] = {"_a":action, "_n":node, "_p":param, "_i":setInterval("u.t._executeInterval("+id+")", interval)};
		return id;
	}
	this.resetInterval = function(id) {
		if(this._timers[id]) {
			clearInterval(this._timers[id]._i);
			this._timers[id] = false;
		}
	}
	this._executeInterval = function(id) {
		var node = this._timers[id]._n;
		if(fun(this._timers[id]._a)) {
			node._interval_action = this._timers[id]._a;
			node._interval_action(this._timers[id]._p);
			node._interval_action = null;
		}
		else if(fun(node[this._timers[id]._a])) {
			node[this._timers[id]._a](this._timers[id]._p);
		}
	}
	this.valid = function(id) {
		return this._timers[id] ? true : false;
	}
	this.resetAllTimers = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._t) {
				this.resetTimer(i);
			}
		}
	}
	this.resetAllIntervals = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._i) {
				this.resetInterval(i);
			}
		}
	}
}
Util.getVar = function(param, url) {
	var string = url ? url.split("#")[0] : location.search;
	var regexp = new RegExp("[\&\?\b]{1}"+param+"\=([^\&\b]+)");
	var match = string.match(regexp);
	if(match && match.length > 1) {
		return match[1];
	}
	else {
		return "";
	}
}


/*beta-u-fontsready.js*/
u.fontsReady = function(node, fonts, _options) {
	var callback_loaded = "fontsLoaded";
	var callback_timeout = "fontsNotLoaded";
	var max_time = 3000;
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "callback"					: callback_loaded		= _options[_argument]; break;
				case "timeout"					: callback_timeout		= _options[_argument]; break;
				case "max"						: max_time				= _options[_argument]; break;
			}
		}
	}
	window["_man_fonts_"] = window["_man_fonts_"] || {};
	window["_man_fonts_"].fontApi = document.fonts && fun(document.fonts.check) ? true : false;
	window["_man_fonts_"].fonts = window["_man_fonts_"].fonts || {};
	var font, node, i;
	if(typeof(fonts.length) == "undefined") {
		font = fonts;
		fonts = new Array();
		fonts.push(font);
	}
	var loadkey = u.randomString(8);
	if(window["_man_fonts_"].fontApi) {
		window["_man_fonts_"+loadkey] = {};
	}
	else {
		window["_man_fonts_"+loadkey] = u.ae(document.body, "div");
		window["_man_fonts_"+loadkey].basenodes = {};
	}
	window["_man_fonts_"+loadkey].nodes = [];
	window["_man_fonts_"+loadkey].t_timeout = u.t.setTimer(window["_man_fonts_"+loadkey], "fontCheckTimeout", max_time);
	window["_man_fonts_"+loadkey].loadkey = loadkey;
	window["_man_fonts_"+loadkey].callback_node = node;
	window["_man_fonts_"+loadkey].callback_loaded = callback_loaded;
	window["_man_fonts_"+loadkey].callback_timeout = callback_timeout;
	for(i = 0; i < fonts.length; i++) {
		font = fonts[i];
		font.style = font.style || "normal";
		font.weight = font.weight || "400";
		font.size = font.size || "16px";
		font.status = "waiting";
		font.id = u.normalize(font.family+font.style+font.weight);
		if(!window["_man_fonts_"].fonts[font.id]) {
			window["_man_fonts_"].fonts[font.id] = font;
		}
		if(window["_man_fonts_"].fontApi) {
			node = {};
		}
		else {
			if(!window["_man_fonts_"+loadkey].basenodes[u.normalize(font.style+font.weight)]) {
				window["_man_fonts_"+loadkey].basenodes[u.normalize(font.style+font.weight)] = u.ae(window["_man_fonts_"+loadkey], "span", {"html":"I'm waiting for your fonts to load!","style":"font-family: Times !important; font-style: "+font.style+" !important; font-weight: "+font.weight+" !important; font-size: "+font.size+" !important; line-height: 1em !important; opacity: 0 !important;"});
			}
			node = u.ae(window["_man_fonts_"+loadkey], "span", {"html":"I'm waiting for your fonts to load!","style":"font-family: '"+font.family+"', Times !important; font-style: "+font.style+" !important; font-weight: "+font.weight+" !important; font-size: "+font.size+" !important; line-height: 1em !important; opacity: 0 !important;"});
		}
		node.font_size = font.size;
		node.font_family = font.family;
		node.font_weight = font.weight;
		node.font_style = font.style;
		node.font_id = font.id;
		node.loadkey = loadkey;
		window["_man_fonts_"+loadkey].nodes.push(node);
	}
	window["_man_fonts_"+loadkey].checkFontsAPI = function() {
		var i, node, font_string;
		for(i = 0; i < this.nodes.length; i++) {
			node = this.nodes[i];
			if(window["_man_fonts_"].fonts[node.font_id] && window["_man_fonts_"].fonts[node.font_id].status == "waiting") {
				font_string = node.font_style + " " + node.font_weight + " " + node.font_size + " " + node.font_family;
				document.fonts.load(font_string).then(function(fontFaceSetEvent) {
					if(fontFaceSetEvent && fontFaceSetEvent.length && fontFaceSetEvent[0].status == "loaded") {
						window["_man_fonts_"].fonts[this.font_id].status = "loaded";
					}
					else {
						window["_man_fonts_"].fonts[this.font_id].status = "failed";
					}
					if(window["_man_fonts_"+this.loadkey] && fun(window["_man_fonts_"+this.loadkey].checkFontsStatus)) {
						window["_man_fonts_"+this.loadkey].checkFontsStatus();
					}
				}.bind(node));
			}
		}
		if(fun(this.checkFontsStatus)) {
			this.checkFontsStatus();
		}
	}
	window["_man_fonts_"+loadkey].checkFontsFallback = function() {
		var basenode, i, node;
		for(i = 0; i < this.nodes.length; i++) {
			node = this.nodes[i];
			basenode = this.basenodes[u.normalize(node.font_style+node.font_weight)];
			if(node.offsetWidth != basenode.offsetWidth || node.offsetHeight != basenode.offsetHeight) {
				window["_man_fonts_"].fonts[node.font_id].status = "loaded";
			}
		}
		this.t_fallback = u.t.setTimer(this, "checkFontsFallback", 30);
		if(fun(this.checkFontsStatus)) {
			this.checkFontsStatus();
		}
	}
	window["_man_fonts_"+loadkey].fontCheckTimeout = function(event) {
		u.t.resetTimer(this.t_fallback);
		delete window["_man_fonts_"+this.loadkey];
		if(this.parentNode) {
			this.parentNode.removeChild(this);
		}
		if(fun(this.callback_node[this.callback_timeout])) {
			this.callback_node[this.callback_timeout](this.nodes);
		}
		else if(fun(this.callback_node[this.callback_loaded])) {
			this.callback_node[this.callback_loaded](this.nodes);
		}
	}
	window["_man_fonts_"+loadkey].checkFontsStatus = function(event) {
		var i, node;
		for(i = 0; i < this.nodes.length; i++) {
			node = this.nodes[i];
			if(window["_man_fonts_"].fonts[node.font_id].status == "waiting") {
				return;
			}
		}
		u.t.resetTimer(this.t_timeout);
		u.t.resetTimer(this.t_fallback);
		delete window["_man_fonts_"+this.loadkey];
		if(this.parentNode) {
			this.parentNode.removeChild(this);
		}
		if(fun(this.callback_node[this.callback_loaded])) {
			if(this.fontApi) {
				this.callback_node[this.callback_loaded](this.nodes);
			}
			else {
				setTimeout(function() {
					this.callback_node[this.callback_loaded](this.nodes); 
				}.bind(this), 250);
			}
		}
	}
	if(window["_man_fonts_"].fontApi) {
		window["_man_fonts_"+loadkey].checkFontsAPI();
	}
	else {
		window["_man_fonts_"+loadkey].checkFontsFallback();
	}
}

/*i-page.js*/
Util.Objects["page"] = new function() {
	this.init = function(page) {
		page.hN = u.qs("#header");
		page.cN = u.qs("#content", page);
		page.fN = u.qs("#footer");
		page.resized = function() {
			this.browser_h = u.browserH();
			this.browser_w = u.browserW();
			u.ass(this.cN, {
				height: this.browser_h + "px"
			});
			if(this.cN && this.cN.scene && typeof(this.cN.scene.resized) == "function") {
				this.cN.scene.resized();
			}
		}
		page.scrolled = function() {
			this.scroll_y = u.scrollY();
			if(this.cN && this.cN.scene && typeof(this.cN.scene.scrolled) == "function") {
				this.cN.scene.scrolled();
			}
		}
		page.ready = function() {
			if(!this.is_ready) {
				this.is_ready = true;
				u.rc(this, "i:page");
				this.cN.scene = u.qs(".scene", this);
				u.e.addWindowEvent(this, "resize", "resized");
				u.e.addWindowEvent(this, "scroll", "scrolled");
				this.resized();
				this.fontsLoaded = function() {
					u.bug("fontsLoaded");
					if (u.hc(this.cN.scene, "front") ) {
						u.o.front.init(page.cN.scene);
					}
					else {
						u.o.cookies.init(page.cN.scene);
					}
				}
				u.fontsReady(this, 
					{"family":"GT America", "weight":900}
				);
			}
		}
		page.ready();
	}
}
u.e.addDOMReadyEvent(function() {u.o.page.init(page)});


/*i-front.js*/
Util.Objects["front"] = new function() {
	this.init = function(scene) {
		scene.resized = function(event) {
			this.diagonal_radius = Math.ceil(Math.sqrt(Math.pow(page.browser_w, 2) + Math.pow(page.browser_w, 2)) / 2);
			u.ass(this, {
				height: page.browser_h + "px"
			});
			if(this.circle) {
				this.circle.canvas.width = page.browser_w
				this.circle.canvas.height = page.browser_h
				this.circle.center_x = Math.round(page.browser_w/2);
				this.circle.center_y = Math.round(page.browser_h/2);
				if(page.browser_h > page.browser_w) {
					this.circle.radius = this.circle.center_x - 35;
				}
				else {
					this.circle.radius = this.circle.center_y - 35;
				}
			}
			if(this.letter) {
				this.letter.resized();
			}
			if(this.side_a) {
				this.side_a.resized();
			}
			if(this.intermezzo) {
				this.intermezzo.resized();
			}
			if(this.side_b) {
				this.side_b.resized();
			}
			if(this.finale) {
				this.finale.resized();
			}
		}
		scene.scrolled = function(event) {
		}
		scene.ready = function() {
			if(!this.is_ready) {
				u.rc(this, "i:front");
				this.circle = u.ae(this, "div", {
					"class":"circle",
				});
				this.circle.canvas = u.ae(this.circle, "canvas", {width:this.offsetWidth, height:page.browser_h});
				this.circle.ctx = this.circle.canvas.getContext("2d");
				this.letter = u.qs("div.letter", this);
				u.o.letter.init(this.letter);
				this.side_a = u.qs("div.side_a", this);
				u.o.side_a.init(this.side_a);
				this.intermezzo = u.qs("div.intermezzo", this);
				u.o.intermezzo.init(this.intermezzo);
				this.side_b = u.qs("div.side_b", this);
				u.o.side_b.init(this.side_b);
				this.finale = u.qs("div.finale", this);
				u.o.finale.init(this.finale);
				u.textscaler(this, {
					"min_width":320,
					"max_width":1600,
					"unit":"px",
					"h1":{
						"min_size":22,
						"max_size":110
					},
					"h2":{
						"min_size":18,
						"max_size":60
					},
					"h3":{
						"min_size":12,
						"max_size":18
					},
					"p":{
						"min_size":14,
						"max_size":32
					},
				});
				window.scrollTop = 0;
				this.letter.scrollTop = 0;
				this.resized();
				this.is_ready = true;
			}
		}
		scene.controller = function() {
			if(this.is_ready) {
				if(this.letter.is_ready && !this.letter.is_active && !this.letter.is_done) {
					this.letter.build();
				}
				else if(this.letter.is_done && this.side_a.is_ready && !this.side_a.is_active && !this.side_a.is_done) {
					this.side_a.build();
				}
				else if(this.side_a.is_done && this.intermezzo.is_ready && !this.intermezzo.is_active && !this.intermezzo.is_done) {
					this.intermezzo.build();
				}
				else if(this.intermezzo.is_done && this.side_b.is_ready && !this.side_b.is_active && !this.side_b.is_done) {
					this.side_b.build();
				}
				else if(this.side_b.is_done && this.finale.is_ready && !this.finale.is_active && !this.finale.is_done) {
					this.finale.build();
				}
			}
		}
		scene.ready();
	}
}


/*i-login.js*/
Util.Objects["login"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
		}
		scene.scrolled = function() {
		}
		scene.ready = function() {
			this._form = u.qs("form", this);
			u.f.init(this._form);
		}
		scene.ready();
	}
}


/*i-letter.js*/
Util.Objects["letter"] = new function() {
	this.init = function(div) {
		div.resized = function(event) {
			if(this.is_active) {
				if(this.h1) {
					u.ass(this.wrapper, {
						paddingTop: ((page.browser_h - this.h1.offsetHeight) / 2) / 1.8 +"px",
					});
				}
				u.ass(this.wrapper, {
					"padding-bottom":page.browser_h + "px",
				});
			}
		}
		div.scrolled = function(event) {
			if(this.is_active) {
				if(this.nodes.length > this.current_front_node_i) {
					var delay;
					for(var i = this.current_front_node_i; i < this.nodes.length; i++) {
						if(this.nodes[i].offsetTop - page.browser_h + (page.browser_h * 0.25) < this.scrollTop) {
								if(event.timeStamp - this.last_show_time < 1000) {
									delay = 1000 - (event.timeStamp - this.last_show_time);
								}
								else {
									delay = 0;
								}
								u.a.transition(this.nodes[i], "all 2s ease-in-out " + delay + "ms");
								u.ass(this.nodes[i], {
									opacity: 1,
									transform: "translate3D(0, 0, 0)"
								})
								this.last_show_time = event.timeStamp + delay;
								this.current_front_node_i++;
						}
					}
				}
				this.clouds_front.style.top = -(this.scrollTop * 0.5) + "px";
				this.clouds_mid.style.top = -(this.scrollTop * 0.4) + "px";
				this.clouds_back.style.top = -(this.scrollTop * 0.3) + "px";
				var total_scroll_height = (this.wrapper.offsetHeight - page.browser_h)
				var progress = (total_scroll_height - (total_scroll_height - this.scrollTop)) / total_scroll_height
				if (progress >= 0.999) {
					progress = 1;						
				}
				if(progress < 0) { 
					progress = 0;
				}
				var current_degree = Math.PI * progress;
				page.cN.scene.circle.ctx.clearRect(0, 0, page.browser_w, page.browser_h);
				page.cN.scene.circle.ctx.beginPath();
				page.cN.scene.circle.ctx.lineWidth = 4;
				page.cN.scene.circle.ctx.strokeStyle = "#f6d874";
				page.cN.scene.circle.ctx.arc(page.cN.scene.circle.center_x, page.cN.scene.circle.center_y, page.cN.scene.circle.radius, 0*Math.PI, progress*2*Math.PI);
				page.cN.scene.circle.ctx.stroke();
				page.cN.scene.circle.ctx.closePath();
				if(progress >= 1) {
					this.destroy();
				}
			}
		}
		div.ready = function() {
			if(!this.is_ready) {
				u.rc(this, "i:letter");
				this.wrapper = u.wc(this, "div");
				this.language_selector = u.qs("ul.language_selector")
				this.inactive_language = u.qs("ul.language_selector li.inactive.language");
				this.active_language = u.qs("ul.language_selector li.active.language");
				this.h1 = u.qs("h1", this);
				this.nodes = u.qsa("h1,p", this);
				var i, node;
				for(i = 0; i < this.nodes.length; i++) {
					node = this.nodes[i];
					u.ass(node, {
						opacity: 0,
						transform: "translate3D(0, 15px, 0)"
					});
				}
				u.preloader(this, [
					"/img/gx_cloud_front_left1.png", 
					"/img/gx_cloud_front_left2.png",
					"/img/gx_cloud_front_left3.png",
					"/img/gx_cloud_front_left4.png",
					"/img/gx_cloud_front1.png", 
					"/img/gx_cloud_front2.png", 
					"/img/gx_cloud_front3.png",
					"/img/gx_cloud_front_right1.png", 
					"/img/gx_cloud_front_right2.png",
					"/img/gx_cloud_front_right3.png",
					"/img/gx_cloud_front_right4.png",
					"/img/gx_cloud_mid1.png", 
					"/img/gx_cloud_mid2.png", 
					"/img/gx_cloud_mid3.png",
					"/img/gx_cloud_back1.png", 
					"/img/gx_cloud_back2.png", 
					"/img/gx_cloud_back3.png", 
					"/img/gx_cloud_back4.png"
				])
				var cookie_notice = u.qs(".cookie-notice")
				if(typeof(window.localStorage) != "object" || !window.localStorage.cookie_accept) {
					var cookie_accept = u.qs('.cookie-accept');
					cookie_accept.addEventListener("click", function() {
						window.localStorage.cookie_accept = true;
						cookie_notice.style.display = 'none';
					});
				}
				else {
					cookie_notice.style.display = 'none';
				}
				u.ass(this, {
					opacity: 1,
				});
				this.loaded = function (queue) {
					this.is_ready = true;
					page.cN.scene.controller();
				}
			}
		}
		div.build = function() {
			this.is_active = true;
			this.resized();
			u.e.addEvent(this, "scroll", this.scrolled);
			this.current_front_node_i = 0;
			this.current_front_node = this.nodes[this.current_front_node_i++];
			u.a.transition(this.language_selector, "all 2s ease-in-out");
			u.ass(this.language_selector, {
				opacity: 1,
				transform: "translate3D(0, 0, 0)"
			});
			u.e.hover(this.inactive_language);
			this.inactive_language.over = function(event) {
				u.ass(div.inactive_language, {
					"border-bottom":"1px solid"
				})
				u.ass(div.active_language, {
					"border-bottom":0
				})
			}
			this.inactive_language.out = function(event) {
				u.ass(div.active_language, {
					"border-bottom":"1px solid"
				})
				u.ass(div.inactive_language, {
					"border-bottom":0
				})
			}
			u.a.transition(this.current_front_node, "all 2s ease-in-out");
			u.ass(this.current_front_node, {
				opacity: 1,
				transform: "translate3D(0, 0, 0)"
			});
			this.current_front_node = this.nodes[this.current_front_node_i++];
			u.a.transition(this.current_front_node, "all 2s ease-in-out " + 500 + "ms");
			u.ass(this.current_front_node, {
				opacity: 1,
				transform: "translate3d(0, 0, 0)"
			});
			this.last_show_time = 0;
			this.clouds_front = u.ae(this, "div", {
				"class":"clouds front",
			})
			this.clouds_mid = u.ae(this, "div", {
				"class":"clouds mid",
			})
			this.clouds_back = u.ae(this, "div", {
				"class":"clouds back",
			})
			var cloud_layers_height = this.scrollHeight * 2 + "px";
			u.ass(this.clouds_front, {
				"position":"absolute",
				"top":"0",
				"left":"0",
				"width":"100%",
				"height": cloud_layers_height,
				"z-index":"-10"
			});
			u.ass(this.clouds_mid, {
				"position":"absolute",
				"top":"0",
				"left":"0",
				"width":"100%",
				"height": cloud_layers_height,
				"z-index":"-20"
			});
			u.ass(this.clouds_back, {
				"position":"absolute",
				"top":"0",
				"left":"0",
				"width":"100%",
				"height": cloud_layers_height,
				"z-index":"-30"
			}) 
			this.layer_names = ["front", "mid", "back"];
			this.clouds_gx = {
				"front":{
					"left":[
						"/img/gx_cloud_front_left1.png", 
						"/img/gx_cloud_front_left2.png",
						"/img/gx_cloud_front_left3.png",
						"/img/gx_cloud_front_left4.png"
					],
					"center":[
						"/img/gx_cloud_front1.png", 
						"/img/gx_cloud_front2.png", 
						"/img/gx_cloud_front3.png"],
					"right":[
						"/img/gx_cloud_front_right1.png", 
						"/img/gx_cloud_front_right2.png",
						"/img/gx_cloud_front_right3.png",
						"/img/gx_cloud_front_right4.png",
					],
				},
				"mid":[
					"/img/gx_cloud_mid1.png", 
					"/img/gx_cloud_mid2.png", 
					"/img/gx_cloud_mid3.png"],
				"back":[
					"/img/gx_cloud_back1.png", 
					"/img/gx_cloud_back2.png", 
					"/img/gx_cloud_back3.png", 
					"/img/gx_cloud_back4.png"]
			};
			var current_ypos = 0;
			var top_ypos = 125;
			var current_layer = "";
			var current_cloud_gx = [];
			var cloud_path = "";
			var previous_cloud_path = "";
			var i = 0;
			var clouds = [];
			var cloud_distance 
			current_ypos = top_ypos;
			for (i = 0; current_ypos < this.clouds_front.offsetHeight; i++) {
				console.log(current_ypos)
				current_layer = this.layer_names[Math.round(u.random(0,2))];
				current_layer_cloud_gx = this.clouds_gx[current_layer];
				if (current_layer == "front") {
					this["div_left_cloud_" + i] = u.ae(this.clouds_front, "div", {
						"class":"left cloud " + i,
					})
					cloud_path = current_layer_cloud_gx.left[Math.round(u.random(0,current_layer_cloud_gx.left.length-1))]
					if (cloud_path == previous_cloud_path) {
						continue
					}
					previous_cloud_path = cloud_path;
					this["img_left_cloud_" + i] = u.ae(this["div_left_cloud_" + i], "img", {
						"src":cloud_path
					})
					u.ass(this["div_left_cloud_" + i], {
						"position":"absolute",
						"top":current_ypos + "px",
						"left": 0 - Math.round(u.random(0, 100)) + "px"
					})
				}
				else if (current_layer == "mid") {
					this["div_left_cloud_" + i] = u.ae(this.clouds_mid, "div", {
						"class":"left cloud " + i,
					})
					cloud_path = current_layer_cloud_gx[Math.round(u.random(0,current_layer_cloud_gx.length-1))]
					if (cloud_path == previous_cloud_path) {
						continue
					}
					previous_cloud_path = cloud_path;
					this["img_left_cloud_" + i] = u.ae(this["div_left_cloud_" + i], "img", {
						"src":cloud_path
					})
					u.ass(this["div_left_cloud_" + i], {
						"position":"absolute",
						"top":current_ypos + "px",
						"left": 0 + Math.round(u.random(-20, 100)) + "px"
					})
				}
				else if (current_layer == "back") {
					this["div_left_cloud_" + i] = u.ae(this.clouds_back, "div", {
						"class":"left cloud " + i,
					})
					cloud_path = current_layer_cloud_gx[Math.round(u.random(0,current_layer_cloud_gx.length-1))]
					if (cloud_path == previous_cloud_path) {
						continue
					}
					previous_cloud_path = cloud_path;
					this["img_left_cloud_" + i] = u.ae(this["div_left_cloud_" + i], "img", {
						"src":cloud_path
					})
					u.ass(this["div_left_cloud_" + i], {
						"position":"absolute",
						"top":current_ypos + "px",
						"left": 0 + Math.round(u.random(-20, 100)) + "px"
					})
				}
				clouds.push(this["div_left_cloud_" + i]);
				current_ypos = current_ypos + this["div_left_cloud_" + i].offsetHeight + Math.round(u.random(0,303)) + 160;
			}
			current_ypos = top_ypos;
			for (i = 0; current_ypos < this.clouds_front.offsetHeight; i++) {
				current_layer = this.layer_names[Math.round(u.random(0,2))];
				current_layer_cloud_gx = this.clouds_gx[current_layer];
				if (current_layer == "front") {
					this["div_right_cloud_" + i] = u.ae(this.clouds_front, "div", {
						"class":"right cloud " + i,
					})
					cloud_path = current_layer_cloud_gx.right[Math.round(u.random(0,current_layer_cloud_gx.right.length-1))]
					if (cloud_path == previous_cloud_path) {
						continue
					}
					previous_cloud_path = cloud_path;
					this["img_right_cloud_" + i] = u.ae(this["div_right_cloud_" + i], "img", {
						"src":cloud_path
					})
					u.ass(this["div_right_cloud_" + i], {
						"position":"absolute",
						"top":current_ypos + "px",
						"right": 0 - Math.round(u.random(0, 100)) + "px"
					})
				}
				else if (current_layer == "mid") {
					this["div_right_cloud_" + i] = u.ae(this.clouds_mid, "div", {
						"class":"right cloud " + i,
					})
					cloud_path = current_layer_cloud_gx[Math.round(u.random(0,current_layer_cloud_gx.length-1))]
					if (cloud_path == previous_cloud_path) {
						continue
					}
					previous_cloud_path = cloud_path;
					this["img_right_cloud_" + i] = u.ae(this["div_right_cloud_" + i], "img", {
						"src":cloud_path
					})
					u.ass(this["div_right_cloud_" + i], {
						"position":"absolute",
						"top":current_ypos + "px",
						"right": 0 + Math.round(u.random(-20, 100)) + "px"
					})
				}
				else if (current_layer == "back") {
					this["div_right_cloud_" + i] = u.ae(this.clouds_back, "div", {
						"class":"right cloud " + i,
					})
					cloud_path = current_layer_cloud_gx[Math.round(u.random(0,current_layer_cloud_gx.length-1))]
					if (cloud_path == previous_cloud_path) {
						continue
					}
					previous_cloud_path = cloud_path;
					this["img_right_cloud_" + i] = u.ae(this["div_right_cloud_" + i], "img", {
						"src":cloud_path
					})
					u.ass(this["div_right_cloud_" + i], {
						"position":"absolute",
						"top":current_ypos + "px",
						"right": 0 + Math.round(u.random(-20, 100)) + "px"
					})
				}
				clouds.push(this["div_right_cloud_" + i]);
				current_ypos = current_ypos + this["div_right_cloud_" + i].offsetHeight + Math.round(u.random(0,303))+ 160;
			}
			current_ypos = top_ypos;
			for (i = 0; current_ypos < this.clouds_front.offsetHeight; i++) {
				current_layer = this.layer_names[Math.round(u.random(0,2))];
				current_layer_cloud_gx = this.clouds_gx[current_layer];
				if (current_layer == "front") {
					this["div_center_cloud_" + i] = u.ae(this.clouds_front, "div", {
						"class":"center cloud " + i,
					})
					cloud_path = current_layer_cloud_gx.center[Math.round(u.random(0,current_layer_cloud_gx.center.length-1))]
					if (cloud_path == previous_cloud_path) {
						continue
					}
					previous_cloud_path = cloud_path;
					this["img_center_cloud_" + i] = u.ae(this["div_center_cloud_" + i], "img", {
						"src":cloud_path
					})
				}
				else if (current_layer == "mid") {
					this["div_center_cloud_" + i] = u.ae(this.clouds_mid, "div", {
						"class":"center cloud " + i,
					})
					cloud_path = current_layer_cloud_gx[Math.round(u.random(0,current_layer_cloud_gx.length-1))]
					if (cloud_path == previous_cloud_path) {
						continue
					}
					previous_cloud_path = cloud_path;
					this["img_center_cloud_" + i] = u.ae(this["div_center_cloud_" + i], "img", {
						"src":cloud_path
					})
				}
				else if (current_layer == "back") {
					this["div_center_cloud_" + i] = u.ae(this.clouds_back, "div", {
						"class":"center cloud " + i,
					})
					cloud_path = current_layer_cloud_gx[Math.round(u.random(0,current_layer_cloud_gx.length-1))]
					if (cloud_path == previous_cloud_path) {
						continue
					}
					previous_cloud_path = cloud_path;
					this["img_center_cloud_" + i] = u.ae(this["div_center_cloud_" + i], "img", {
						"src":cloud_path
					})
				}
				u.ass(this["div_center_cloud_" + i], {
					"position":"absolute",
					"top":current_ypos + "px",
					"left":"50%"
				})
				u.ass(this["img_center_cloud_" + i], {
					"margin-left":Math.round(u.random(-300,300)) + "px"
				}) 
				clouds.push(this["div_center_cloud_" + i]);
				current_ypos = current_ypos + this["div_center_cloud_" + i].offsetHeight + Math.round(u.random(0, 150)+60);
			}
			function shuffle(array) {
				var currentIndex = array.length, temporaryValue, randomIndex;
				while (0 !== currentIndex) {
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}
				return array;
			}
			clouds_shuffled = shuffle(clouds);
			for (i = 0; i < clouds_shuffled.length; i++) {				
				u.a.transition(clouds_shuffled[i], "all 1.8s ease-in " + i*40 + "ms");
				u.ass(clouds_shuffled[i], {
					"opacity":1
				})
			}
		}
		div.destroy = function() {
			u.ass(this, {
				"overflow-y":"hidden"
			})
			for (i = 0; i < clouds_shuffled.length; i++) {				
				u.a.transition(clouds_shuffled[i], "all 1.8s ease-in " + i*75 + "ms");
				u.ass(clouds_shuffled[i], {
					"opacity":0 
				})
			}
			this.finalize = function() {
				u.ass(this, {
					"display":"none"
				});
			}
			u.t.setTimer(this, "finalize", 1800 + i*75 + 200);
			this.is_done = true;
			page.cN.scene.controller();
		}
		div.ready();
	}
}


/*i-side_a.js*/
Util.Objects["side_a"] = new function() {
	this.init = function(div) {
		div.resized = function(event) {
			if(this.is_active) {
				if(this.canvas) {
					this.canvas.height = page.browser_h;
					this.canvas.width = page.browser_w;
					this.center_x = Math.round(page.browser_w/2);
					this.center_y = Math.round(page.browser_h/2);
					if(page.browser_h > page.browser_w) {
						this.radius = this.center_x - 35;
					}
					else {
						this.radius = this.center_y - 35;
					}
					if(this.is_ready) {
						window.scrollTo(0,this.offsetTop);
					}
					if(this.player) {
						this.updateCanvas(this.player.currentTime);
					}
				}
				if(this.song_title) {
					u.ass(this.song_title, {
						top: ((page.browser_h - this.song_title.offsetHeight)/2) + "px"
					});
				}
				if(this.song_title_switcher) {
					u.ass(this.song_title_switcher, {
						top: ((page.browser_h - this.song_title_switcher.offsetHeight)/2) + "px"
					});
				}
				if(this.side_title) {
					u.ass(this.side_title, {
						top: (page.browser_h/3 + 15) + "px"
					});
				}
				if(this.track_status) {
					u.ass(this.track_status, {
						top: (page.browser_h/3 - 5) + "px"
					});
				}
				if(this.time_status) {
					u.ass(this.time_status, {
						top: ((page.browser_h/5 * 3) + 10) + "px"
					});
				}
				if(this.player && this.player.bn_play) {
					u.ass(this.player.bn_play, {
						top: ((page.browser_h/5 * 3) - 10) + "px",
					});
				}
			}
		}
		div.scrolled = function(event) {
			if(this.is_active) {
			}
		}
		div.ready = function() {
			if(!this.is_ready) {
				this.is_ready = true;
				u.rc(this, "i:side_a");
				this.canvas = u.ae(this, "canvas", {width:this.offsetWidth, height:page.browser_h});
				this.ctx = this.canvas.getContext("2d");
				this.cloud_left_top = div.addCloud("/img/gx_cloud_mid2", "cloud left top");
				this.cloud_left_middle = div.addCloud("/img/gx_cloud_front3", "cloud left middle");
				this.cloud_left_bottom = div.addCloud("/img/gx_cloud_front2", "cloud left bottom");
				this.cloud_right_top = div.addCloud("/img/gx_cloud_mid3", "cloud right top");
				this.cloud_right_middle = div.addCloud("/img/gx_cloud_front1", "cloud right middle");
				this.cloud_right_bottom = div.addCloud("/img/gx_cloud_front3", "cloud right bottom");
				u.a.translate(this.cloud_left_top, -660, 0);
				u.a.translate(this.cloud_left_middle, -660, 0);
				u.a.translate(this.cloud_left_bottom, -660, 0);
				u.a.translate(this.cloud_right_top, 660, 0);
				u.a.translate(this.cloud_right_middle, 660, 0);
				u.a.translate(this.cloud_right_bottom, 660, 0);
				page.cN.scene.controller();
			}
		}
		div.addCloud = function(image, classname) {
			var cloud = u.ae(this, "div", {
				class: classname
			});
			u.ae(cloud, "img", {
				src: image
			})
			return cloud;
		}
		div.build = function() {
			this.is_active = true;
			this.song_title = u.qs("h2", this);
			this.song_title_switcher = u.ae(this, "h2", {class:"song_title switch", html:"&nbsp;"});
			this.song_title_switcher.div = this;
			u.ass(this.song_title_switcher, {
				transform: "translate3d(0, 25px, 0)"
			});
			this.side_title = u.ae(this, "h3", {class:"side_title", html:"Himmelmekanik, Side A"});
			this.track_status = u.ae(this, "h3", {class:"track_status"});
			this.time_status = u.ae(this, "h3", {class:"time_status"});
			u.ass(this, {display:"block"});
			this.resized();
			u.ass(this, {opacity:1});
			this.tracks = {}; 
			var last_start = 0; 
			this.songs = u.qsa("ul > li", this); 
			for(var i = 0; i < this.songs.length; i++) {
				var song_end = this.songs[i].getAttribute("data-trackends");
				var song_number = ("0" + (i + 1));
				var song_name = this.songs[i].innerHTML;
				var song_object = {name:song_name, track:song_number, end:song_end}; 
				this.tracks[last_start] = song_object;
				last_start = song_end; 
			}
			this.track_keys = Object.keys(this.tracks);
			this.easing = u.easings["ease-in"];
			this.stopplayer = u.mediaPlayer({type:"audio"});
			u.ac(this.stopplayer, "stopplayer");
			this.player = u.mediaPlayer({type:"audio"});
			this.player.div = this;
			this.player.ready = function() {
				this.loading = function(event) {
					delete this.loading;
					u.ac(this, "loading");
				}
				this.playing = function(event) {
					delete this.playing;
					u.rc(this, "loading");
					this.is_playing = true;
					u.a.transition(this.div.track_status, "all 1.5s ease-in-out 1.5s");
					u.ass(this.div.track_status, {
						opacity: 1
					});
					u.a.transition(this.div.time_status, "all 1.5s ease-in-out 1.5s");
					u.ass(this.div.time_status, {
						opacity: 1
					});
					u.a.transition(this.div.side_title, "all 1.5s ease-in-out 1.5s");
					u.ass(this.div.side_title, {
						opacity: 1
					});
					u.a.transition(this.div.song_title, "all 1.5s ease-in-out 1.5s");
					u.ass(this.div.song_title, {
						opacity: 1
					});
					if(this.div.current_track && this.div.current_track.name) {
						this.div.updateTitle(this.div.current_track.name);
					}
					this.div.stopplayer.load("/assets/stop");
					t_addevents = u.t.setTimer(this.div, "addStopEvents", 5000);
				}
				this.timeupdate = function(event) {
					if(this.div.current_track_i === undefined) {
						this.div.current_track_i = 0;
						this.div.current_track = this.div.tracks[this.div.track_keys[this.div.current_track_i]];
						this.div.updateTitle(this.div.current_track.name);
						this.div.track_status.innerHTML = this.div.current_track.track + "/11";
					}
					else if(this.currentTime > this.div.current_track.end) {
						this.div.current_track_i++;
						this.div.current_track = this.div.tracks[this.div.track_keys[this.div.current_track_i]];
						if(this.div.current_track_i >= this.div.track_keys.length) {
							this.stop();
							this.div.destroy();
							delete this.timeupdate;
							return;
						}
						this.div.updateTitle(this.div.current_track.name);
						this.div.track_status.innerHTML = this.div.current_track.track + "/11";
					}
					this.div.time_status.innerHTML = u.period("m:s", {seconds: this.currentTime-this.div.track_keys[this.div.current_track_i]});
					this.div.updateCanvas(this.currentTime);
				}
				if(!this.can_autoplay) {
					u.ac(this.div, "requires_action");
					this.bn_play = u.ae(this.div, "div", {class:"play", html:"Start"});
					this.bn_play.player = this;
					u.e.click(this.bn_play);
					this.bn_play.clicked = function() {
						this.player.loadAndPlay("/assets/side-a");
						u.a.transition(this, "all 1.5s ease-in-out", removeButton);
						u.ass(this, {
							opacity: 0,
						});
						function removeButton() {
							this.parentNode.removeChild(this);
						};
						delete this.clicked; 
					};
					u.ass(this.bn_play, {
						top: ((page.browser_h/5 * 3) - 10) + "px",
						opacity: 0,
						transform: "translate3d(0, 15px, 0)"
					});
					u.a.transition(this.bn_play, "all 1.5s ease-in-out");
					u.ass(this.bn_play, {
						opacity: 1,
						transform: "translate3d(0, 0, 0)"
					});
				}
				else {
					this.loadAndPlay("/assets/side-a");
				}
			}
			this.addStopEvents = function(event) {
				this.wheel_event_id = u.e.addWindowEvent(this, "wheel", this.stopOnInteraction);
				this.mousemove_event_id = u.e.addWindowEvent(this, "mousemove", this.stopOnInteraction);
				this.blur_event_id = u.e.addWindowEvent(this, "blur", this.stopOnInteraction);
				this.key_event_id = u.e.addWindowEvent(this, "keydown", this.stopOnInteraction);
			}
			this.playAgain = function(event) {
				this.player.play();
				this.currentVolume = 0;
				this.turnUpVolume = function() {
					if (this.currentVolume >= 1) {
						u.t.resetInterval(this.t_vol);
					}
					else {
						this.currentVolume = u.round(this.currentVolume + 0.01, 2);
						if (this.currentTime >= 1) {
							this.currentVolume = 1;
						}
						this.player.volume(this.currentVolume);
					}
				}
				this.t_vol = u.t.setInterval(this, "turnUpVolume", 20);
				this.moveCloudsBack(event);
				u.t.setTimer(this, "reactivatePlayback", 5000);
				u.a.transition(this.time_status, "all 1.5s ease-in-out 1.5s");
				u.ass(this.time_status, {
					opacity: 1,
				})
			}
			this.reactivatePlayback = function () {
				this.addStopEvents();
				this.is_stopped = false;
			}
			this.moveCloudsBack = function(event) {
				u.a.transition(this.cloud_left_top, "all 3s ease-in-out");
				u.a.transition(this.cloud_left_middle, "all 4s ease-in-out");
				u.a.transition(this.cloud_left_bottom, "all 2.5s ease-in-out");
				u.a.transition(this.cloud_right_top, "all 4s ease-in-out");
				u.a.transition(this.cloud_right_middle, "all 2.5s ease-in-out");
				u.a.transition(this.cloud_right_bottom, "all 3s ease-in-out");
				u.a.translate(this.cloud_left_top, -660, 0);
				u.a.translate(this.cloud_left_middle, -660, 0);
				u.a.translate(this.cloud_left_bottom, -660, 0);
				u.a.translate(this.cloud_right_top, 660, 0);
				u.a.translate(this.cloud_right_middle, 660, 0);
				u.a.translate(this.cloud_right_bottom, 660, 0);
			}
			this.stopOnInteraction = function(event) {
				if(!this.is_stopped) {
					this.is_stopped = true;
					this.player.volume(0);
					this.stopplayer.play(0);
					this.player.pause();
					u.a.transition(this.cloud_left_top, "all .2s ease-in-out");
					u.a.transition(this.cloud_left_middle, "all .3s ease-in-out");
					u.a.transition(this.cloud_left_bottom, "all .4s ease-in-out");
					u.a.transition(this.cloud_right_top, "all .4s ease-in-out");
					u.a.transition(this.cloud_right_middle, "all .2s ease-in-out");
					u.a.transition(this.cloud_right_bottom, "all .3s ease-in-out");
					u.a.translate(this.cloud_left_top, (page.browser_w / 4 - 200), 0);
					u.a.translate(this.cloud_left_middle, (page.browser_w / 4 - 450), 0);
					u.a.translate(this.cloud_left_bottom, (page.browser_w / 4 - 400), 0);
					u.a.translate(this.cloud_right_top, (- page.browser_w / 4 + 200), 0);
					u.a.translate(this.cloud_right_middle, (- page.browser_w / 4 + 350), 0);
					u.a.translate(this.cloud_right_bottom, (- page.browser_w / 4 + 300), 0);
					u.ac(this, "requires_action");
					this.bn_play = u.ae(this, "div", {class:"play", html:"Start"});
					this.bn_play.player = this;
					u.e.click(this.bn_play);
					this.bn_play.clicked = function(event) {
						page.cN.scene.side_a.playAgain(event);
						u.a.transition(this, "all 1.5s ease-in-out", removeButton);
						u.ass(this, {
							opacity: 0,
						});
						function removeButton() {
							this.parentNode.removeChild(this);
						};
						delete this.clicked; 
					}
					u.ass(this.bn_play, {
						top: ((page.browser_h/5 * 3) - 10) + "px",
						opacity: 0,
						transform: "translate3d(0, 15px, 0)"
					});
					u.a.transition(this.bn_play, "all 1.5s ease-in-out 0.5s");
					u.ass(this.bn_play, {
						opacity: 1,
						transform: "translate3d(0, 0, 0)"
					});
					u.a.transition(this.time_status, "all 0.5s ease-in-out");
					u.ass(this.time_status, {
						opacity: 0,
					})
					u.e.removeWindowEvent(this, "wheel", this.wheel_event_id);
					u.e.removeWindowEvent(this, "mousemove", this.mousemove_event_id);
					u.e.removeWindowEvent(this, "blur", this.blur_event_id);
					u.e.removeWindowEvent(this, "keydown", this.key_event_id);
				}
			}
			this.updateCanvas = function(progress) {
				this.ctx.clearRect(0, 0, page.browser_w, page.browser_h);
				// 
				this.ctx.beginPath();
				this.ctx.lineWidth = 4;
				this.ctx.strokeStyle = "#f6d874";
				this.ctx.arc(this.center_x, this.center_y, this.radius, -1*Math.PI, 1*Math.PI);
				this.ctx.stroke();
				this.ctx.closePath();
				this.ctx.beginPath();
				this.ctx.lineWidth = 4;
				this.ctx.strokeStyle = "#cc9c00";
				this.ctx.arc(this.center_x, this.center_y, this.radius, -(Math.PI/2), 2 * (progress / this.player.duration) * Math.PI - (Math.PI/2));
				this.ctx.stroke();
				this.ctx.closePath();
			}
			this.updateTitle = function(title) {
				this.song_title_switcher.innerHTML = title;
				page.resized();	
				this.song_title_switcher.transitioned = function() {
					this.div.song_title.innerHTML = this.innerHTML;
					page.resized();
					u.ass(this.div.song_title, {
						opacity:1,
						transform: "translate3d(0, 0, 0)"
					});
					u.ass(this, {
						opacity:0,
						transform: "translate3d(0, " + (this.offsetHeight*0.7) + "px, 0)"
					});
				}
				u.a.transition(this.song_title_switcher, "all 2s ease-in-out");
				u.ass(this.song_title_switcher, {
					opacity:1,
					transform: "translate3d(0,0,0)"
				});
				u.a.transition(this.song_title, "all 2s ease-in-out");
				u.ass(this.song_title, {
					opacity:0,
					transform: "translate3d(0, -" + (this.song_title.offsetHeight*0.7) + "px, 0)"
				});
			}
			u.ae(this, this.player);
			u.ae(this, this.stopplayer);
		}
		div.destroy = function() {
			u.a.transition(this.song_title, "all 1.5s ease-in-out");
			u.ass(this.song_title, {
				opacity:0, 
				transform: "scale(0.85)"
			});
			u.a.transition(this, "all 1s ease-in-out");
			u.ass(this, {opacity:0});
			u.e.removeWindowEvent(this, "wheel", this.wheel_event_id);
			u.e.removeWindowEvent(this, "mousemove", this.mousemove_event_id);
			u.e.removeWindowEvent(this, "blur", this.blur_event_id);
			u.e.removeWindowEvent(this, "keydown", this.key_event_id);
			u.t.setTimer(this, "finalize", 1700);
			this.finalize = function() {
				u.ass(this, {
					"display":"none"
				});
				this.is_done = true;
				page.cN.scene.controller();
			}
		}
		div.ready();
	}
}


/*i-intermezzo.js*/
Util.Objects["intermezzo"] = new function() {
	this.init = function(div) {
		div.resized = function(event) {
			if(this.is_active) {
				u.a.translate(this.cloud_left_top, (page.browser_w / 4 - 150), 0);
				u.a.translate(this.cloud_left_middle, (page.browser_w / 4 - 400), 0);
				u.a.translate(this.cloud_left_bottom, (page.browser_w / 4 - 200), 0);
				u.a.translate(this.cloud_right_top, (- page.browser_w / 4 + 300), 0);
				u.a.translate(this.cloud_right_middle, (- page.browser_w / 4 + 300), 0);
				u.a.translate(this.cloud_right_bottom, (- page.browser_w / 4 + 200), 0);
			}
		}
		div.scrolled = function(event) {
			if(this.is_active) {
			}
		}
		div.ready = function() {
			if(!this.is_ready) {
				page.cN.scene.intermezzo.table = u.wc(page.cN.scene.intermezzo, "div", {
					class:"table"
				})
				page.cN.scene.intermezzo.cell = u.wc(page.cN.scene.intermezzo.table, "div", {
					class:"cell"
				})
				this.addCloud = function(image, classname) {
					var cloud = u.ae(this, "div", {
						class: classname
					});
					u.ae(cloud, "img", {
						src: image
					})
					return cloud;
				}
				this.cloud_left_top = this.addCloud("/img/gx_cloud_mid2", "cloud left top");
				this.cloud_left_middle = this.addCloud("/img/gx_cloud_front3", "cloud left middle");
				this.cloud_left_bottom = this.addCloud("/img/gx_cloud_front2", "cloud left bottom");
				this.cloud_right_top = this.addCloud("/img/gx_cloud_mid3", "cloud right top");
				this.cloud_right_middle = this.addCloud("/img/gx_cloud_front1", "cloud right middle");
				this.cloud_right_bottom = this.addCloud("/img/gx_cloud_front3", "cloud right bottom");
				u.a.translate(this.cloud_left_top, -660, 0);
				u.a.translate(this.cloud_left_middle, -660, 0);
				u.a.translate(this.cloud_left_bottom, -660, 0);
				u.a.translate(this.cloud_right_top, 660, 0);
				u.a.translate(this.cloud_right_middle, 660, 0);
				u.a.translate(this.cloud_right_bottom, 660, 0);
				this.is_ready = true;
				u.rc(this, "i:intermezzo");
				page.cN.scene.controller();
			}
		}
		div.build = function() {
			u.ass (this, {
				"display":"block",
			})
			u.a.transition(this, "all 2s ease-in");
			u.ass (this, {
				"opacity":1
			})
			this.resized();
			var transition_time = 1;
			u.a.transition(this.cloud_left_top, "all " + transition_time * 1.7 + "s ease-in-out");
			u.a.transition(this.cloud_left_middle, "all " + transition_time * 1.6 + "s ease-in-out");
			u.a.transition(this.cloud_left_bottom, "all " + transition_time * 1.2 + "s ease-in-out");
			u.a.transition(this.cloud_right_top, "all " + transition_time * 1.4 + "s ease-in-out");
			u.a.transition(this.cloud_right_middle, "all " + transition_time * 1.3 + "s ease-in-out");
			u.a.transition(this.cloud_right_bottom, "all " + transition_time + "s ease-in-out");
			u.a.translate(this.cloud_left_top, (page.browser_w / 4 - 200), 0);
			u.a.translate(this.cloud_left_middle, (page.browser_w / 4 - 450), 0);
			u.a.translate(this.cloud_left_bottom, (page.browser_w / 4 - 400), 0);
			u.a.translate(this.cloud_right_top, (- page.browser_w / 4 + 200), 0);
			u.a.translate(this.cloud_right_middle, (- page.browser_w / 4 + 350), 0);
			u.a.translate(this.cloud_right_bottom, (- page.browser_w / 4 + 300), 0);
			u.t.setTimer(this, this.destroy, 10000);
			this.is_active = true;
		}
		div.destroy = function() {
			this.moveCloudsBack = function(event) {
				var transition_time = 1;
				u.a.transition(this.cloud_left_top, "all " + transition_time * 1.7 + "s ease-in-out");
				u.a.transition(this.cloud_left_middle, "all " + transition_time * 1.6 + "s ease-in-out");
				u.a.transition(this.cloud_left_bottom, "all " + transition_time * 1.2 + "s ease-in-out");
				u.a.transition(this.cloud_right_top, "all " + transition_time * 1.4 + "s ease-in-out");
				u.a.transition(this.cloud_right_middle, "all " + transition_time * 1.3 + "s ease-in-out");
				u.a.transition(this.cloud_right_bottom, "all " + transition_time + "s ease-in-out");
				u.a.translate(this.cloud_left_top, -660, 0);
				u.a.translate(this.cloud_left_middle, -660, 0);
				u.a.translate(this.cloud_left_bottom, -660, 0);
				u.a.translate(this.cloud_right_top, 660, 0);
				u.a.translate(this.cloud_right_middle, 660, 0);
				u.a.translate(this.cloud_right_bottom, 660, 0);
			}
			u.a.transition(this, "all 1s ease-in")
			u.ass(this, {
				"opacity":0
			})
			this.moveCloudsBack();
			u.t.setTimer(this, "finalize", 1700);
			this.finalize = function() {
				u.ass(this, {
					"display":"none"
				});
				this.is_done = true;
				page.cN.scene.controller();
			}
		}
		div.ready();
	}
}


/*i-side_b.js*/
Util.Objects["side_b"] = new function() {
	this.init = function(div) {
		div.resized = function(event) {
			if(this.is_active) {
				if(this.canvas) {
					this.canvas.height = page.browser_h;
					this.canvas.width = page.browser_w;
					this.center_x = Math.round(page.browser_w/2);
					this.center_y = Math.round(page.browser_h/2);
					if(page.browser_h > page.browser_w) {
						this.radius = this.center_x - 35;
					}
					else {
						this.radius = this.center_y - 35;
					}
					if(this.is_ready) {
						window.scrollTo(0,this.offsetTop);
					}
					if(this.player) {
						this.updateCanvas(this.player.currentTime);
					}
				}
				if(this.song_title) {
					u.ass(this.song_title, {
						top: ((page.browser_h - this.song_title.offsetHeight)/2) + "px"
					});
				}
				if(this.song_title_switcher) {
					u.ass(this.song_title_switcher, {
						top: ((page.browser_h - this.song_title_switcher.offsetHeight)/2) + "px"
					});
				}
				if(this.side_title) {
					u.ass(this.side_title, {
						top: (page.browser_h/3 + 15) + "px"
					});
				}
				if(this.track_status) {
					u.ass(this.track_status, {
						top: (page.browser_h/3 - 5) + "px"
					});
				}
				if(this.time_status) {
					u.ass(this.time_status, {
						top: ((page.browser_h/5 * 3) + 10) + "px"
					});
				}
				if(this.player && this.player.bn_play) {
					u.ass(this.player.bn_play, {
						top: ((page.browser_h/5 * 3) - 10) + "px",
					});
				}
			}
		}
		div.scrolled = function(event) {
			if(this.is_active) {
			}
		}
		div.ready = function() {
			if(!this.is_ready) {
				this.is_ready = true;
				u.rc(this, "i:side_b");
				this.canvas = u.ae(this, "canvas", {width:this.offsetWidth, height:page.browser_h});
				this.ctx = this.canvas.getContext("2d");
				this.cloud_left_top = div.addCloud("/img/gx_cloud_mid2", "cloud left top");
				this.cloud_left_middle = div.addCloud("/img/gx_cloud_front3", "cloud left middle");
				this.cloud_left_bottom = div.addCloud("/img/gx_cloud_front2", "cloud left bottom");
				this.cloud_right_top = div.addCloud("/img/gx_cloud_mid3", "cloud right top");
				this.cloud_right_middle = div.addCloud("/img/gx_cloud_front1", "cloud right middle");
				this.cloud_right_bottom = div.addCloud("/img/gx_cloud_front3", "cloud right bottom");
				u.a.translate(this.cloud_left_top, -660, 0);
				u.a.translate(this.cloud_left_middle, -660, 0);
				u.a.translate(this.cloud_left_bottom, -660, 0);
				u.a.translate(this.cloud_right_top, 660, 0);
				u.a.translate(this.cloud_right_middle, 660, 0);
				u.a.translate(this.cloud_right_bottom, 660, 0);
				page.cN.scene.controller();
			}
		}
		div.addCloud = function(image, classname) {
			var cloud = u.ae(this, "div", {
				class: classname
			});
			u.ae(cloud, "img", {
				src: image
			})
			return cloud;
		}
		div.build = function() {
			this.is_active = true;
			this.song_title = u.qs("h2", this);
			this.song_title_switcher = u.ae(this, "h2", {class:"song_title switch", html:"&nbsp;"});
			this.song_title_switcher.div = this;
			u.ass(this.song_title_switcher, {
				transform: "translate3d(0, 25px, 0)"
			});
			this.side_title = u.ae(this, "h3", {class:"side_title", html:"Himmelmekanik, side B"});
			this.track_status = u.ae(this, "h3", {class:"track_status"});
			this.time_status = u.ae(this, "h3", {class:"time_status"});
			u.ass(this, {display:"block"});
			this.resized();
			u.ass(this, {opacity:1});
			this.tracks = {}; 
			var last_start = 0; 
			this.songs = u.qsa("ul > li", this); 
			for(var i = 0; i < this.songs.length; i++) {
				var song_end = this.songs[i].getAttribute("data-trackends");
				var song_number = ("0" + (i + 1));
				var song_name = this.songs[i].innerHTML;
				var song_object = {name:song_name, track:song_number, end:song_end}; 
				this.tracks[last_start] = song_object;
				last_start = song_end; 
			}
			this.track_keys = Object.keys(this.tracks);
			this.easing = u.easings["ease-in"];
			this.stopplayer = u.mediaPlayer({type:"audio"});
			u.ac(this.stopplayer, "stopplayer");
			this.player = u.mediaPlayer({type:"audio"});
			this.player.div = this;
			this.player.ready = function() {
				this.loading = function(event) {
					delete this.loading;
					u.ac(this, "loading");
				}
				this.playing = function(event) {
					delete this.playing;
					u.rc(this, "loading");
					this.is_playing = true;
					u.a.transition(this.div.track_status, "all 0.5s ease-in-out");
					u.ass(this.div.track_status, {
						opacity: 1
					});
					u.a.transition(this.div.time_status, "all 0.5s ease-in-out");
					u.ass(this.div.time_status, {
						opacity: 1
					});
					u.a.transition(this.div.side_title, "all 0.5s ease-in-out");
					u.ass(this.div.side_title, {
						opacity: 1
					});
					u.a.transition(this.div.song_title, "all 0.5s ease-in-out");
					u.ass(this.div.song_title, {
						opacity: 1
					});
					if(this.div.current_track && this.div.current_track.name) {
						this.div.updateTitle(this.div.current_track.name);
					}
					this.div.stopplayer.load("/assets/stop");
					t_addevents = u.t.setTimer(this.div, "addStopEvents", 5000);
				}
				this.timeupdate = function(event) {
					if(this.div.current_track_i === undefined) {
						this.div.current_track_i = 0;
						this.div.current_track = this.div.tracks[this.div.track_keys[this.div.current_track_i]];
						this.div.updateTitle(this.div.current_track.name);
						this.div.track_status.innerHTML = this.div.current_track.track + "/11";
					}
					else if(this.currentTime > this.div.current_track.end) {
						this.div.current_track_i++;
						this.div.current_track = this.div.tracks[this.div.track_keys[this.div.current_track_i]];
						if(this.div.current_track_i >= this.div.track_keys.length) {
							this.stop();
							this.div.destroy();
							delete this.timeupdate;
							return;
						}
						this.div.updateTitle(this.div.current_track.name);
						this.div.track_status.innerHTML = this.div.current_track.track + "/11";
					}
					this.div.time_status.innerHTML = u.period("m:s", {seconds: this.currentTime-this.div.track_keys[this.div.current_track_i]});
					this.div.updateCanvas(this.currentTime);
				}
				if(!this.can_autoplay) {
					u.ac(this.div, "requires_action");
					this.bn_play = u.ae(this.div, "div", {class:"play", html:"Start"});
					this.bn_play.player = this;
					u.e.click(this.bn_play);
					this.bn_play.clicked = function() {
						this.player.loadAndPlay("/assets/side-b");
						u.a.transition(this, "all 2s ease-in-out", removeButton);
						u.ass(this, {
							opacity: 0,
						});
						function removeButton() {
							this.parentNode.removeChild(this);
						};
						delete this.clicked; 
					}
					u.ass(this.bn_play, {
						top: ((page.browser_h/5 * 3) - 10) + "px",
						opacity: 0,
						transform: "translate3d(0, 15px, 0)"
					});
					u.a.transition(this.bn_play, "all 2s ease-in-out");
					u.ass(this.bn_play, {
						opacity: 1,
						transform: "translate3d(0, 0, 0)"
					});
				}
				else {
					this.loadAndPlay("/assets/side-b");
				}
			}
			this.addStopEvents = function(event) {
				this.wheel_event_id = u.e.addWindowEvent(this, "wheel", this.stopOnInteraction);
				this.mousemove_event_id = u.e.addWindowEvent(this, "mousemove", this.stopOnInteraction);
				this.blur_event_id = u.e.addWindowEvent(this, "blur", this.stopOnInteraction);
				this.key_event_id = u.e.addWindowEvent(this, "keydown", this.stopOnInteraction);
			}
			this.playAgain = function(event) {
				this.player.play();
				this.currentVolume = 0;
				this.turnUpVolume = function() {
					if (this.currentVolume >= 1) {
						u.t.resetInterval(this.t_vol);
					}
					else {
						this.currentVolume = u.round(this.currentVolume + 0.01, 2);
						if (this.currentTime >= 1) {
							this.currentVolume = 1;
						}
						this.player.volume(this.currentVolume);
					}
				}
				this.t_vol = u.t.setInterval(this, "turnUpVolume", 20);
				this.moveCloudsBack(event);
				u.t.setTimer(this, "reactivatePlayback", 5000);
				u.a.transition(this.time_status, "all 1.5s ease-in-out 1.5s");
				u.ass(this.time_status, {
					opacity: 1,
				})
			}
			this.reactivatePlayback = function () {
				this.addStopEvents();
				this.is_stopped = false;
			}
			this.moveCloudsBack = function(event) {
				u.a.transition(this.cloud_left_top, "all 3s ease-in-out");
				u.a.transition(this.cloud_left_middle, "all 4s ease-in-out");
				u.a.transition(this.cloud_left_bottom, "all 2.5s ease-in-out");
				u.a.transition(this.cloud_right_top, "all 4s ease-in-out");
				u.a.transition(this.cloud_right_middle, "all 2.5s ease-in-out");
				u.a.transition(this.cloud_right_bottom, "all 3s ease-in-out");
				u.a.translate(this.cloud_left_top, -660, 0);
				u.a.translate(this.cloud_left_middle, -660, 0);
				u.a.translate(this.cloud_left_bottom, -660, 0);
				u.a.translate(this.cloud_right_top, 660, 0);
				u.a.translate(this.cloud_right_middle, 660, 0);
				u.a.translate(this.cloud_right_bottom, 660, 0);
			}
			this.stopOnInteraction = function(event) {
				if(!this.is_stopped) {
					this.is_stopped = true;
					this.player.volume(0);
					this.stopplayer.play(0);
					this.player.pause();
					u.a.transition(this.cloud_left_top, "all .2s ease-in-out");
					u.a.transition(this.cloud_left_middle, "all .3s ease-in-out");
					u.a.transition(this.cloud_left_bottom, "all .4s ease-in-out");
					u.a.transition(this.cloud_right_top, "all .4s ease-in-out");
					u.a.transition(this.cloud_right_middle, "all .2s ease-in-out");
					u.a.transition(this.cloud_right_bottom, "all .3s ease-in-out");
					u.a.translate(this.cloud_left_top, (page.browser_w / 4 - 200), 0);
					u.a.translate(this.cloud_left_middle, (page.browser_w / 4 - 450), 0);
					u.a.translate(this.cloud_left_bottom, (page.browser_w / 4 - 400), 0);
					u.a.translate(this.cloud_right_top, (- page.browser_w / 4 + 200), 0);
					u.a.translate(this.cloud_right_middle, (- page.browser_w / 4 + 350), 0);
					u.a.translate(this.cloud_right_bottom, (- page.browser_w / 4 + 300), 0);
					u.ac(this, "requires_action");
					this.bn_play = u.ae(this, "div", {class:"play", html:"Start"});
					this.bn_play.player = this;
					u.e.click(this.bn_play);
					this.bn_play.clicked = function(event) {
						page.cN.scene.side_b.playAgain(event);
						u.a.transition(this, "all 1.5s ease-in-out", removeButton);
						u.ass(this, {
							opacity: 0,
						});
						function removeButton() {
							this.parentNode.removeChild(this);
						};
						delete this.clicked; 
					}
					u.ass(this.bn_play, {
						top: ((page.browser_h/5 * 3) - 10) + "px",
						opacity: 0,
						transform: "translate3d(0, 15px, 0)"
					});
					u.a.transition(this.bn_play, "all 1.5s ease-in-out 0.5s");
					u.ass(this.bn_play, {
						opacity: 1,
						transform: "translate3d(0, 0, 0)"
					});
					u.a.transition(this.time_status, "all 0.5s ease-in-out");
					u.ass(this.time_status, {
						opacity: 0,
					})
					u.e.removeWindowEvent(this, "wheel", this.wheel_event_id);
					u.e.removeWindowEvent(this, "mousemove", this.mousemove_event_id);
					u.e.removeWindowEvent(this, "blur", this.blur_event_id);
					u.e.removeWindowEvent(this, "keydown", this.key_event_id);
				}
			}
			this.updateCanvas = function(progress) {
				this.ctx.clearRect(0, 0, page.browser_w, page.browser_h);
				// 
				this.ctx.beginPath();
				this.ctx.lineWidth = 4;
				this.ctx.strokeStyle = "#f6d874";
				this.ctx.arc(this.center_x, this.center_y, this.radius, -1*Math.PI, 1*Math.PI);
				this.ctx.stroke();
				this.ctx.closePath();
				this.ctx.beginPath();
				this.ctx.lineWidth = 4;
				this.ctx.strokeStyle = "#cc9c00";
				this.ctx.arc(this.center_x, this.center_y, this.radius, -(Math.PI/2), 2 * (progress / this.player.duration) * Math.PI - (Math.PI/2));
				this.ctx.stroke();
				this.ctx.closePath();
			}
			this.updateTitle = function(title) {
				this.song_title_switcher.innerHTML = title;
				page.resized();	
				this.song_title_switcher.transitioned = function() {
					this.div.song_title.innerHTML = this.innerHTML;
					page.resized();
					u.ass(this.div.song_title, {
						opacity:1,
						transform: "translate3d(0, 0, 0)"
					});
					u.ass(this, {
						opacity:0,
						transform: "translate3d(0, " + (this.offsetHeight*0.7) + "px, 0)"
					});
				}
				u.a.transition(this.song_title_switcher, "all 2s ease-in-out");
				u.ass(this.song_title_switcher, {
					opacity:1,
					transform: "translate3d(0,0,0)"
				});
				u.a.transition(this.song_title, "all 2s ease-in-out");
				u.ass(this.song_title, {
					opacity:0,
					transform: "translate3d(0, -" + (this.song_title.offsetHeight*0.7) + "px, 0)"
				});
			}
			u.ae(this, this.player);
			u.ae(this, this.stopplayer);
		}
		div.destroy = function() {
			u.a.transition(this.song_title, "all 1.5s ease-in-out");
			u.ass(this.song_title, {
				opacity:0, 
				transform: "scale(0.85)"
			});
			u.a.transition(this, "all 1s ease-in-out");
			u.ass(this, {opacity:0});
			u.e.removeWindowEvent(this, "wheel", this.wheel_event_id);
			u.e.removeWindowEvent(this, "mousemove", this.mousemove_event_id);
			u.e.removeWindowEvent(this, "blur", this.blur_event_id);
			u.e.removeWindowEvent(this, "keydown", this.key_event_id);
			u.t.setTimer(this, "finalize", 1700);
			this.finalize = function() {
				u.ass(this, {
					"display":"none"
				});
				this.is_done = true;
				page.cN.scene.controller();
			}
		}
		div.ready();
	}
}


/*i-finale.js*/
Util.Objects["finale"] = new function() {
	this.init = function(div) {
		div.resized = function(event) {
			if(this.is_active) {
				u.a.translate(this.cloud_left_top, (page.browser_w / 4 - 150), 0);
				u.a.translate(this.cloud_left_middle, (page.browser_w / 4 - 400), 0);
				u.a.translate(this.cloud_left_bottom, (page.browser_w / 4 - 200), 0);
				u.a.translate(this.cloud_right_top, (- page.browser_w / 4 + 300), 0);
				u.a.translate(this.cloud_right_middle, (- page.browser_w / 4 + 300), 0);
				u.a.translate(this.cloud_right_bottom, (- page.browser_w / 4 + 200), 0);
			}
		}
		div.scrolled = function(event) {
			if(this.is_active) {
			}
		}
		div.ready = function() {
			if(!this.is_ready) {
				page.cN.scene.finale.table = u.wc(page.cN.scene.finale, "div", {
					"class":"table"
				});
				page.cN.scene.finale.table.cell = u.wc(page.cN.scene.finale.table, "div", {
					"class":"cell"
				});
				this.listen_again = u.qs(".scene .finale .listen", this);
				u.ce(this.listen_again);
				this.listen_again.clicked = function() {
					location.reload(true);
				}
				this.ask_question = u.qs(".scene .finale .question", this);
				u.e.click(this.ask_question);
				this.ask_question.clicked = function() {
					location.href = "mailto:marc@marcfacchini.dk";
				}
				this.addCloud = function(image, classname) {
					var cloud = u.ae(this, "div", {
						class: classname
					});
					u.ae(cloud, "img", {
						src: image
					})
					return cloud;
				}
				this.cloud_left_top = this.addCloud("/img/gx_cloud_mid2", "cloud left top");
				this.cloud_left_middle = this.addCloud("/img/gx_cloud_front3", "cloud left middle");
				this.cloud_left_bottom = this.addCloud("/img/gx_cloud_front2", "cloud left bottom");
				this.cloud_right_top = this.addCloud("/img/gx_cloud_mid3", "cloud right top");
				this.cloud_right_middle = this.addCloud("/img/gx_cloud_front1", "cloud right middle");
				this.cloud_right_bottom = this.addCloud("/img/gx_cloud_front3", "cloud right bottom");
				u.a.translate(this.cloud_left_top, -660, 0);
				u.a.translate(this.cloud_left_middle, -660, 0);
				u.a.translate(this.cloud_left_bottom, -660, 0);
				u.a.translate(this.cloud_right_top, 660, 0);
				u.a.translate(this.cloud_right_middle, 660, 0);
				u.a.translate(this.cloud_right_bottom, 660, 0);
				this.is_ready = true;
				u.rc(this, "i:finale");
				page.cN.scene.controller();
			}
		}
		div.build = function() {
			u.ass (this, {
				"display":"block",
			})
			u.a.transition(this, "all 2s ease-in");
			u.ass (this, {
				"opacity":1
			})
			var transition_time = 1;
			u.a.transition(this.cloud_left_top, "all " + transition_time * 1.7 + "s ease-in-out");
			u.a.transition(this.cloud_left_middle, "all " + transition_time * 1.6 + "s ease-in-out");
			u.a.transition(this.cloud_left_bottom, "all " + transition_time * 1.2 + "s ease-in-out");
			u.a.transition(this.cloud_right_top, "all " + transition_time * 1.4 + "s ease-in-out");
			u.a.transition(this.cloud_right_middle, "all " + transition_time * 1.3 + "s ease-in-out");
			u.a.transition(this.cloud_right_bottom, "all " + transition_time + "s ease-in-out");
			u.a.translate(this.cloud_left_top, (page.browser_w / 4 - 200), 0);
			u.a.translate(this.cloud_left_middle, (page.browser_w / 4 - 450), 0);
			u.a.translate(this.cloud_left_bottom, (page.browser_w / 4 - 400), 0);
			u.a.translate(this.cloud_right_top, (- page.browser_w / 4 + 200), 0);
			u.a.translate(this.cloud_right_middle, (- page.browser_w / 4 + 350), 0);
			u.a.translate(this.cloud_right_bottom, (- page.browser_w / 4 + 300), 0);
			this.is_active = true;	
		}
		div.destroy = function() {
			this.is_done = true;
			page.cN.scene.controller();
		}
		div.ready();
	}
}


/*i-cookies.js*/
Util.Objects["cookies"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
		}
		scene.scrolled = function() {
		}
		scene.ready = function() {
			console.log("hello");
			var button = u.qs('.button');
			button.addEventListener("click", function() {
				window.localStorage.cookie_accept = true;
				if (location.href.match(/cookies_en/)) {
					location.href = "/en";
				}
				else {
					location.href = "/";
				}
			});
		}
		scene.ready();
	}
}


/*u-settings.js*/
u.ga_account = 'UA-128898964-1';
u.ga_domain = 'himmelmekanik.dk';
u.gapi_key = '';


/*u-googleanalytics.js*/
if(u.ga_account) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.defer=true;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', u.ga_account, u.ga_domain);
    ga('send', 'pageview');
	u.stats = new function() {
		this.pageView = function(url) {
			ga('send', 'pageview', url);
		}
		this.event = function(node, _options) {
			var event = false;
			var eventCategory = "Uncategorized";
			var eventAction = null;
			var eventLabel = null;
			var eventValue = null;
			var nonInteraction = false;
			var hitCallback = null;
			if(obj(_options)) {
				var _argument;
				for(_argument in _options) {
					switch(_argument) {
						case "event"				: event					= _options[_argument]; break;
						case "eventCategory"		: eventCategory			= _options[_argument]; break;
						case "eventAction"			: eventAction			= _options[_argument]; break;
						case "eventLabel"			: eventLabel			= _options[_argument]; break;
						case "eventValue"			: eventValue			= _options[_argument]; break;
						case "nonInteraction"		: nonInteraction		= _options[_argument]; break;
						case "hitCallback"			: hitCallback			= _options[_argument]; break;
					}
				}
			}
			if(!eventAction && event && event.type) {
				eventAction = event.type;
			}
			else if(!eventAction) {
				eventAction = "Unknown";
			}
			if(!eventLabel && event && event.currentTarget && event.currentTarget.url) {
				eventLabel = event.currentTarget.url;
			}
			else if(!eventLabel) {
				eventLabel = this.nodeSnippet(node);
			}
			ga('send', 'event', {
				"eventCategory": eventCategory, 
				"eventAction": eventAction,
				"eventLabel": eventLabel,
				"eventValue": eventValue,
				"nonInteraction": nonInteraction,
				"hitCallback": hitCallback
			});
		}
		// 	
		// 	//       slot,		
		// 	//       name,		
		// 	//       value,	
		// 	//       scope		
		// 	
		this.nodeSnippet = function(node) {
			return u.cutString(u.text(node).trim(), 20) + "(<"+node.nodeName+">)";
		}
	}
}

