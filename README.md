See [CHANGE LOG](./CHANGELOG.md) for notable changes.

#	EX2, Yuan-Express-Expand, another practice on Express

Genenally, we create a new application based on __Express__ via *express-generator*. The output of express-generator is regarded as the best practice of Express. However, I need something more convenient. So, *yuan-express-expand* is created.

##	Start Up

```bash
# Install.
npm install -g express-generator
npm install -g ex2

# Create a new application based on Express.
express myExpressApp
```

Then, edit ```./app.js``` to apply *yuan-express-expand* in your Express application.
```javascript
// app.js
// ...
// Require the module in the begining.
const ex2 = require('ex2');

// ...
// Delete the code about routes.

// var routes = require('./routes/index');
// var users = require('./routes/users');
// ...
// app.use('/', routes);
// app.use('/users', users);

// Then, replaced with ex2 code.
ex2(app).route('./routes');
```

Start the app, everything is OK as it has been before ex2 used：

```bash
# Start HTTP server listening at 8080.
PORT=8000 bin/www

open http://localhost:8080/users/
```

##	ex2(app)

This method will return an wrapped instance of *Express.application*.

###	Function: ex2(app).route()

Recursively find javascript files in specified directory, and use them as router for the same URL pathname.

```javascript
ex2(app).route('./routes', options);
```

In the previous case, e.g., if ```./routes/users.js``` exists, it will be used as router for URL pathname ```/users```. Same as,
```javascript
var users = require('./routes/users');
app.use('/users', users);
```

If one more router added to ```./routes```, no more statement needed to modify ```app``` as what has to be done without ex2.

A javascript file in ```./routes``` directory may export a normal Express.Router instance as usual. It can also be in more simple form, e.g.
```javascript
// Not necessary to be initialized by express.Router().
module.exports = {
	// Use "METHOD: FUNCTION" instead of execute the METHOD('/', FUNCTION) function.
	get: function(res, req, next) {
		// ...
	},

	post: function(res, req, next) {
		// ...
	}
};
```

Options used in ```ex2(app).route()``` may include:
*	__index__  
	default: "index"  
	Javascript file with name "index" will be used as default router instead of router for ".../index".

##	References

*	A Brief Introduction To Express  
	https://youngoat.gitbooks.io/a-brief-history-of-node-js/content/expressjs.html
