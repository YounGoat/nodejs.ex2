var MODULE_REQUIRE
	/* built-in */

	/* NPM */
	, express = require('express')
	, yuan = require('yuan')

	/* in-package */
	;

// Judge if "foo" is created according to "proto".
// 判断 foo 是否仿照 proto 创建。
// express 中使用了克隆方式创建相关对象，故无法通过对象的原型判断其类别。
// @TODO 判断逻辑不严谨，可能发生误判。
function _is_proto_of(proto, foo) {
	var matched = true;
	for (var name in proto) {
		// Sometimes, one is null, and the other one is undefined.
		if (!foo.hasOwnProperty(name) && !foo[name] && proto[name]) {
			matched = false;
			break;
		}
	}
	return matched;
}

// Core function, return wrapped and expanded instance of Express objects.
function ex2(what) {
	var protoname;
	for (var name in Ex2) {
		var proto = express[name];
		if (_is_proto_of(proto, what)) {
			protoname = name;
			break;
		}
	}
	if (!what.__yuan_express_extend) {
		what.__yuan_express_extend = new Ex2[protoname](what);
	}
	return what.__yuan_express_extend;
}

var Ex2 = {
	application : require('./lib/application'),
	response    : require('./lib/response')
};

module.exports = ex2;
