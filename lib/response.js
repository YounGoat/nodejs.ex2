var Response = function (res) {
	this.res = res;
};

Response.prototype.render = function(engine, view, locals, callback) {
	ex2(this.res.app).setViewEngine(engine);
	this.res.render(view, locals, callback);
	ex2(this.res.app).resetViewEngine();
};

module.exports = Response;
