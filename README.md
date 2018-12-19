# de-async

Node.js module to queue multiple async processes into a single-use queue.

## Usage

First:

```
npm install https://github.com/ja5087/de-async
```

### Example


~~~~
var Sync = require('de-async');

var pQueue = new Sync(4, () => {console.log("queue depleted")});

//push a function that accepts one callback
pQueue.push(

    function(callback)
    {
    setTimeout(callback, 5000);
    }
);

//or push a function that accepts a callback as the last argument, and pass in that callback as the second argument.
pQueue.push(function_with_callback,callback);


pQueue.begin();
~~~~

### new Sync(maxConcurrent, function: callback)

Initializes a new synchronized queue with maximum concurrent processes ```maxConcurrent```.

 ```callback``` will be called once the queue is depleted.

Example:
```
var pQueue = new Sync(4, () => {console.log("queue depleted")});
```


### Sync.push(function: task(cb) [,callback])

Pushes a new task to the queue. 

Any callbacks that would be normally passed to this task must be passed in as the second argument. 
de-async will automatically call that callback with copied arguments.

Example:

~~~~
var exec = require('child_process').exec;
pQueue.push(
    exec.bind(null, "mkdir", {env: process.env}),

    function(error, stdout, stderr)
    {
        //Will be called with copied arguments after exec returns
    }
);
~~~~

### Sync.begin()

Begins execution of the queue.


## License

ISC




