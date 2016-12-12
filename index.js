var MODULE_REQUIRE
	/* built-in */

	/* NPM */
	, express = require('express')
	, yuan = require('yuan')

	/* in-package */
	, ExpressUtil = require('./util/ExpressUtil')
	;


// Core function, return wrapped and expanded instance of Express objects.
function ex2(what) {
	if (!what.__yuan_express_extend) {
		var protoname;
		for (var name in Ex2) {
			if (ExpressUtil.prototypeof(what, name)) {
				protoname = name;
				break;
			}
		}
		if (!protoname) {
			throw 'Unsupported instance to be expanded by ex2';
		}
		what.__yuan_express_extend = new Ex2[protoname](what);
	}
	return what.__yuan_express_extend;
}

var Ex2 = {
	application : require('./lib/application'),
	response    : require('./lib/response')
};

module.exports = ex2;
