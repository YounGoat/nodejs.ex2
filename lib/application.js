var MODULE_REQUIRE
	/* built-in */
	, path = require('path')

	/* NPM */
	, debug = require('debug')('EX2')
	, yuan = require('yuan')
	, yuancon = require('yuan-console')

	/* in-package */
	, ExpressUtil = require('../util/ExpressUtil')
	;


var Application = function(app) {
	this.app = app;

	this.viewEngines = {};
	this.viewEngineDefault = void(0);
};

Application.prototype.addViewEngine = yuan.overload.Function()
	.overload(
		String,
		String,
		yuan.overload.Type.nullable(Function),
		function(name, dirname, engine) {
			if (dirname) {
				this.viewEngines[name] = {
					dirname: dirname
				};
			}
			if (engine) {
				this.app.engine(name, engine);
			}

			// 首次添加的模板引擎，将被作为默认模板引擎。
			if (!this.viewEngineDefault) {
				this.setViewEngine(name, true);
			}
		}
	)
	.overload(
		String,
		String,
		function(name, dirname) {
			this.addViewEngine(name, dirname, null);
		}
	);

Application.prototype.resetViewEngine = function() {
	this.setViewEngine(this.viewEngineDefault);
};

Application.prototype.setViewEngine = function(name, asDefault) {
	var engine = this.viewEngines[name];
	this.app.set('views', engine.dirname);
	this.app.set('view engine', name);

	if (asDefault) {
		this.viewEngineDefault = name;
	}
};

/**
 * @param {String}     pathname          Realpath of directory where routers stored.
 * @param {Object}    [options]
 * @param {String}    [options.index]
 * @param {String}    [options.star]
 */
Application.prototype.route = function(pathname, options) {
	options = yuan.object.extend({
		index: 'index',
		star: '_'
	}, options);

	const URL_DEP = '/';
	var app = this.app;

	var apply = function(realpath) {
		// A router should be a javascript file.
		if (path.extname(realpath) != '.js') return;

		// slice() used to cut off the extname.
		var urlpath = path.relative(pathname, realpath).slice(0, -3);

		// If filename matchs indexName, the router will be used to interpret requests like '/foo/'.
		var basename = path.basename(urlpath);
		if (basename == options.index || basename == options.star) {
			urlpath = path.dirname(urlpath);
			if (urlpath == '.') {
				urlpath = '';
			}
		}

		// Normalize the url path.
		if (path.sep != URL_DEP) {
			urlpath = urlpath.replace(path.sep, URL_DEP);
		}
		urlpath = URL_DEP + urlpath;

		var router = require(realpath);
		router = ExpressUtil.parseRouter(router, basename == options.star ? '*' : '/');

		// Apply the router.
		app.use(urlpath, router);
		debug('Router loaded for "' + urlpath + '"');
	};

	var traverse = function(pathname) {
		yuancon.fs.traverse(pathname, function(realpath) {
			if (yuancon.fs.isDir(realpath)) {
				traverse(realpath);
			}
			else {
				apply(realpath);
			}
		});
	};

	traverse(pathname);
};


module.exports = Application;
