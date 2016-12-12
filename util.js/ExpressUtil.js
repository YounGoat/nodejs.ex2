var MODULE_REQUIRE
	/* built-in */

	/* NPM */
	, express = require('express')
	/* in-package */
	;

var METHODS = [
	  'checkout'
	, 'copy'
	, 'delete'
	, 'get'
	, 'head'
	, 'lock'
	, 'merge'
	, 'mkactivity'
	, 'mkcol'
	, 'move'
	, 'm-search'
	, 'notify'
	, 'options'
	, 'patch'
	, 'post'
	, 'purge'
	, 'put'
	, 'report'
	, 'search'
	, 'subscribe'
	, 'trace'
	, 'unlock'
	, 'unsubscribe'
];

var ExpressUtil = {};

// Judge if "foo" is created according to "proto".
// 判断 foo 是否仿照 proto 创建。
// express 中使用了克隆方式创建相关对象，故无法通过对象的原型判断其类别。
// @TODO 判断逻辑不严谨，可能发生误判。
ExpressUtil.prototypeof = function(instance, protoname) {
	var matched = true;
	var proto = express[protoname];
	for (var name in proto) {
		// Sometimes, one is null, and the other one is undefined.
		if (!instance.hasOwnProperty(name) && !instance[name] && proto[name]) {
			matched = false;
			break;
		}
	}
	return matched;
};

// Create an express Router instance.
ExpressUtil.Router = function(router) {
	var expressRouter;
	if (ExpressUtil.prototypeof(router, 'router')) {
		expressRouter = router;
	}
	else {
		expressRouter = express.Router();
		if (typeof router == 'fucntion') {
			expressRouter.all('/', router);
		}
		METHODS.forEach(function(method) {
			if (router[method]) {
				expressRouter[method]('/', router[method]);
			}
		})
	}
	return expressRouter;
};

module.exports = ExpressUtil;
